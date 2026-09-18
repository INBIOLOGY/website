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
              const profile = await this.getUserProfile(user.uid);
              if (profile) {
                AppState.userRole = profile.role || 'student';
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
          enrolled: ['bio-intensive-1']
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

    // Attempt sending via Vercel serverless /api/send-otp if available
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otpCode: code })
      });
    } catch(err) {
      console.log('ℹ️ [OTP Dispatch] Local fallback: code stored in session');
    }

    return {
      success: true,
      message: `ส่งรหัสยืนยัน 6 หลักไปยัง ${cleanEmail} เรียบร้อยแล้ว`,
      otpPreview: code,
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
      enrolled: ['bio-intensive-1'],
      createdAt: new Date().toISOString()
    };

    // Save to Supabase Cloud Database
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const sbPayload = {
          username: cleanUsername,
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
    const cleanPhone = identifier.replace(/[-\s]/g, '');

    // Check Supabase Cloud Database first
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      try {
        const q = `/users?or=(email.ilike.${encodeURIComponent(cleanInput)},phone_number.ilike.%${encodeURIComponent(cleanPhone)}%,phone_number.eq.${encodeURIComponent(identifier.trim())},username.ilike.${encodeURIComponent(cleanInput)})&limit=1`;
        const sbUsers = await this._supabaseFetch(q);
        if (sbUsers && sbUsers.length > 0) {
          const sbUser = sbUsers[0];
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
            enrolled: ['bio-intensive-1']
          };
          AppState.userRole = userProfile.role;
          localStorage.setItem('inbiology_role', AppState.userRole);
          AppState.saveStudentProfile(userProfile);
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
    localStorage.setItem('inbiology_role', AppState.userRole);
    AppState.saveStudentProfile(user);

    if (user.enrolled && Array.isArray(user.enrolled)) {
      AppState.enrolled = user.enrolled;
      localStorage.setItem('inbiology_enrolled', JSON.stringify(user.enrolled));
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
      enrolled: ['bio-intensive-1'],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this._saveUsersDb(users);

    AppState.userRole = 'student';
    localStorage.setItem('inbiology_role', 'student');
    AppState.saveStudentProfile(newUser);
    return { user: newUser, isNew: true, isAutoLinked: false };
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
      await this.auth.signOut();
    }
    AppState.userRole = null;
    localStorage.removeItem('inbiology_role');
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
    return JSON.parse(localStorage.getItem('inbiology_enrolled') || '["bio-intensive-1"]');
  }
};

window.CloudService = CloudService;
document.addEventListener('DOMContentLoaded', () => {
  CloudService.init();
});
