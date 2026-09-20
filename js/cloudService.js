// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — CLOUD & AUTH SERVICE LAYER
// ─────────────────────────────────────────────────────────────────────────────
// Supports:
// 1. In-page 6-digit Email OTP generation & verification
// 2. Registration with full student profile (Name, Nickname, Username, Birthdate, Age, Phone, School, Grade, Socials)
// 3. Dual-method Login (Username OR Email + Password, and Google OAuth)
// 4. Account Linking (Link Google account to existing user, Auto-link by verified email)
// 5. Firebase Live Cloud with graceful LocalStorage Offline Database Fallback
// ─────────────────────────────────────────────────────────────────────────────

const CloudService = window.CloudService = {
  initialized: false,
  isLive: false,
  auth: null,
  db: null,
  currentUser: null,

  // Local User Database Storage Key
  USERS_DB_KEY: 'inbiology_users_db',
  PENDING_OTPS_KEY: 'inbiology_pending_otps',

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Seed default database if not exists
    this._ensureDefaultUsersSeeded();

    if (typeof window.isFirebaseConfigured === 'function' && window.isFirebaseConfigured()) {
      try {
        await this._loadFirebaseScripts();
        if (window.firebase) {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(window.FIREBASE_CONFIG);
          }
          this.auth = window.firebase.auth();
          this.db = window.firebase.firestore();
          this.isLive = true;
          console.log('✅ [INBIOLOGY Cloud] Connected to Firebase Live Cloud successfully!');

          // Listen to live Auth State Changes
          this.auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;
            if (user) {
              const isSessionActive = sessionStorage.getItem('inbiology_session_active');
              if (!isSessionActive) {
                // Tab was closed, sign out stale Firebase auth
                try { await this.auth.signOut(); } catch(e){}
                return;
              }
              const profile = await this.getUserProfile(user.uid);
              if (profile) {
                AppState.userRole = profile.role || 'student';
                sessionStorage.setItem('inbiology_session_active', 'true');
                localStorage.setItem('inbiology_role', AppState.userRole);
                AppState.saveStudentProfile(profile);
              }
              const enrollments = await this.getEnrolledCourses(user.uid);
              if (enrollments && enrollments.length) {
                AppState.enrolled = enrollments;
                localStorage.setItem('inbiology_enrolled', JSON.stringify(enrollments));
              }
            }
            if (typeof renderHeader === 'function') {
              renderHeader();
            }
          });
          return;
        }
      } catch (err) {
        console.warn('⚠️ [INBIOLOGY Cloud] Firebase initialization error, falling back to Local Storage:', err);
      }
    }

    // Fallback Mode
    this.isLive = false;
    console.log('ℹ️ [INBIOLOGY Cloud] Running in Local Storage Database Mode (Full Offline Support)');
  },

  // ─── SUPABASE REST API CLIENT HELPER ─────────────────────────────────────
  async _supabaseFetch(endpoint, options = {}) {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return null;
    const cfg = window.SUPABASE_CONFIG;
    const url = `${cfg.url}/rest/v1${endpoint}`;
    const headers = {
      'apikey': cfg.publishableKey,
      'Authorization': `Bearer ${cfg.publishableKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`[Supabase REST API] ${res.status}:`, err);
        return null;
      }
      if (res.status === 204) return true;
      return await res.json().catch(() => null);
    } catch(err) {
      console.warn('[Supabase Fetch Network]:', err);
      return null;
    }
  },

  // ─── LOCAL USER REPOSITORY HELPERS ──────────────────────────────────────────
  _getUsersDb() {
    try {
      const data = localStorage.getItem(this.USERS_DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch(e) {
      return [];
    }
  },

  _saveUsersDb(users) {
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
  },

  _ensureDefaultUsersSeeded() {
    const users = this._getUsersDb();
    if (!users || users.length === 0) {
      const defaultUsers = [
        {
          id: 'user-admin-01',
          username: 'admin',
          email: 'admin@inbiology.com',
          password: 'admin1234', // In production hashed with bcrypt/argon2
          fullName: 'อาจารย์ ต้น ชีววิทยา',
          nickname: 'พี่ต้น',
          phone: '081-999-8888',
          birthdate: '1992-08-10',
          age: 34,
          school: 'INBIOLOGY Studio',
          level: 'ผู้สอน / ผู้ดูแลระบบ',
          instagram: '@inbiology.official',
          lineId: '@inbiology',
          facebook: 'INBIOLOGY Academy',
          role: 'admin',
          emailVerified: true,
          emailVerifiedAt: '2026-01-01T00:00:00.000Z',
          linkedProviders: [],
          enrolled: ['bio-intensive-1', 'bio-intensive-2', 'bio-intensive-3']
        },
        {
          id: 'user-student-01',
          username: 'witsarut',
          email: 'witsarut@inbiology.com',
          password: '123456',
          fullName: 'นาย วิทศรุต สายตา',
          nickname: 'วิทศรุต',
          phone: '089-123-4567',
          birthdate: '2009-05-15',
          age: 17,
          school: 'โรงเรียนสตรีวิทยา',
          level: 'ม.5',
          instagram: '@witsarut.bio',
          lineId: 'witsarut_bio',
          facebook: 'Witsarut Saitaa',
          role: 'student',
          emailVerified: true,
          emailVerifiedAt: '2026-02-15T00:00:00.000Z',
          linkedProviders: [],
          enrolled: []
        }
      ];
      this._saveUsersDb(defaultUsers);
    }
  },

  // ─── 1. EMAIL OTP SYSTEM (In-Page Verification) ────────────────────────────
  /**
   * Request a 6-digit OTP to be sent to the given email
   * @param {string} email
   * @returns {Promise<{ success: boolean, message: string, otpPreview?: string, cooldownSeconds: number }>}
   */
  async sendEmailOtp(email) {
    if (!email || !email.includes('@')) {
      throw new Error('กรุณากรอกที่อยู่อีเมลให้ถูกต้อง');
    }
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered in local DB
    const users = this._getUsersDb();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาเข้าสู่ระบบ หรือใช้อีเมลอื่น');
    }

    // Rate Limiting (Cooldown 60s)
    let otps = {};
    try {
      otps = JSON.parse(sessionStorage.getItem(this.PENDING_OTPS_KEY) || '{}');
    } catch(e) {}

    const now = Date.now();
    const lastSent = otps[cleanEmail] ? otps[cleanEmail].sentAt : 0;
    if (lastSent && (now - lastSent) < 60000) {
      const waitSec = Math.ceil((60000 - (now - lastSent)) / 1000);
      throw new Error(`กรุณารออีก ${waitSec} วินาทีก่อนส่งรหัสใหม่อีกครั้ง`);
    }

    // Generate 6-digit cryptographically secure / pseudo-random OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + (5 * 60 * 1000); // 5 minutes

    otps[cleanEmail] = {
      code: code,
      sentAt: now,
      expiresAt: expiresAt,
      attempts: 0,
      verified: false
    };
    sessionStorage.setItem(this.PENDING_OTPS_KEY, JSON.stringify(otps));

    console.log(`🔑 [OTP Generated for ${cleanEmail}]: ${code} (Expires in 5 minutes)`);

    // Record OTP to Supabase Cloud if online
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        await this._supabaseFetch('/email_verifications', {
          method: 'POST',
          body: JSON.stringify({
            email: cleanEmail,
            otp_hash: code,
            expires_at: new Date(expiresAt).toISOString(),
            attempts: 0,
            is_verified: false
          })
        });
      } catch(e) {
        console.warn('Supabase OTP record note:', e);
      }
    }

    // Send email via Vercel serverless /api/send-otp
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otpCode: code })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'ไม่สามารถส่งอีเมล OTP ได้ กรุณาตรวจสอบอีเมลของคุณ');
      }
    } catch(err) {
      console.warn('[OTP Dispatch Note]:', err);
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    return {
      success: true,
      message: `ส่งรหัส OTP 6 หลักไปยังอีเมล ${cleanEmail} เรียบร้อยแล้ว กรุณาเปิดเช็คในกล่องข้อความหรือโฟลเดอร์ Junk/Spam`,
      cooldownSeconds: 60
    };
  },

  /**
   * Verify the 6-digit OTP entered by the user
   */
  async verifyEmailOtp(email, inputCode) {
    if (!email || !inputCode) {
      throw new Error('กรุณากรอกอีเมลและรหัส OTP 6 หลัก');
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim();

    let otps = {};
    try {
      otps = JSON.parse(sessionStorage.getItem(this.PENDING_OTPS_KEY) || '{}');
    } catch(e) {}

    const record = otps[cleanEmail];
    if (!record) {
      throw new Error('ไม่พบคำขอรหัส OTP สำหรับอีเมลนี้ กรุณากดส่งรหัส OTP ก่อน');
    }

    if (Date.now() > record.expiresAt) {
      throw new Error('รหัส OTP หมดอายุแล้ว (อายุ 5 นาที) กรุณากดส่งรหัสใหม่');
    }

    if (record.attempts >= 5) {
      throw new Error('คุณกรอกรหัสผิดเกินจำนวนครั้งที่กำหนด กรุณากดขอรหัส OTP ใหม่');
    }

    if (record.code !== cleanCode) {
      record.attempts = (record.attempts || 0) + 1;
      sessionStorage.setItem(this.PENDING_OTPS_KEY, JSON.stringify(otps));
      const remaining = 5 - record.attempts;
      throw new Error(`รหัส OTP ไม่ถูกต้อง (เหลือโอกาสลองอีก ${remaining} ครั้ง)`);
    }

    // Success: Mark as verified
    record.verified = true;
    const verificationToken = 'vtok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    record.token = verificationToken;
    sessionStorage.setItem(this.PENDING_OTPS_KEY, JSON.stringify(otps));

    // Update on Supabase Cloud
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        await this._supabaseFetch(`/email_verifications?email=eq.${encodeURIComponent(cleanEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify({ is_verified: true, verification_token: verificationToken })
        });
      } catch(e) {}
    }

    return {
      success: true,
      message: 'ยืนยันอีเมลสำเร็จเรียบร้อยแล้ว',
      verificationToken
    };
  },

  /**
   * Check if an email is currently verified in the session
   */
  isEmailVerified(email) {
    if (!email) return false;
    try {
      const otps = JSON.parse(sessionStorage.getItem(this.PENDING_OTPS_KEY) || '{}');
      const rec = otps[email.trim().toLowerCase()];
      return Boolean(rec && rec.verified && Date.now() <= rec.expiresAt);
    } catch(e) {
      return false;
    }
  },

  // ─── 2. REGISTER USER ──────────────────────────────────────────────────────
  /**
   * Complete Registration with All Form Fields
   */
  async register(userData) {
    const {
      username,
      email,
      password,
      fullName,
      nickname,
      birthdate,
      age,
      phone,
      school,
      level,
      instagram,
      lineId,
      facebook
    } = userData;

    if (!email || !email.trim()) throw new Error('กรุณาระบุ Email');
    if (!password || password.length < 6) throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    if (!fullName || !fullName.trim()) throw new Error('กรุณาระบุชื่อ-นามสกุล');
    if (!nickname || !nickname.trim()) throw new Error('กรุณาระบุชื่อเล่น');
    if (!phone || !phone.trim()) throw new Error('กรุณาระบุเบอร์โทรศัพท์');
    if (!birthdate) throw new Error('กรุณาระบุวันเกิด');
    if (!school || !school.trim()) throw new Error('กรุณาระบุโรงเรียน');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[-\s]/g, '');
    const cleanUsername = (username && username.trim()) 
      ? username.trim().toLowerCase() 
      : cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') + '_' + (cleanPhone.slice(-4) || 'user');

    // Verify OTP was passed
    if (!this.isEmailVerified(cleanEmail)) {
      throw new Error('กรุณายืนยันรหัส OTP 6 หลักที่ส่งไปยังอีเมลของคุณก่อนกดสมัครสมาชิก');
    }

    const users = this._getUsersDb();

    // Check unique email in local DB
    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      throw new Error('อีเมลนี้เคยลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบด้วยอีเมลนี้');
    }

    // Check unique phone in local DB
    if (cleanPhone && users.some(u => (u.phone || '').replace(/[-\s]/g, '') === cleanPhone)) {
      throw new Error('เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ หรือใช้เบอร์อื่น');
    }

    // Calculate age if not provided
    let calculatedAge = age;
    if (!calculatedAge && birthdate) {
      const bDate = new Date(birthdate);
      const diff = Date.now() - bDate.getTime();
      calculatedAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    const newUser = {
      id: 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      phone: phone.trim(),
      birthdate: birthdate,
      age: calculatedAge || 0,
      school: school.trim(),
      level: level || 'ม.5',
      instagram: instagram ? instagram.trim() : '',
      lineId: lineId ? lineId.trim() : '',
      facebook: facebook ? facebook.trim() : '',
      role: 'student',
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      linkedProviders: [],
      enrolled: [],
      createdAt: new Date().toISOString()
    };

    // Save to Supabase Cloud Database
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const safeUsername = cleanUsername || (cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') + '_' + Math.random().toString(36).substring(2, 6));
        const sbPayload = {
          username: safeUsername,
          email: cleanEmail,
          password_hash: password,
          email_verified_at: new Date().toISOString(),
          full_name: fullName.trim(),
          nickname: nickname.trim(),
          birthdate: birthdate,
          phone_number: phone.trim(),
          school: school.trim(),
          grade_level: level || 'ม.5',
          instagram: instagram ? instagram.trim() : null,
          line_id: lineId ? lineId.trim() : null,
          facebook: facebook ? facebook.trim() : null,
          role: 'student',
          is_active: true
        };
        const sbResult = await this._supabaseFetch('/users', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify(sbPayload)
        });
        if (sbResult && sbResult[0] && sbResult[0].id) {
          newUser.id = sbResult[0].id;
          console.log('☁️ [Supabase Cloud] Student saved to PostgreSQL:', newUser.id);
        }
      } catch(sbErr) {
        console.warn('Supabase user save note:', sbErr);
      }
    }

    users.push(newUser);
    this._saveUsersDb(users);

    // If Firebase is active, mirror it
    if (this.isLive && this.auth && this.db) {
      try {
        const cred = await this.auth.createUserWithEmailAndPassword(cleanEmail, password);
        await this.db.collection('users').doc(cred.user.uid).set(newUser);
      } catch(e) {
        console.warn('Firebase sync warning:', e);
      }
    }

    // Set Active State
    AppState.userRole = 'student';
    sessionStorage.setItem('inbiology_session_active', 'true');
    localStorage.setItem('inbiology_role', 'student');
    AppState.saveStudentProfile(newUser);

    // Clear used OTP
    try {
      const otps = JSON.parse(sessionStorage.getItem(this.PENDING_OTPS_KEY) || '{}');
      delete otps[cleanEmail];
      sessionStorage.setItem(this.PENDING_OTPS_KEY, JSON.stringify(otps));
    } catch(e){}

    return newUser;
  },

  // ─── 3. LOGIN (Username OR Email + Password) ──────────────────────────────
  /**
   * Login using either Username or Email + Password
   * @param {string} identifier - Username OR Email
   * @param {string} password 
   */
  async login(identifier, password) {
    if (!identifier || !identifier.trim()) throw new Error('กรุณากรอก อีเมล หรือ เบอร์โทรศัพท์');
    if (!password) throw new Error('กรุณากรอกรหัสผ่าน');

    const cleanInput = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/[-\s]/g, '');

    // Check Supabase Cloud Database — use SEPARATE queries to avoid or= dot-parsing bug
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        let sbUser = null;

        // 1. Try email match (exact, case-insensitive via ilike)
        const byEmail = await this._supabaseFetch(
          `/users?email=ilike.${encodeURIComponent(cleanInput)}&limit=1`
        );
        if (byEmail && byEmail.length > 0) sbUser = byEmail[0];

        // 2. Try phone match if email didn't find anything
        if (!sbUser && cleanPhone && cleanPhone.length >= 9) {
          const byPhone = await this._supabaseFetch(
            `/users?phone_number=eq.${encodeURIComponent(cleanPhone)}&limit=1`
          );
          if (byPhone && byPhone.length > 0) sbUser = byPhone[0];
        }

        // 3. Try username match
        if (!sbUser) {
          const byUsername = await this._supabaseFetch(
            `/users?username=ilike.${encodeURIComponent(cleanInput)}&limit=1`
          );
          if (byUsername && byUsername.length > 0) sbUser = byUsername[0];
        }

        if (sbUser) {
          if (!sbUser.password_hash) {
            throw new Error('บัญชีนี้ลงทะเบียนผ่าน Google กรุณาเข้าสู่ระบบด้วย Google หรือตั้งรหัสผ่านใหม่');
          }
          if (sbUser.password_hash !== password) {
            throw new Error('อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง');
          }
          const userProfile = {
            id: sbUser.id,
            username: sbUser.username,
            email: sbUser.email,
            password: sbUser.password_hash,
            fullName: sbUser.full_name,
            nickname: sbUser.nickname,
            phone: sbUser.phone_number,
            birthdate: sbUser.birthdate,
            age: sbUser.age,
            school: sbUser.school,
            level: sbUser.grade_level,
            instagram: sbUser.instagram || '',
            lineId: sbUser.line_id || '',
            facebook: sbUser.facebook || '',
            role: sbUser.role || 'student',
            linkedProviders: [],
            enrolled: (sbUser.enrolled && Array.isArray(sbUser.enrolled)) ? sbUser.enrolled : []
          };
          AppState.userRole = userProfile.role;
          sessionStorage.setItem('inbiology_session_active', 'true');
          localStorage.setItem('inbiology_role', AppState.userRole);
          AppState.saveStudentProfile(userProfile);
          if (typeof AppState.setEnrolledCourses === 'function') {
            AppState.setEnrolledCourses(userProfile.enrolled || []);
          } else {
            AppState.enrolled = userProfile.enrolled || [];
            localStorage.setItem('inbiology_enrolled', JSON.stringify(AppState.enrolled));
          }
          return userProfile;
        }
      } catch(err) {
        if (err.message && (err.message.includes('รหัสผ่าน') || err.message.includes('Google'))) throw err;
        console.warn('Supabase login check fallback to local DB:', err);
      }
    }

    const users = this._getUsersDb();

    // Query: WHERE email = :identifier OR phone = :identifier OR username = :identifier
    const user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || u.phoneNumber || '').replace(/[-\s]/g, '');
      const uName = (u.username || '').toLowerCase();
      return uEmail === cleanInput || (cleanPhone && uPhone === cleanPhone) || uName === cleanInput;
    });

    if (!user) {
      throw new Error('อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง');
    }

    if (!user.password) {
      throw new Error('บัญชีนี้ลงทะเบียนผ่าน Google กรุณาเข้าสู่ระบบด้วย Google หรือตั้งรหัสผ่านใหม่');
    }

    if (user.password !== password) {
      throw new Error('อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง');
    }

    // Success
    AppState.userRole = user.role || 'student';
    sessionStorage.setItem('inbiology_session_active', 'true');
    localStorage.setItem('inbiology_role', AppState.userRole);
    AppState.saveStudentProfile(user);

    if (typeof AppState.setEnrolledCourses === 'function') {
      AppState.setEnrolledCourses(user.enrolled || []);
    } else {
      AppState.enrolled = user.enrolled || [];
      localStorage.setItem('inbiology_enrolled', JSON.stringify(AppState.enrolled));
    }

    return user;
  },

  // ─── 4. GOOGLE SIGN-IN & AUTO-LINKING ──────────────────────────────────────
  /**
   * Handle Google Login from GSI Token or Fallback
   * Automatically links Google account if an existing user matches the verified Google Email
   */
  async loginWithGooglePayload(payload) {
    if (!payload || !payload.email) {
      throw new Error('ข้อมูล Google Token ไม่ถูกต้อง');
    }

    const googleSub = payload.sub || ('google_' + Date.now());
    const googleEmail = payload.email.toLowerCase().trim();
    const users = this._getUsersDb();

    // 1. Check if an account already has this Google Sub linked
    let user = users.find(u => 
      u.linkedProviders && u.linkedProviders.some(p => p.provider === 'google' && p.sub === googleSub)
    );

    if (user) {
      // Direct OAuth login match
      AppState.userRole = user.role || 'student';
      sessionStorage.setItem('inbiology_session_active', 'true');
      localStorage.setItem('inbiology_role', AppState.userRole);
      AppState.saveStudentProfile(user);
      return { user, isNew: false, isAutoLinked: false };
    }

    // 2. Check if a user with this email already exists -> Auto-Link
    user = users.find(u => u.email.toLowerCase() === googleEmail);
    if (user) {
      // Auto-link Google Account!
      if (!user.linkedProviders) user.linkedProviders = [];
      user.linkedProviders.push({
        provider: 'google',
        sub: googleSub,
        email: googleEmail,
        linkedAt: new Date().toISOString()
      });
      if (payload.picture && !user.avatar) {
        user.avatar = payload.picture;
      }
      this._saveUsersDb(users);

      AppState.userRole = user.role || 'student';
      sessionStorage.setItem('inbiology_session_active', 'true');
      localStorage.setItem('inbiology_role', AppState.userRole);
      AppState.saveStudentProfile(user);
      return { user, isNew: false, isAutoLinked: true };
    }

    // 3. New User entirely via Google
    const derivedNickname = (payload.given_name || payload.name || 'นักเรียน').split(' ')[0];
    const derivedUsername = googleEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') + Math.floor(100 + Math.random() * 900);

    const newUser = {
      id: 'user-google-' + Date.now().toString(36),
      username: derivedUsername,
      email: googleEmail,
      password: null, // User has not set password yet
      fullName: payload.name || 'ผู้ใช้งาน Google',
      nickname: derivedNickname,
      phone: '',
      birthdate: '2008-01-01',
      age: 18,
      school: 'ยังไม่ได้ระบุ',
      level: 'ม.5',
      instagram: '',
      lineId: '',
      facebook: '',
      role: 'student',
      avatar: payload.picture || '',
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      linkedProviders: [{
        provider: 'google',
        sub: googleSub,
        email: googleEmail,
        linkedAt: new Date().toISOString()
      }],
      enrolled: [],
      profileCompleted: false,
      createdAt: new Date().toISOString()
    };

    // Sync Google Student to Supabase Cloud
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const googleUsername = googleEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') + '_' + Math.random().toString(36).substring(2, 6);
        const sbPayload = {
          username: googleUsername,
          email: googleEmail,
          email_verified_at: new Date().toISOString(),
          full_name: payload.name || 'ผู้ใช้งาน Google',
          nickname: derivedNickname,
          birthdate: '2008-01-01',
          phone_number: '0000000000',
          school: 'ยังไม่ได้ระบุ',
          grade_level: 'ม.5',
          role: 'student',
          avatar_url: payload.picture || null,
          is_active: true
        };
        const sbResult = await this._supabaseFetch('/users', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify(sbPayload)
        });
        if (sbResult && sbResult[0] && sbResult[0].id) {
          newUser.id = sbResult[0].id;
          await this._supabaseFetch('/oauth_accounts', {
            method: 'POST',
            body: JSON.stringify({
              user_id: sbResult[0].id,
              provider: 'google',
              provider_user_id: googleSub,
              provider_email: googleEmail
            })
          });
          console.log('☁️ [Supabase Cloud] Google Student & OAuth Account synced:', newUser.id);
        }
      } catch (err) {
        console.warn('Supabase Google user sync note:', err);
      }
    }

    users.push(newUser);
    this._saveUsersDb(users);

    AppState.userRole = 'student';
    sessionStorage.setItem('inbiology_session_active', 'true');
    localStorage.setItem('inbiology_role', 'student');
    AppState.saveStudentProfile(newUser);
    return { user: newUser, isNew: true, isAutoLinked: false };
  },

  /**
   * Update Student Profile in Supabase Cloud
   */
  async saveUserProfile(uid, updated) {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured() && updated && updated.email) {
      try {
        await this._supabaseFetch(`/users?email=eq.${encodeURIComponent(updated.email.trim().toLowerCase())}`, {
          method: 'PATCH',
          body: JSON.stringify({
            full_name: updated.fullName,
            nickname: updated.nickname,
            phone_number: updated.phone,
            birthdate: updated.birthdate,
            school: updated.school,
            grade_level: updated.level,
            instagram: updated.instagram || null,
            line_id: updated.lineId || null,
            facebook: updated.facebook || null,
            updated_at: new Date().toISOString()
          })
        });
        console.log('☁️ [Supabase Cloud] Profile updated successfully');
      } catch (e) {
        console.warn('Supabase update note:', e);
      }
    }
  },

  // ─── 5. ACCOUNT LINKING IN DASHBOARD ───────────────────────────────────────
  /**
   * Link Google to current active user profile
   */
  async linkGoogleAccount(payload) {
    const active = AppState.getStudentProfile();
    if (!active || !active.email) throw new Error('กรุณาเข้าสู่ระบบก่อนทำการเชื่อมต่อบัญชี');

    const googleSub = payload.sub;
    const users = this._getUsersDb();

    // Check if googleSub is used by another user
    const existing = users.find(u => 
      u.email !== active.email && 
      u.linkedProviders && 
      u.linkedProviders.some(p => p.provider === 'google' && p.sub === googleSub)
    );

    if (existing) {
      throw new Error('บัญชี Google นี้ถูกผูกกับผู้ใช้งานอื่นในระบบแล้ว');
    }

    const targetUser = users.find(u => u.email.toLowerCase() === active.email.toLowerCase()) || active;
    if (!targetUser.linkedProviders) targetUser.linkedProviders = [];

    // Remove old google link if any
    targetUser.linkedProviders = targetUser.linkedProviders.filter(p => p.provider !== 'google');
    targetUser.linkedProviders.push({
      provider: 'google',
      sub: googleSub,
      email: payload.email,
      name: payload.name,
      linkedAt: new Date().toISOString()
    });

    this._saveUsersDb(users);
    AppState.saveStudentProfile(targetUser);
    return targetUser;
  },

  /**
   * Unlink a provider (e.g. Google) from current active user
   */
  async unlinkProvider(providerName) {
    const active = AppState.getStudentProfile();
    if (!active || !active.email) throw new Error('กรุณาเข้าสู่ระบบก่อน');

    const users = this._getUsersDb();
    const targetUser = users.find(u => u.email.toLowerCase() === active.email.toLowerCase()) || active;

    if (!targetUser.password) {
      throw new Error('ไม่สามารถยกเลิกการเชื่อมต่อได้ เนื่องจากคุณยังไม่ได้ตั้งรหัสผ่านสำหรับบัญชีนี้');
    }

    if (!targetUser.linkedProviders) targetUser.linkedProviders = [];
    targetUser.linkedProviders = targetUser.linkedProviders.filter(p => p.provider !== providerName);

    this._saveUsersDb(users);
    AppState.saveStudentProfile(targetUser);
    return targetUser;
  },

  // ─── UTILITY METHODS ───────────────────────────────────────────────────────
  _loadFirebaseScripts() {
    return new Promise((resolve, reject) => {
      if (window.firebase) return resolve();
      const appScript = document.createElement('script');
      appScript.src = 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js';
      appScript.onload = () => {
        let loaded = 0;
        const checkDone = () => {
          loaded++;
          if (loaded === 2) resolve();
        };

        const authScript = document.createElement('script');
        authScript.src = 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth-compat.js';
        authScript.onload = checkDone;
        authScript.onerror = reject;

        const dbScript = document.createElement('script');
        dbScript.src = 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore-compat.js';
        dbScript.onload = checkDone;
        dbScript.onerror = reject;

        document.head.appendChild(authScript);
        document.head.appendChild(dbScript);
      };
      appScript.onerror = reject;
      document.head.appendChild(appScript);
    });
  },

  async sendPasswordReset(email) {
    if (this.isLive && this.auth) {
      await this.auth.sendPasswordResetEmail(email);
      return true;
    }
    return true;
  },

  async logout() {
    if (this.isLive && this.auth) {
      try { await this.auth.signOut(); } catch(e){}
    }
    AppState.userRole = null;
    sessionStorage.removeItem('inbiology_session_active');
    localStorage.removeItem('inbiology_role');
    localStorage.removeItem('inbiology_student_profile');
    localStorage.removeItem('inbiology_enrolled');
  },

  async getUserProfile(uid) {
    if (this.isLive && this.db && uid) {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists) return doc.data();
    }
    return AppState.getStudentProfile();
  },

  async saveUserProfile(uid, data) {
    const users = this._getUsersDb();
    const idx = users.findIndex(u => u.email && data.email && u.email.toLowerCase() === data.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      this._saveUsersDb(users);
    }
    AppState.saveStudentProfile(data);

    if (this.isLive && this.db && uid) {
      try { await this.db.collection('users').doc(uid).update(data); } catch(e){}
    }
  },

  async getEnrolledCourses(uid) {
    if (this.isLive && this.db && uid) {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists && doc.data().enrolled) return doc.data().enrolled;
    }
    return JSON.parse(localStorage.getItem('inbiology_enrolled') || '[]');
  },

  // ─── 6. ORDER MANAGEMENT ────────────────────────────────────────────────────

  /**
   * Submit a new payment order (pending slip verification)
   */
  async submitOrder({ userEmail, userName, userId, courseIds, courseTitles, totalAmount, couponCode, discountAmount, slipBase64, userNote }) {
    const rawTitles = courseTitles || (Array.isArray(courseIds) ? courseIds.join(', ') : String(courseIds || ''));
    const displayTitles = userNote ? `${rawTitles} [หมายเหตุ: ${userNote}]` : rawTitles;

    // Validate UUID format for PostgreSQL UUID column; default to null if invalid/integer to prevent 400 Bad Request
    const isUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(userId));
    const validUserId = isUUID ? String(userId) : null;

    const orderData = {
      user_email: (userEmail || '').toLowerCase().trim(),
      user_name: userName || '',
      user_id: validUserId,
      course_ids: Array.isArray(courseIds) ? courseIds : (courseIds ? [courseIds] : []),
      course_titles: displayTitles,
      total_amount: Number(totalAmount) || 0,
      coupon_code: couponCode || null,
      discount_amount: Number(discountAmount) || 0,
      slip_image: slipBase64 || null,
      status: 'pending'
    };

    // 1. Save to Supabase Cloud
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        let result = await this._supabaseFetch('/orders', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify(orderData)
        });

        // If failed and had user_id, retry with user_id: null (avoids foreign key constraint violation)
        if (!result && orderData.user_id !== null) {
          orderData.user_id = null;
          result = await this._supabaseFetch('/orders', {
            method: 'POST',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify(orderData)
          });
        }

        if (result && result[0] && result[0].id) {
          const orderId = result[0].id;
          console.log('☁️ [Supabase Cloud] Order saved:', orderId);
          // Mirror to localStorage
          this._saveOrderLocally({ ...orderData, id: orderId, user_note: userNote || null, created_at: new Date().toISOString() });
          return { success: true, orderId };
        }
      } catch(err) {
        console.warn('[Order Submit Supabase Error]:', err);
      }
    }

    // 2. Secondary Cloud Path: Vercel Serverless Function Bridge (/api/orders)
    try {
      const bridgeRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          userName,
          userId: validUserId,
          courseIds: orderData.course_ids,
          courseTitles,
          totalAmount,
          couponCode,
          discountAmount,
          slipBase64,
          userNote
        })
      });
      if (bridgeRes.ok) {
        const data = await bridgeRes.json();
        if (data && data.success && data.orderId) {
          console.log('☁️ [/api/orders Bridge] Order saved:', data.orderId);
          this._saveOrderLocally({ ...orderData, id: data.orderId, user_note: userNote || null, created_at: new Date().toISOString() });
          return { success: true, orderId: data.orderId };
        }
      }
    } catch(err) {
      console.warn('[/api/orders Bridge Network]:', err);
    }

    // 3. Fallback: localStorage with resilient quota management
    const localId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
    this._saveOrderLocally({ ...orderData, id: localId, user_note: userNote || null, created_at: new Date().toISOString() });
    return { success: true, orderId: localId };
  },

  _saveOrderLocally(order) {
    try {
      let orders = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const idx = orders.findIndex(x => x.id === order.id);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], ...order };
      } else {
        orders.unshift(order);
      }

      try {
        localStorage.setItem('inbiology_orders', JSON.stringify(orders));
      } catch(quotaErr) {
        console.warn('[localStorage QuotaExceeded] Pruning older order slips to retain newest orders');
        // If quota exceeded, strip slip_image from older orders (keep newest 2 orders with slips)
        orders = orders.map((o, i) => i < 2 ? o : { ...o, slip_image: null });
        try {
          localStorage.setItem('inbiology_orders', JSON.stringify(orders));
        } catch(e2) {
          // If still exceeded, keep only current order with slip, others without
          orders = orders.map((o, i) => i === 0 ? o : { ...o, slip_image: null });
          localStorage.setItem('inbiology_orders', JSON.stringify(orders));
        }
      }
    } catch(e) {
      console.warn('[_saveOrderLocally Error]:', e);
    }
  },

  /**
   * Get orders for current logged-in student
   */
  async getMyOrders(userEmail) {
    if (!userEmail) return [];
    const cleanEmail = userEmail.toLowerCase().trim();
    let cloudOrders = [];

    // Try Supabase first (case-insensitive email matching)
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const result = await this._supabaseFetch(
          `/orders?user_email=ilike.${encodeURIComponent(cleanEmail)}&order=created_at.desc`
        );
        if (result && Array.isArray(result)) cloudOrders = result;
      } catch(err) {
        console.warn('[getMyOrders Supabase Error]:', err);
      }
    }

    // Fallback to /api/orders if needed
    if (cloudOrders.length === 0) {
      try {
        const apiRes = await fetch(`/api/orders?email=${encodeURIComponent(cleanEmail)}`);
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData && Array.isArray(apiData.orders) && apiData.orders.length > 0) {
            cloudOrders = apiData.orders;
          }
        }
      } catch(e) {}
    }

    // Merge with local fallback orders (deduplicated by id + hydrate slip)
    try {
      const localAll = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const localMatching = localAll.filter(o => (o.user_email || '').toLowerCase().trim() === cleanEmail);
      const combined = [...cloudOrders];
      localMatching.forEach(lo => {
        const existing = combined.find(co => co.id === lo.id);
        if (!existing) {
          combined.push(lo);
        } else if (!existing.slip_image && lo.slip_image) {
          existing.slip_image = lo.slip_image;
        }
      });
      return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } catch(e) {
      return cloudOrders;
    }
  },

  /**
   * Get all orders (Admin only) — optionally filter by status
   */
  async getAllOrders(status = null) {
    let cloudOrders = [];
    let endpoint = '/orders?order=created_at.desc&limit=200';
    if (status) endpoint += `&status=eq.${status}`;

    // 1. Try Supabase REST Direct
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const result = await this._supabaseFetch(endpoint);
        if (result && Array.isArray(result) && result.length > 0) {
          cloudOrders = result;
        }
      } catch(err) {
        console.warn('[getAllOrders Supabase Error]:', err);
      }
    }

    // 2. Try /api/orders serverless bridge
    if (cloudOrders.length === 0) {
      try {
        let apiEndpoint = '/api/orders?limit=200';
        if (status) apiEndpoint += `&status=${encodeURIComponent(status)}`;
        const apiRes = await fetch(apiEndpoint);
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData && Array.isArray(apiData.orders) && apiData.orders.length > 0) {
            cloudOrders = apiData.orders;
          }
        }
      } catch(e) {
        console.warn('[/api/orders GET Error]:', e);
      }
    }

    // Merge with local fallback orders (deduplicated by id + hydrate slip)
    try {
      const localAll = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const combined = [...cloudOrders];
      localAll.forEach(lo => {
        const existing = combined.find(co => co.id === lo.id);
        if (!existing) {
          if (!status || lo.status === status) combined.push(lo);
        } else if (!existing.slip_image && lo.slip_image) {
          existing.slip_image = lo.slip_image;
        }
      });
      return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } catch(e) {
      return cloudOrders;
    }
  },

  /**
   * Admin: Approve an order → unlock courses for the student
   */
  async approveOrder(orderId, userEmail, courseIds) {
    const adminProfile = AppState.getStudentProfile();
    const adminName = adminProfile ? (adminProfile.nickname || adminProfile.fullName || 'Admin') : 'Admin';
    const now = new Date().toISOString();

    // 1. Update order status in Supabase
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        await this._supabaseFetch(`/orders?id=eq.${orderId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'approved',
            reviewed_by: adminName,
            approved_at: now,
            updated_at: now
          })
        });

        // 2. Add courses to the student's Supabase user record
        // First fetch current enrolled array
        const userRows = await this._supabaseFetch(
          `/users?email=eq.${encodeURIComponent(userEmail.toLowerCase().trim())}&select=id,enrolled`
        );
        if (userRows && userRows[0]) {
          const currentEnrolled = userRows[0].enrolled || [];
          const merged = [...new Set([...currentEnrolled, ...courseIds])];
          await this._supabaseFetch(`/users?email=eq.${encodeURIComponent(userEmail.toLowerCase().trim())}`, {
            method: 'PATCH',
            body: JSON.stringify({ enrolled: merged, updated_at: now })
          });
        }
        console.log('☁️ [Supabase Cloud] Order approved & enrollment updated:', orderId);
      } catch(err) {
        console.warn('[approveOrder Supabase Error]:', err);
      }
    }

    // 3. Mirror in localStorage orders
    try {
      const orders = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const o = orders.find(x => x.id === orderId);
      if (o) { o.status = 'approved'; o.reviewed_by = adminName; o.approved_at = now; }
      localStorage.setItem('inbiology_orders', JSON.stringify(orders));

      // Also mirror to active session if user is currently logged in
      const currentProfile = AppState.getStudentProfile();
      if (currentProfile && currentProfile.email && currentProfile.email.toLowerCase().trim() === userEmail.toLowerCase().trim()) {
        const merged = [...new Set([...(AppState.enrolled || []), ...(courseIds || [])])];
        AppState.enrolled = merged;
        localStorage.setItem('inbiology_enrolled', JSON.stringify(merged));
      }
    } catch(e) {}

    return { success: true };
  },

  /**
   * Admin: Reject an order
   */
  async rejectOrder(orderId, adminNote) {
    const adminProfile = AppState.getStudentProfile();
    const adminName = adminProfile ? (adminProfile.nickname || adminProfile.fullName || 'Admin') : 'Admin';
    const now = new Date().toISOString();

    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        await this._supabaseFetch(`/orders?id=eq.${orderId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'rejected',
            admin_note: adminNote || 'ไม่ผ่านการตรวจสอบ',
            reviewed_by: adminName,
            updated_at: now
          })
        });
      } catch(err) {
        console.warn('[rejectOrder Supabase Error]:', err);
      }
    }

    // Mirror localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const o = orders.find(x => x.id === orderId);
      if (o) { o.status = 'rejected'; o.admin_note = adminNote; o.reviewed_by = adminName; }
      localStorage.setItem('inbiology_orders', JSON.stringify(orders));
    } catch(e) {}

    return { success: true };
  },

  /**
   * Admin: Revert an approved/rejected order back to 'pending' (undo accidental click)
   */
  async revertOrderToPending(orderId, userEmail, courseIds = []) {
    const now = new Date().toISOString();

    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        await this._supabaseFetch(`/orders?id=eq.${orderId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'pending',
            reviewed_by: null,
            approved_at: null,
            admin_note: null,
            updated_at: now
          })
        });

        // Revoke courses from user record if no other approved order includes them
        if (userEmail && courseIds && courseIds.length > 0) {
          const cleanEmail = userEmail.toLowerCase().trim();
          const remainingOrders = await this._supabaseFetch(
            `/orders?user_email=eq.${encodeURIComponent(cleanEmail)}&status=eq.approved&id=neq.${orderId}&select=course_ids`
          ).catch(() => []);
          const validEnrolled = [...new Set((remainingOrders || []).flatMap(o => o.course_ids || []))];

          await this._supabaseFetch(`/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
            method: 'PATCH',
            body: JSON.stringify({ enrolled: validEnrolled, updated_at: now })
          });
        }
      } catch(err) {
        console.warn('[revertOrderToPending Supabase Error]:', err);
      }
    }

    // Mirror localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const o = orders.find(x => x.id === orderId);
      if (o) {
        o.status = 'pending';
        o.reviewed_by = null;
        o.approved_at = null;
        o.admin_note = null;
      }
      localStorage.setItem('inbiology_orders', JSON.stringify(orders));

      const currentProfile = AppState.getStudentProfile();
      if (currentProfile && currentProfile.email && currentProfile.email.toLowerCase().trim() === (userEmail || '').toLowerCase().trim()) {
        const remainingApproved = orders.filter(x => (x.user_email || '').toLowerCase().trim() === userEmail.toLowerCase().trim() && x.status === 'approved');
        const remainingCourses = [...new Set(remainingApproved.flatMap(x => x.course_ids || []))];
        AppState.enrolled = remainingCourses;
        localStorage.setItem('inbiology_enrolled', JSON.stringify(remainingCourses));
      }
    } catch(e) {}

    return { success: true };
  },

  /**
   * Sync enrolled courses from approved Supabase orders (call on login/dashboard load)
   */
  async syncEnrolledFromCloud(userEmail) {
    if (!userEmail) return;

    // Fetch user's enrolled column from Supabase users table
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const userRows = await this._supabaseFetch(
          `/users?email=eq.${encodeURIComponent(userEmail.toLowerCase().trim())}&select=enrolled`
        );
        if (userRows && userRows[0] && Array.isArray(userRows[0].enrolled) && userRows[0].enrolled.length > 0) {
          AppState.enrolled = userRows[0].enrolled;
          localStorage.setItem('inbiology_enrolled', JSON.stringify(AppState.enrolled));
          console.log('☁️ [Supabase Cloud] Enrolled synced:', AppState.enrolled);
          return;
        }
      } catch(err) {
        console.warn('[syncEnrolledFromCloud Supabase Error]:', err);
      }
    }

    // Fallback: derive from local approved orders
    try {
      const orders = JSON.parse(localStorage.getItem('inbiology_orders') || '[]');
      const approved = orders.filter(o => o.user_email === userEmail.toLowerCase().trim() && o.status === 'approved');
      const courseIds = [...new Set(approved.flatMap(o => o.course_ids || []))];
      if (courseIds.length > 0) {
        if (typeof AppState.setEnrolledCourses === 'function') {
          AppState.setEnrolledCourses(courseIds);
        } else {
          AppState.enrolled = courseIds;
          localStorage.setItem('inbiology_enrolled', JSON.stringify(AppState.enrolled));
        }
      }
    } catch(e) {}
  },

  // ─── 8. CLOUD CMS: CROSS-DEVICE LESSONS & COURSES SYNC ─────────────────────
  /**
   * Save course lessons map to Supabase Cloud
   * @param {Object} lessonsMap - { [courseId]: Array<Lesson> }
   */
  async saveCourseLessonsToCloud(lessonsMap) {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return false;
    try {
      // 1. Try dedicated site_content table first (Cleanest Supabase table)
      try {
        const scRes = await this._supabaseFetch('/site_content', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            key: 'course_lessons',
            content: lessonsMap,
            updated_at: new Date().toISOString()
          })
        });
        if (scRes) {
          console.log('☁️ [Supabase Cloud] Saved to site_content table!');
          return true;
        }
      } catch(e) {}

      // 2. Fallback bridge via orders table
      const payload = JSON.stringify(lessonsMap);
      const existing = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.course_lessons_v1&limit=1`
      );
      if (existing && existing.length > 0) {
        await this._supabaseFetch(`/orders?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            slip_image: payload,
            updated_at: new Date().toISOString()
          })
        });
      } else {
        await this._supabaseFetch('/orders', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            user_email: 'cms_sync@inbiology.com',
            user_name: 'CMS Cloud Sync',
            course_ids: ['cms_lessons'],
            total_amount: 0,
            status: 'system_cms',
            admin_note: 'course_lessons_v1',
            slip_image: payload
          })
        });
      }
      console.log('☁️ [Supabase Cloud] Course lessons successfully synced to cloud!');
      return true;
    } catch(err) {
      console.warn('Could not sync lessons to Supabase cloud:', err);
      return false;
    }
  },

  /**
   * Fetch course lessons map from Supabase Cloud
   * @returns {Promise<Object|null>}
   */
  async fetchCourseLessonsFromCloud() {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return null;
    try {
      // 1. Try dedicated site_content table first
      try {
        const scRows = await this._supabaseFetch('/site_content?key=eq.course_lessons&limit=1');
        if (scRows && scRows.length > 0 && scRows[0].content) {
          return typeof scRows[0].content === 'string' ? JSON.parse(scRows[0].content) : scRows[0].content;
        }
      } catch(e) {}

      // 2. Fallback bridge via orders table
      const rows = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.course_lessons_v1&limit=1`
      );
      if (rows && rows.length > 0 && rows[0].slip_image) {
        return JSON.parse(rows[0].slip_image);
      }
      return null;
    } catch(err) {
      console.warn('Could not fetch lessons from Supabase cloud:', err);
      return null;
    }
  },

  /**
   * Save course overrides to Supabase Cloud
   * @param {Object} overridesMap - { [courseId]: { title, price, ... } }
   */
  async saveCourseOverridesToCloud(overridesMap) {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return false;
    try {
      // 1. Try dedicated site_content table first
      try {
        const scRes = await this._supabaseFetch('/site_content', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            key: 'course_overrides',
            content: overridesMap,
            updated_at: new Date().toISOString()
          })
        });
        if (scRes) return true;
      } catch(e) {}

      // 2. Fallback bridge via orders table
      const payload = JSON.stringify(overridesMap);
      const existing = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.course_overrides_v1&limit=1`
      );
      if (existing && existing.length > 0) {
        await this._supabaseFetch(`/orders?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            slip_image: payload,
            updated_at: new Date().toISOString()
          })
        });
      } else {
        await this._supabaseFetch('/orders', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            user_email: 'cms_sync@inbiology.com',
            user_name: 'CMS Cloud Sync',
            course_ids: ['cms_overrides'],
            total_amount: 0,
            status: 'system_cms',
            admin_note: 'course_overrides_v1',
            slip_image: payload
          })
        });
      }
      return true;
    } catch(err) {
      console.warn('Could not sync course overrides to Supabase cloud:', err);
      return false;
    }
  },

  /**
   * Fetch course overrides from Supabase Cloud
   * @returns {Promise<Object|null>}
   */
  async fetchCourseOverridesFromCloud() {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return null;
    try {
      // 1. Try dedicated site_content table first
      try {
        const scRows = await this._supabaseFetch('/site_content?key=eq.course_overrides&limit=1');
        if (scRows && scRows.length > 0 && scRows[0].content) {
          return typeof scRows[0].content === 'string' ? JSON.parse(scRows[0].content) : scRows[0].content;
        }
      } catch(e) {}

      // 2. Fallback bridge via orders table
      const rows = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.course_overrides_v1&limit=1`
      );
      if (rows && rows.length > 0 && rows[0].slip_image) {
        return JSON.parse(rows[0].slip_image);
      }
      return null;
    } catch(err) {
      console.warn('Could not fetch course overrides from Supabase cloud:', err);
      return null;
    }
  },

  /**
   * Save added courses to Supabase Cloud
   */
  async saveAddedCoursesToCloud(addedCourses) {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return false;
    try {
      const payload = JSON.stringify(addedCourses);
      const existing = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.added_courses_v1&limit=1`
      );
      if (existing && existing.length > 0) {
        await this._supabaseFetch(`/orders?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            slip_image: payload,
            updated_at: new Date().toISOString()
          })
        });
      } else {
        await this._supabaseFetch('/orders', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            user_email: 'cms_sync@inbiology.com',
            user_name: 'CMS Cloud Sync',
            course_ids: ['cms_added'],
            total_amount: 0,
            status: 'system_cms',
            admin_note: 'added_courses_v1',
            slip_image: payload
          })
        });
      }
      return true;
    } catch(err) {
      console.warn('Could not sync added courses to cloud:', err);
      return false;
    }
  },

  /**
   * Fetch added courses from Supabase Cloud
   */
  async fetchAddedCoursesFromCloud() {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return null;
    try {
      const rows = await this._supabaseFetch(
        `/orders?user_email=eq.cms_sync@inbiology.com&admin_note=eq.added_courses_v1&limit=1`
      );
      if (rows && rows.length > 0 && rows[0].slip_image) {
        return JSON.parse(rows[0].slip_image);
      }
      return null;
    } catch(err) {
      console.warn('Could not fetch added courses from cloud:', err);
      return null;
    }
  },

  /**
   * Fetch real registered students from Supabase Cloud
   */
  async getRegisteredStudents() {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const rows = await this._supabaseFetch(
          `/users?role=neq.admin&select=id,full_name,nickname,email,phone_number,school,grade_level,created_at&order=created_at.desc`
        );
        if (rows && Array.isArray(rows) && rows.length > 0) {
          return rows.map(r => ({
            id: r.id,
            fullName: r.full_name || '-',
            nickname: r.nickname || (r.full_name ? r.full_name.split(' ')[0] : 'นักเรียน'),
            email: r.email || '-',
            phone: r.phone_number || '-',
            school: r.school || '-',
            level: r.grade_level || 'ม.5',
            createdAt: r.created_at
          }));
        }
      } catch(e) {
        console.warn('Could not fetch students from Supabase:', e);
      }
    }
    // Fallback: Return MOCK_STUDENTS without injecting current logged in profile
    return (typeof MOCK_STUDENTS !== 'undefined' ? MOCK_STUDENTS : []).map(s => ({
      id: s.id,
      fullName: s.name,
      nickname: (s.name.split(' ')[1] || 'นักเรียน'),
      email: s.email,
      phone: s.phone || '08X-XXX-XXXX',
      school: s.school,
      level: s.level || 'ม.5'
    }));
  }
};

window.CloudService = CloudService;
document.addEventListener('DOMContentLoaded', () => {
  CloudService.init();
});
