// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — CLOUD SERVICE LAYER (FIREBASE & GRACEFUL FALLBACK)
// ─────────────────────────────────────────────────────────────────────────────

const CloudService = {
  initialized: false,
  isLive: false,
  auth: null,
  db: null,
  currentUser: null,

  async init() {
    if (this.initialized) return;
    this.initialized = true;

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
            } else {
              if (this.isLive) {
                // User logged out
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
    console.log('ℹ️ [INBIOLOGY Cloud] Running in Local Storage Fallback Mode (Full Offline Support)');
  },

  // Dynamically load Firebase SDK Compat via CDN only when configured
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

  // 1. REGISTER
  async register(email, password, profileData = {}) {
    if (this.isLive && this.auth && this.db) {
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = cred.user;
      const cleanProfile = {
        uid: user.uid,
        email: email,
        fullName: profileData.fullName || email.split('@')[0],
        nickname: profileData.nickname || profileData.fullName || 'นักเรียน',
        school: profileData.school || 'โรงเรียนทั่วไป',
        level: profileData.level || 'ม.5',
        role: 'student',
        enrolled: ['bio-intensive-1'],
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      };
      await this.db.collection('users').doc(user.uid).set(cleanProfile);
      AppState.userRole = 'student';
      localStorage.setItem('inbiology_role', 'student');
      AppState.saveStudentProfile(cleanProfile);
      return cleanProfile;
    }

    // Fallback
    const profile = {
      email,
      fullName: profileData.fullName || 'นาย ทดสอบ เรียนดี',
      nickname: profileData.nickname || 'ทดสอบ',
      school: profileData.school || 'โรงเรียนตัวอย่าง',
      level: profileData.level || 'ม.5',
      role: 'student'
    };
    AppState.userRole = 'student';
    localStorage.setItem('inbiology_role', 'student');
    AppState.saveStudentProfile(profile);
    return profile;
  },

  // 2. LOGIN
  async login(email, password) {
    if (this.isLive && this.auth) {
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      const profile = await this.getUserProfile(cred.user.uid);
      return profile;
    }

    // Fallback
    const profile = AppState.getStudentProfile();
    AppState.userRole = email.toLowerCase().includes('admin') ? 'admin' : 'student';
    localStorage.setItem('inbiology_role', AppState.userRole);
    return profile;
  },

  // 3. GOOGLE SIGN-IN
  async loginWithGoogle() {
    if (this.isLive && this.auth && window.firebase) {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      const result = await this.auth.signInWithPopup(provider);
      const user = result.user;
      let profile = await this.getUserProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || user.email.split('@')[0],
          nickname: (user.displayName || '').split(' ')[0] || 'นักเรียน',
          school: 'โรงเรียนทั่วไป',
          level: 'ม.5',
          role: 'student',
          enrolled: ['bio-intensive-1'],
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
        };
        await this.db.collection('users').doc(user.uid).set(profile);
      }
      AppState.userRole = profile.role || 'student';
      localStorage.setItem('inbiology_role', AppState.userRole);
      AppState.saveStudentProfile(profile);
      return profile;
    }

    // Fallback preview
    const profile = {
      fullName: 'นาย กิตติศักดิ์ พัฒนา (Google User)',
      nickname: 'กิตติ',
      school: 'โรงเรียนเตรียมอุดมศึกษา',
      level: 'ม.6',
      email: 'student.google@gmail.com',
      role: 'student'
    };
    AppState.userRole = 'student';
    localStorage.setItem('inbiology_role', 'student');
    AppState.saveStudentProfile(profile);
    return profile;
  },

  // 4. PASSWORD RESET
  async sendPasswordReset(email) {
    if (this.isLive && this.auth) {
      await this.auth.sendPasswordResetEmail(email);
      return true;
    }
    // Fallback
    return true;
  },

  // 5. LOGOUT
  async logout() {
    if (this.isLive && this.auth) {
      await this.auth.signOut();
    }
    AppState.userRole = null;
    localStorage.removeItem('inbiology_role');
  },

  // 6. GET USER PROFILE
  async getUserProfile(uid) {
    if (this.isLive && this.db) {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      }
    }
    return AppState.getStudentProfile();
  },

  // 7. SAVE USER PROFILE
  async saveUserProfile(uid, data) {
    if (this.isLive && this.db && uid) {
      await this.db.collection('users').doc(uid).update(data);
    }
    AppState.saveStudentProfile(data);
  },

  // 8. ENROLLMENTS
  async getEnrolledCourses(uid) {
    if (this.isLive && this.db && uid) {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists && doc.data().enrolled) {
        return doc.data().enrolled;
      }
    }
    return JSON.parse(localStorage.getItem('inbiology_enrolled') || '["bio-intensive-1"]');
  },

  async enrollCourse(courseId) {
    const uid = this.currentUser ? this.currentUser.uid : null;
    if (this.isLive && this.db && uid) {
      await this.db.collection('users').doc(uid).update({
        enrolled: window.firebase.firestore.FieldValue.arrayUnion(courseId)
      });
    }
    if (!AppState.enrolled.includes(courseId)) {
      AppState.enrolled.push(courseId);
      localStorage.setItem('inbiology_enrolled', JSON.stringify(AppState.enrolled));
    }
  }
};

window.CloudService = CloudService;
document.addEventListener('DOMContentLoaded', () => {
  CloudService.init();
});
