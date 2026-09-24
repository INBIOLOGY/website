// ─────────────────────────────────────────────────────────────────────────────
// CORE VANILLA JS APPLICATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// Helper functions
function formatPrice(n) {
  return Number(n).toLocaleString('th-TH');
}

function pct(orig, cur) {
  if (!orig || orig <= 0) return 0;
  return Math.round((1 - cur / orig) * 100);
}

// Extract YouTube Video ID from any YouTube URL or raw 11-char ID
function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

// Extract EP prefix or number from lesson title e.g. "EP 2: ...", "EP.3 - ...", "EP: 2", "ตอนที่ 1"
function extractEpFromTitle(title) {
  if (!title || typeof title !== 'string') return null;
  const m = title.match(/^(?:EP|Ep|ep)[\.\s:_\-]*([0-9]+(?:\.[0-9]+)?)/i);
  if (m) return `EP.${m[1]}`;
  const mThai = title.match(/^(?:ตอนที่|บทที่)[\.\s:_\-]*([0-9]+(?:\.[0-9]+)?)/);
  if (mThai) return `EP.${mThai[1]}`;
  return null;
}

// Default Study Materials Generator
function getDefaultMaterialsForCourse(course) {
  if (!course) return [];
  const eb = course.ebookInfo || {};
  return [
    {
      id: 'mat-main-' + course.id,
      title: eb.title || `e-Book ชีทสรุปเนื้อหาและโจทย์: ${course.title}`,
      category: 'e-Book PDF',
      fileSize: eb.fileSize || '24.5 MB',
      pages: eb.pages ? `${eb.pages} หน้า` : '140 หน้า',
      url: eb.downloadUrl || '',
      filename: eb.filename || `${course.id}-handout.pdf`,
      description: 'เอกสารประกอบการเรียนฉบับสมบูรณ์ พิมพ์ 4 สี พร้อมแผนภาพสีและสรุปเข้ม',
      isPrimary: true
    },
    {
      id: 'mat-extra-1-' + course.id,
      title: `แบบฝึกหัดท้ายบท & ข้อสอบจำลอง A-Level (${course.badge || course.title})`,
      category: 'แบบฝึกหัด & เฉลย',
      fileSize: '8.5 MB',
      pages: '45 หน้า',
      url: '',
      filename: `${course.id}-exercises.pdf`,
      description: 'โจทย์ฝึกฝนทบทวนความเข้าใจพร้อมเฉลยละเอียดและวิเคราะห์จุดหลอก',
      isPrimary: false
    }
  ];
}

// Helper to normalize course metadata (guarantees categorySlug exists for catalog filtering)
function normalizeCourse(c) {
  if (!c) return c;
  if (!c.categorySlug) {
    const text = `${c.Category || ''} ${c.category || ''} ${c.badge || ''} ${c.title || ''}`.toLowerCase();
    if (text.includes('bio intensive') || text.includes('bio-intensive')) c.categorySlug = 'bio-intensive';
    else if (text.includes('สอวน') || text.includes('posn')) c.categorySlug = 'posn';
    else if (text.includes('a-level') || text.includes('alevel') || text.includes('tpat') || text.includes('pat2')) c.categorySlug = 'alevel';
    else if (text.includes('99') || text.includes('starter')) c.categorySlug = 'starter';
    else c.categorySlug = 'bio-intensive';
  }
  return c;
}

// Helper to sort courses naturally (Bio Intensive I, II, III... followed by A-Level, POSN, etc.)
function sortCoursesNaturally(courses) {
  if (!Array.isArray(courses)) return courses;
  const romanMap = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
  const getWeight = (c) => {
    const text = `${c.badge || ''} ${c.title || ''}`.trim();
    const bioMatch = text.match(/Bio\s*Intensive\s*(VIII|VII|VI|IV|V|III|II|IX|X|I|\d+)\b/i);
    if (bioMatch) {
      const roman = bioMatch[1].toUpperCase();
      const num = romanMap[roman] || parseInt(bioMatch[1]) || 1;
      return 100 + num;
    }
    if (/สอวน|posn/i.test(text)) return 300;
    if (/a-level|tpat|pat2/i.test(text)) return 200;
    if (/99|starter/i.test(text)) return 400;
    return 500;
  };
  return courses.sort((a, b) => getWeight(a) - getWeight(b));
}

// Hydrate stored custom courses, course details overrides, lessons and materials on script load
try {
  if (typeof COURSES !== 'undefined') {
    // 0. Filter out deleted courses
    const storedDeleted = localStorage.getItem('inbiology_deleted_courses');
    let deletedIds = [];
    if (storedDeleted) {
      try {
        const parsed = JSON.parse(storedDeleted);
        if (Array.isArray(parsed) && parsed.length > 0) {
          deletedIds = parsed;
          for (let i = COURSES.length - 1; i >= 0; i--) {
            if (deletedIds.includes(COURSES[i].id)) {
              COURSES.splice(i, 1);
            }
          }
          if (COURSES.length === 0 && typeof DEFAULT_COURSES !== 'undefined' && Array.isArray(DEFAULT_COURSES) && DEFAULT_COURSES.length > 0) {
            COURSES.push(...JSON.parse(JSON.stringify(DEFAULT_COURSES)));
            localStorage.removeItem('inbiology_deleted_courses');
          }
        }
      } catch(e) {}
    }

    // 1. Hydrate newly added courses created by admin (excluding any deleted ones)
    const storedAdded = localStorage.getItem('inbiology_added_courses');
    if (storedAdded) {
      try {
        const addedList = JSON.parse(storedAdded);
        if (Array.isArray(addedList)) {
          addedList.forEach(ac => {
            if (!deletedIds.includes(ac.id)) {
              const existingIdx = COURSES.findIndex(c => c.id === ac.id);
              if (existingIdx !== -1) {
                COURSES[existingIdx] = { ...COURSES[existingIdx], ...normalizeCourse(ac) };
              } else {
                COURSES.push(normalizeCourse(ac));
              }
            }
          });
        }
      } catch(e) {}
    }
    COURSES.forEach(c => normalizeCourse(c));
    sortCoursesNaturally(COURSES);

    // Apply admin custom order if saved
    const savedOrder = localStorage.getItem('inbiology_course_order');
    if (savedOrder) {
      try {
        const orderedIds = JSON.parse(savedOrder);
        if (Array.isArray(orderedIds) && orderedIds.length > 0) {
          const idxMap = {};
          orderedIds.forEach((id, i) => { idxMap[id] = i; });
          COURSES.sort((a, b) => {
            const ia = idxMap[a.id] !== undefined ? idxMap[a.id] : 9999;
            const ib = idxMap[b.id] !== undefined ? idxMap[b.id] : 9999;
            return ia - ib;
          });
        }
      } catch(e) {}
    }

    // 2. Hydrate edited course information overrides (title, price, level, image, badge, etc.)
    const storedOverrides = localStorage.getItem('inbiology_course_overrides');
    if (storedOverrides) {
      try {
        const overrides = JSON.parse(storedOverrides);
        COURSES.forEach(c => {
          if (overrides[c.id]) {
            Object.assign(c, overrides[c.id]);
          }
        });
      } catch(e) {}
    }

    // 3. Hydrate custom lessons
    const storedLessons = localStorage.getItem('inbiology_course_lessons');
    if (storedLessons) {
      const parsed = JSON.parse(storedLessons);
      COURSES.forEach(c => {
        if (parsed[c.id] && Array.isArray(parsed[c.id])) {
          c.lessons = parsed[c.id];
          const totalMins = c.lessons.reduce((acc, l) => acc + (parseInt(l.duration) || 0), 0);
          if (totalMins > 0) c.hours = Math.max(1, Math.round(totalMins / 60));
        }
      });
    }

    // 4. Hydrate custom study materials
    const storedMaterials = localStorage.getItem('inbiology_course_materials');
    const parsedMaterials = storedMaterials ? JSON.parse(storedMaterials) : {};
    COURSES.forEach(c => {
      if (parsedMaterials[c.id] && Array.isArray(parsedMaterials[c.id])) {
        c.materials = parsedMaterials[c.id];
      } else if (!c.materials) {
        c.materials = getDefaultMaterialsForCourse(c);
      }
      const primary = c.materials.find(m => m.isPrimary) || c.materials[0];
      if (primary && c.ebookInfo) {
        c.ebookInfo.title = primary.title || c.ebookInfo.title;
        if (primary.url) c.ebookInfo.downloadUrl = primary.url;
        if (primary.fileSize) c.ebookInfo.fileSize = primary.fileSize;
        if (primary.pages) c.ebookInfo.pages = parseInt(primary.pages) || c.ebookInfo.pages;
      }
    });
  }

  // 5. Hydrate coupons from localStorage
  const storedCoupons = localStorage.getItem('inbiology_coupons');
  if (storedCoupons) {
    try {
      const parsedCoupons = JSON.parse(storedCoupons);
      if (Array.isArray(parsedCoupons) && parsedCoupons.length > 0 && typeof COUPONS !== 'undefined') {
        COUPONS.length = 0;
        COUPONS.push(...parsedCoupons);
      }
    } catch(e) {}
  }
} catch(e) { console.warn('Note: Could not hydrate stored course data:', e); }

// ─────────────────────────────────────────────────────────────────────────────
// SESSION SYNCHRONIZATION
// Keeps active authentication status synchronized across tabs and windows
// ─────────────────────────────────────────────────────────────────────────────
(function initSessionState() {
  const role = localStorage.getItem('inbiology_role');
  if (role && !sessionStorage.getItem('inbiology_session_active')) {
    sessionStorage.setItem('inbiology_session_active', 'true');
  }
})();

// Global Application State & Storage
const AppState = window.AppState = {
  cart: JSON.parse(localStorage.getItem('inbiology_cart') || '[]'),
  enrolled: [],
  lang: localStorage.getItem('inbiology_lang') || 'TH',
  appliedCoupon: null,
  userRole: (() => {
    try {
      const p = JSON.parse(localStorage.getItem('inbiology_student_profile') || '{}');
      const email = (p.email || localStorage.getItem('inbiology_user_email') || '').toLowerCase().trim();
      const noDots = email.replace(/\./g, '');
      if (email === 'witsarut.cha@pccpl.ac.th' || email === 'witsarutcha@pccpl.ac.th' || noDots.startsWith('witsarutcha@pccpl')) {
        localStorage.setItem('inbiology_role', 'admin');
        return 'admin';
      }
    } catch(e) {}
    return localStorage.getItem('inbiology_role') || null;
  })(),

  setSessionActive(active = true) {
    if (active) {
      sessionStorage.setItem('inbiology_session_active', 'true');
    } else {
      sessionStorage.removeItem('inbiology_session_active');
    }
  },

  isLoggedIn() {
    return Boolean(this.userRole && this.userRole !== 'guest');
  },
  
  getStudentProfile() {
    const saved = localStorage.getItem('inbiology_student_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p && p.email) {
          const email = p.email.toLowerCase().trim();
          const noDots = email.replace(/\./g, '');
          if (email === 'witsarut.cha@pccpl.ac.th' || email === 'witsarutcha@pccpl.ac.th' || noDots.startsWith('witsarutcha@pccpl')) {
            p.role = 'admin';
            this.userRole = 'admin';
            localStorage.setItem('inbiology_role', 'admin');
          }
        }
        return p;
      } catch(e){}
    }
    return null;
  },

  saveStudentProfile(profile) {
    sessionStorage.setItem('inbiology_session_active', 'true');
    if (profile && profile.email) {
      const email = profile.email.toLowerCase().trim();
      const noDots = email.replace(/\./g, '');
      if (email === 'witsarut.cha@pccpl.ac.th' || email === 'witsarutcha@pccpl.ac.th' || noDots.startsWith('witsarutcha@pccpl')) {
        profile.role = 'admin';
      }
    }
    localStorage.setItem('inbiology_student_profile', JSON.stringify(profile));
    if (profile && profile.role) {
      this.userRole = profile.role;
      localStorage.setItem('inbiology_role', profile.role);
    }
  },

  _lastProfileSyncTime: 0,
  _lastCourseSyncTime: 0,

  async syncUserProfileWithCloud(force = false) {
    const profile = this.getStudentProfile();
    if (!profile || !profile.email) return;
    const now = Date.now();
    if (!force && this._lastProfileSyncTime && (now - this._lastProfileSyncTime < 120000)) {
      return;
    }
    this._lastProfileSyncTime = now;
    const email = profile.email.toLowerCase().trim();

    // 1. Super Admin Check
    const isSuper = (window.CloudService && typeof window.CloudService.isSuperAdminEmail === 'function')
      ? window.CloudService.isSuperAdminEmail(email)
      : (email === 'witsarut.cha@pccpl.ac.th' || email === 'witsarutcha@pccpl.ac.th' || email.replace(/\./g, '').startsWith('witsarutcha@pccpl'));

    if (isSuper) {
      if (this.userRole !== 'admin') {
        this.userRole = 'admin';
        localStorage.setItem('inbiology_role', 'admin');
        profile.role = 'admin';
        this.saveStudentProfile(profile);
        if (typeof renderHeader === 'function') renderHeader();
      }
      return;
    }

    // 2. Fetch authoritative cloud role from Supabase & site_content bridge
    if (window.CloudService && typeof window.CloudService.fetchUserRole === 'function') {
      try {
        const cloudRole = await window.CloudService.fetchUserRole(email);
        if (cloudRole && cloudRole !== this.userRole) {
          console.log(`🔄 [Role Sync] Role updated from cloud: ${this.userRole} -> ${cloudRole}`);
          this.userRole = cloudRole;
          localStorage.setItem('inbiology_role', cloudRole);
          profile.role = cloudRole;
          this.saveStudentProfile(profile);
          if (typeof renderHeader === 'function') renderHeader();
        }
      } catch(e) {}
    }

    // 3. Hydrate profile fields if local profile is incomplete
    if (window.CloudService && typeof window.CloudService.fetchUserProfileByEmail === 'function') {
      try {
        const cloudUser = await window.CloudService.fetchUserProfileByEmail(email);
        if (cloudUser) {
          let updated = false;
          if (cloudUser.phone_number && cloudUser.phone_number !== '0000000000' && (!profile.phone || profile.phone === '0000000000')) {
            profile.phone = cloudUser.phone_number;
            updated = true;
          }
          if (cloudUser.school && cloudUser.school !== 'ยังไม่ได้ระบุ' && (!profile.school || profile.school === 'ยังไม่ได้ระบุ')) {
            profile.school = cloudUser.school;
            updated = true;
          }
          if (cloudUser.full_name && (!profile.fullName || profile.fullName === 'ผู้ใช้งาน Google')) {
            profile.fullName = cloudUser.full_name;
            updated = true;
          }
          if (cloudUser.nickname && (!profile.nickname || profile.nickname === 'นักเรียน')) {
            profile.nickname = cloudUser.nickname;
            updated = true;
          }
          if (cloudUser.grade_level && !profile.level) {
            profile.level = cloudUser.grade_level;
            updated = true;
          }
          if (updated) {
            this.saveStudentProfile(profile);
          }
        }
      } catch(e) {}
    }
  },

  // ─── Scoped Account Isolation Helpers (Fix Data Bleed across accounts) ───
  getUserStorageKey() {
    const profile = this.getStudentProfile();
    if (!profile) return 'guest';
    const raw = (profile.id || profile.email || 'guest').toLowerCase();
    return raw.replace(/[^a-z0-9]/g, '_');
  },

  getEnrolledCourses() {
    const userKey = this.getUserStorageKey();
    if (userKey === 'guest') return [];
    // 1. Check user-scoped key first
    const scoped = localStorage.getItem('inbiology_enrolled_' + userKey);
    if (scoped) {
      try {
        const arr = JSON.parse(scoped);
        if (Array.isArray(arr)) return arr;
      } catch(e){}
    }
    // 2. Check general key
    const general = localStorage.getItem('inbiology_enrolled');
    if (general) {
      try {
        const arr = JSON.parse(general);
        if (Array.isArray(arr)) {
          this.setEnrolledCourses(arr); // migrate to scoped
          return arr;
        }
      } catch(e){}
    }
    return [];
  },

  setEnrolledCourses(courseIds) {
    const userKey = this.getUserStorageKey();
    this.enrolled = Array.isArray(courseIds) ? courseIds : [];
    if (userKey !== 'guest') {
      localStorage.setItem('inbiology_enrolled_' + userKey, JSON.stringify(this.enrolled));
    }
    localStorage.setItem('inbiology_enrolled', JSON.stringify(this.enrolled));
  },

  getCourseProgress(courseId) {
    const userKey = this.getUserStorageKey();
    const saved = localStorage.getItem(`inbiology_progress_${userKey}_${courseId}`) || 
                  (userKey !== 'guest' ? null : localStorage.getItem('inbiology_progress_' + courseId));
    let completed = [];
    if (saved) {
      try { completed = JSON.parse(saved); } catch(e){}
    }
    const course = typeof COURSES !== 'undefined' ? COURSES.find(c => c.id === courseId) : null;
    const lessons = this.getCourseLessons(courseId);
    const total = lessons && lessons.length ? lessons.length : (course && course.lessons && course.lessons.length ? course.lessons.length : 1);
    const count = completed.length;
    const percentage = Math.min(100, Math.round((count / total) * 100));
    return {
      completedLessonIds: completed,
      completedCount: count,
      totalCount: total,
      percentage: percentage
    };
  },

  // ─── Custom Course Lessons & YouTube Cloud Integration ───
  getCourseLessons(courseId) {
    try {
      const stored = localStorage.getItem('inbiology_course_lessons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed[courseId] && Array.isArray(parsed[courseId])) {
          return parsed[courseId];
        }
      }
    } catch(e) { console.warn('Error reading stored course lessons:', e); }
    const course = typeof COURSES !== 'undefined' ? COURSES.find(c => c.id === courseId) : null;
    return (course && course.lessons) ? [...course.lessons] : [];
  },

  saveCourseLessons(courseId, lessons) {
    try {
      let stored = {};
      const raw = localStorage.getItem('inbiology_course_lessons');
      if (raw) {
        try { stored = JSON.parse(raw); } catch(e){}
      }
      stored[courseId] = lessons;
      localStorage.setItem('inbiology_course_lessons', JSON.stringify(stored));

      // Mirror to in-memory COURSES
      if (typeof COURSES !== 'undefined') {
        const c = COURSES.find(x => x.id === courseId);
        if (c) {
          c.lessons = lessons;
          const totalMins = lessons.reduce((acc, l) => acc + (parseInt(l.duration) || 0), 0);
          if (totalMins > 0) {
            c.hours = Math.max(1, Math.round(totalMins / 60));
          }
        }
      }
      return true;
    } catch(e) {
      console.error('Failed to save course lessons:', e);
      return false;
    }
  },

  resetCourseLessons(courseId) {
    try {
      const raw = localStorage.getItem('inbiology_course_lessons');
      if (raw) {
        let stored = JSON.parse(raw);
        delete stored[courseId];
        localStorage.setItem('inbiology_course_lessons', JSON.stringify(stored));
      }
      return true;
    } catch(e) {
      return false;
    }
  },

  // ─── Course Study Materials & Documents Management ───
  getCourseMaterials(courseId) {
    try {
      const stored = localStorage.getItem('inbiology_course_materials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed[courseId] && Array.isArray(parsed[courseId])) {
          return parsed[courseId];
        }
      }
    } catch(e) { console.warn('Error reading stored course materials:', e); }

    const course = typeof COURSES !== 'undefined' ? COURSES.find(c => c.id === courseId) : null;
    if (course && course.materials && Array.isArray(course.materials)) {
      return [...course.materials];
    }
    return course ? getDefaultMaterialsForCourse(course) : [];
  },

  saveCourseMaterials(courseId, materials) {
    try {
      let stored = {};
      const raw = localStorage.getItem('inbiology_course_materials');
      if (raw) {
        try { stored = JSON.parse(raw); } catch(e){}
      }
      stored[courseId] = materials;
      localStorage.setItem('inbiology_course_materials', JSON.stringify(stored));

      // Mirror to in-memory COURSES and synchronize primary e-book metadata
      if (typeof COURSES !== 'undefined') {
        const c = COURSES.find(x => x.id === courseId);
        if (c) {
          c.materials = materials;
          const primary = materials.find(m => m.isPrimary) || materials[0];
          if (primary && c.ebookInfo) {
            c.ebookInfo.title = primary.title || c.ebookInfo.title;
            if (primary.url) c.ebookInfo.downloadUrl = primary.url;
            if (primary.fileSize) c.ebookInfo.fileSize = primary.fileSize;
            if (primary.pages) c.ebookInfo.pages = parseInt(primary.pages) || c.ebookInfo.pages;
          }
        }
      }
      return true;
    } catch(e) {
      console.error('Failed to save course materials:', e);
      return false;
    }
  },

  resetCourseMaterials(courseId) {
    try {
      const raw = localStorage.getItem('inbiology_course_materials');
      if (raw) {
        let stored = JSON.parse(raw);
        delete stored[courseId];
        localStorage.setItem('inbiology_course_materials', JSON.stringify(stored));
      }
      if (typeof COURSES !== 'undefined') {
        const c = COURSES.find(x => x.id === courseId);
        if (c) {
          c.materials = getDefaultMaterialsForCourse(c);
        }
      }
      return true;
    } catch(e) {
      return false;
    }
  },

  // ─── Course Creation, Information & Metadata Management ───
  async addCourse(newCourse) {
    try {
      if (!newCourse || !newCourse.id) return false;

      // 1. Normalize course metadata (slug, categories)
      normalizeCourse(newCourse);

      // 2. Unmark from deleted courses if it was ever in deleted list
      let deletedList = [];
      try {
        deletedList = JSON.parse(localStorage.getItem('inbiology_deleted_courses') || '[]');
      } catch(e) {}
      if (Array.isArray(deletedList) && deletedList.includes(newCourse.id)) {
        deletedList = deletedList.filter(id => id !== newCourse.id);
        localStorage.setItem('inbiology_deleted_courses', JSON.stringify(deletedList));
        if (window.CloudService && typeof window.CloudService.saveDeletedCoursesToCloud === 'function') {
          await window.CloudService.saveDeletedCoursesToCloud(deletedList).catch(() => {});
        }
      }

      // 3. Add / update in in-memory COURSES array and sort naturally
      if (typeof COURSES !== 'undefined') {
        const idx = COURSES.findIndex(c => c.id === newCourse.id);
        if (idx !== -1) {
          COURSES[idx] = { ...COURSES[idx], ...newCourse };
        } else {
          COURSES.push(newCourse);
        }
        COURSES.forEach(c => normalizeCourse(c));
        sortCoursesNaturally(COURSES);
      }

      // 4. Save to inbiology_added_courses in localStorage
      let addedList = [];
      try {
        addedList = JSON.parse(localStorage.getItem('inbiology_added_courses') || '[]');
      } catch(e) {}
      if (!Array.isArray(addedList)) addedList = [];
      const exIdx = addedList.findIndex(c => c.id === newCourse.id);
      if (exIdx !== -1) {
        addedList[exIdx] = { ...addedList[exIdx], ...newCourse };
      } else {
        addedList.push(newCourse);
      }
      localStorage.setItem('inbiology_added_courses', JSON.stringify(addedList));

      // 5. Sync to Supabase Cloud with immediate cache purge
      let cloudOk = true;
      if (window.CloudService && typeof window.CloudService.saveAddedCoursesToCloud === 'function') {
        cloudOk = await window.CloudService.saveAddedCoursesToCloud(addedList);
      }

      // 6. Broadcast event & trigger live UI updates
      window.dispatchEvent(new CustomEvent('coursesUpdated', { detail: { courses: COURSES, addedCourse: newCourse } }));
      if (typeof window.filterAndRender === 'function') window.filterAndRender();
      if (typeof window.renderRecommendedCourses === 'function') window.renderRecommendedCourses();
      if (typeof window.renderDashboardCatalog === 'function') window.renderDashboardCatalog();
      if (typeof window.renderAdminTable === 'function') window.renderAdminTable();

      return cloudOk;
    } catch(err) {
      console.error('Failed to add course:', err);
      return false;
    }
  },

  updateCourse(courseId, updatedFields) {
    try {
      if (typeof COURSES !== 'undefined') {
        const c = COURSES.find(x => x.id === courseId);
        if (c) {
          Object.assign(c, updatedFields);
        }
      }
      let overrides = {};
      const raw = localStorage.getItem('inbiology_course_overrides');
      if (raw) {
        try { overrides = JSON.parse(raw); } catch(e) {}
      }
      overrides[courseId] = { ...(overrides[courseId] || {}), ...updatedFields };
      localStorage.setItem('inbiology_course_overrides', JSON.stringify(overrides));

      // Also update in inbiology_added_courses if this is a custom added course
      const storedAdded = localStorage.getItem('inbiology_added_courses');
      if (storedAdded) {
        try {
          let addedList = JSON.parse(storedAdded);
          let modified = false;
          addedList = addedList.map(item => {
            if (item.id === courseId) {
              modified = true;
              return { ...item, ...updatedFields };
            }
            return item;
          });
          if (modified) {
            localStorage.setItem('inbiology_added_courses', JSON.stringify(addedList));
            if (window.CloudService && typeof window.CloudService.saveAddedCoursesToCloud === 'function') {
              window.CloudService.saveAddedCoursesToCloud(addedList);
            }
          }
        } catch(e) {}
      }

      return true;
    } catch(e) {
      console.error('Failed to update course info:', e);
      return false;
    }
  },

  /**
   * Delete course (from in-memory, localStorage, and Cloud Supabase)
   * @param {string} courseId
   */
  async deleteCourse(courseId) {
    try {
      // 1. Remove from in-memory COURSES
      if (typeof COURSES !== 'undefined') {
        const idx = COURSES.findIndex(x => x.id === courseId);
        if (idx > -1) {
          COURSES.splice(idx, 1);
        }
      }

      // 2. Add to inbiology_deleted_courses in localStorage
      let deletedList = [];
      try {
        const storedDeleted = localStorage.getItem('inbiology_deleted_courses');
        if (storedDeleted) deletedList = JSON.parse(storedDeleted) || [];
      } catch(e) {}
      if (!Array.isArray(deletedList)) deletedList = [];
      if (!deletedList.includes(courseId)) {
        deletedList.push(courseId);
        localStorage.setItem('inbiology_deleted_courses', JSON.stringify(deletedList));
      }

      // 3. Remove from inbiology_added_courses if exists
      let addedList = [];
      try {
        const storedAdded = localStorage.getItem('inbiology_added_courses');
        if (storedAdded) {
          addedList = JSON.parse(storedAdded) || [];
          if (Array.isArray(addedList)) {
            addedList = addedList.filter(item => item.id !== courseId);
            localStorage.setItem('inbiology_added_courses', JSON.stringify(addedList));
          }
        }
      } catch(e) {}

      // 4. Clean up from overrides
      try {
        const storedOverrides = localStorage.getItem('inbiology_course_overrides');
        if (storedOverrides) {
          let ov = JSON.parse(storedOverrides) || {};
          delete ov[courseId];
          localStorage.setItem('inbiology_course_overrides', JSON.stringify(ov));
          if (window.CloudService && typeof window.CloudService.saveCourseOverridesToCloud === 'function') {
            window.CloudService.saveCourseOverridesToCloud(ov);
          }
        }
      } catch(e) {}

      // 5. Sync deleted & added courses to Supabase Cloud
      if (window.CloudService) {
        if (typeof window.CloudService.saveDeletedCoursesToCloud === 'function') {
          await window.CloudService.saveDeletedCoursesToCloud(deletedList);
        }
        if (typeof window.CloudService.saveAddedCoursesToCloud === 'function') {
          await window.CloudService.saveAddedCoursesToCloud(addedList);
        }
      }

      // 6. Broadcast event & trigger live UI updates
      window.dispatchEvent(new CustomEvent('coursesUpdated', { detail: { courses: COURSES, deletedId: courseId } }));
      if (typeof window.filterAndRender === 'function') window.filterAndRender();
      if (typeof window.renderRecommendedCourses === 'function') window.renderRecommendedCourses();
      if (typeof window.renderDashboardCatalog === 'function') window.renderDashboardCatalog();
      if (typeof window.renderAdminTable === 'function') window.renderAdminTable();

      return true;
    } catch(err) {
      console.error('Failed to delete course:', err);
      return false;
    }
  },

  toggleLessonProgress(courseId, lessonId) {
    const userKey = this.getUserStorageKey();
    const storageKey = `inbiology_progress_${userKey}_${courseId}`;
    const saved = localStorage.getItem(storageKey) || (userKey !== 'guest' ? null : localStorage.getItem('inbiology_progress_' + courseId));
    let completed = [];
    if (saved) {
      try { completed = JSON.parse(saved); } catch(e){}
    }
    const exists = completed.includes(lessonId);
    if (exists) {
      completed = completed.filter(id => id !== lessonId);
    } else {
      completed.push(lessonId);
    }
    localStorage.setItem(storageKey, JSON.stringify(completed));
    localStorage.setItem('inbiology_progress_' + courseId, JSON.stringify(completed));
    return this.getCourseProgress(courseId);
  },

  async syncCoursesAndLessonsFromCloud(force = false) {
    if (!window.CloudService) return;
    const now = Date.now();
    if (!force && this._lastCourseSyncTime && (now - this._lastCourseSyncTime < 2000)) {
      return; // Light throttle to prevent duplicate triggers within 2s
    }
    this._lastCourseSyncTime = now;

    try {
      // High-performance single roundtrip CMS fetch
      let allCms = {};
      if (typeof window.CloudService.fetchAllSiteContent === 'function') {
        allCms = await window.CloudService.fetchAllSiteContent(force);
      }

      // Extract each CMS slice with fallback
      const cloudDeleted = allCms['deleted_courses'] !== undefined ? allCms['deleted_courses'] : (typeof window.CloudService.fetchDeletedCoursesFromCloud === 'function' ? await window.CloudService.fetchDeletedCoursesFromCloud() : null);
      const cloudAdded = allCms['added_courses'] !== undefined ? allCms['added_courses'] : (typeof window.CloudService.fetchAddedCoursesFromCloud === 'function' ? await window.CloudService.fetchAddedCoursesFromCloud(force) : null);
      const cloudLessons = allCms['course_lessons'] !== undefined ? allCms['course_lessons'] : (typeof window.CloudService.fetchCourseLessonsFromCloud === 'function' ? await window.CloudService.fetchCourseLessonsFromCloud() : null);
      const cloudMaterials = allCms['course_materials'] !== undefined ? allCms['course_materials'] : (typeof window.CloudService.fetchCourseMaterialsFromCloud === 'function' ? await window.CloudService.fetchCourseMaterialsFromCloud() : null);
      const cloudOverrides = allCms['course_overrides'] !== undefined ? allCms['course_overrides'] : (typeof window.CloudService.fetchCourseOverridesFromCloud === 'function' ? await window.CloudService.fetchCourseOverridesFromCloud() : null);
      const cloudCoupons = allCms['coupons'] !== undefined ? allCms['coupons'] : (typeof window.CloudService.fetchCouponsFromCloud === 'function' ? await window.CloudService.fetchCouponsFromCloud() : null);

      // 0. Deleted Courses Sync (Cloud + Local merge)
      let localDeleted = [];
      try {
        localDeleted = JSON.parse(localStorage.getItem('inbiology_deleted_courses') || '[]');
      } catch(e) {}
      if (!Array.isArray(localDeleted)) localDeleted = [];

      const mergedDeleted = Array.from(new Set([
        ...localDeleted,
        ...((cloudDeleted && Array.isArray(cloudDeleted)) ? cloudDeleted : [])
      ]));
      localStorage.setItem('inbiology_deleted_courses', JSON.stringify(mergedDeleted));

      // Remove any deleted courses from COURSES array immediately
      if (typeof COURSES !== 'undefined') {
        for (let i = COURSES.length - 1; i >= 0; i--) {
          if (mergedDeleted.includes(COURSES[i].id)) {
            COURSES.splice(i, 1);
          }
        }
        if (COURSES.length === 0 && typeof DEFAULT_COURSES !== 'undefined' && Array.isArray(DEFAULT_COURSES) && DEFAULT_COURSES.length > 0) {
          COURSES.push(...JSON.parse(JSON.stringify(DEFAULT_COURSES)));
        }
      }

      // 1. Course Lessons
      if (cloudLessons && typeof cloudLessons === 'object') {
        const localLessons = JSON.parse(localStorage.getItem('inbiology_course_lessons') || '{}');
        const merged = { ...localLessons, ...cloudLessons };
        localStorage.setItem('inbiology_course_lessons', JSON.stringify(merged));
        if (typeof COURSES !== 'undefined') {
          COURSES.forEach(c => {
            if (merged[c.id] && Array.isArray(merged[c.id])) {
              c.lessons = merged[c.id];
              const totalMins = c.lessons.reduce((acc, l) => acc + (parseInt(l.duration) || 0), 0);
              if (totalMins > 0) c.hours = Math.max(1, Math.round(totalMins / 60));
            }
          });
        }
      }

      // 2. Study Materials
      if (cloudMaterials && typeof cloudMaterials === 'object') {
        const localMaterials = JSON.parse(localStorage.getItem('inbiology_course_materials') || '{}');
        const mergedMaterials = { ...localMaterials, ...cloudMaterials };
        localStorage.setItem('inbiology_course_materials', JSON.stringify(mergedMaterials));
        if (typeof COURSES !== 'undefined') {
          COURSES.forEach(c => {
            if (mergedMaterials[c.id] && Array.isArray(mergedMaterials[c.id])) {
              c.materials = mergedMaterials[c.id];
            }
          });
        }
      }

      // 3. Course Info Overrides
      if (cloudOverrides && typeof cloudOverrides === 'object') {
        const localOverrides = JSON.parse(localStorage.getItem('inbiology_course_overrides') || '{}');
        const mergedOverrides = { ...localOverrides, ...cloudOverrides };
        localStorage.setItem('inbiology_course_overrides', JSON.stringify(mergedOverrides));
        if (typeof COURSES !== 'undefined') {
          COURSES.forEach(c => {
            if (mergedOverrides[c.id]) {
              Object.assign(c, mergedOverrides[c.id]);
            }
          });
        }
      }

      // 4. Added Courses (Filtered against mergedDeleted, normalized, and naturally sorted)
      if (cloudAdded && Array.isArray(cloudAdded)) {
        const validAdded = cloudAdded
          .filter(ac => ac && ac.id && !mergedDeleted.includes(ac.id))
          .map(ac => normalizeCourse(ac));
        localStorage.setItem('inbiology_added_courses', JSON.stringify(validAdded));
        if (typeof COURSES !== 'undefined') {
          validAdded.forEach(ac => {
            const exIdx = COURSES.findIndex(x => x.id === ac.id);
            if (exIdx !== -1) {
              COURSES[exIdx] = { ...COURSES[exIdx], ...ac };
            } else {
              COURSES.push(ac);
            }
          });
          COURSES.forEach(c => normalizeCourse(c));
          sortCoursesNaturally(COURSES);
        }
      }

      // 5. Coupons Sync from Cloud
      if (cloudCoupons && Array.isArray(cloudCoupons) && cloudCoupons.length > 0) {
        localStorage.setItem('inbiology_coupons', JSON.stringify(cloudCoupons));
        if (typeof COUPONS !== 'undefined') {
          COUPONS.length = 0;
          COUPONS.push(...cloudCoupons);
        }
        if (typeof window.renderCouponsTable === 'function') window.renderCouponsTable();
      }

      // 6. Broadcast live update to all subscribed pages
      window.dispatchEvent(new CustomEvent('coursesUpdated', { detail: { courses: COURSES } }));
      if (typeof window.filterAndRender === 'function') window.filterAndRender();
      if (typeof window.renderRecommendedCourses === 'function') window.renderRecommendedCourses();
      if (typeof window.renderDashboardCatalog === 'function') window.renderDashboardCatalog();
      if (typeof window.renderAdminTable === 'function') window.renderAdminTable();
      if (typeof window.renderCouponsTable === 'function') window.renderCouponsTable();
      if (typeof initScrollReveal === 'function') initScrollReveal();
    } catch(err) {
      console.warn('Note: Cloud CMS background sync error:', err);
    }
  },
  
  isEnrolled(courseId) {
    if (!this.enrolled || !Array.isArray(this.enrolled)) return false;
    if (this.enrolled.includes(courseId)) return true;
    const isBio2Target = (courseId === 'bio-intensive-2' || courseId === 'c-1790176559102' || courseId === 'c-1790179918330');
    if (isBio2Target && (this.enrolled.includes('bio-intensive-2') || this.enrolled.includes('c-1790176559102') || this.enrolled.includes('c-1790179918330'))) {
      return true;
    }
    return false;
  },

  saveCart() {
    localStorage.setItem('inbiology_cart', JSON.stringify(this.cart));
    this.updateCartBadges();
  },
  
  isProfileComplete() {
    if (!this.isLoggedIn()) return false;
    const p = this.getStudentProfile();
    if (!p) return false;
    if (p.profileCompleted === false) return false;
    // Essential fields required before placing an order
    const phone = (p.phone || p.phone_number || '').trim();
    const hasValidPhone = phone.length >= 9 && phone !== '0000000000';
    const school = (p.school || '').trim();
    const hasValidSchool = school.length > 0 && school !== 'ยังไม่ได้ระบุ';
    const nickname = (p.nickname || '').trim();
    const hasNickname = nickname.length > 0;
    const fullName = (p.fullName || p.full_name || '').trim();
    const hasFullName = fullName.length > 0 && fullName !== 'ผู้ใช้งาน Google';
    return Boolean(hasValidPhone && hasValidSchool && hasNickname && hasFullName);
  },

  addToCart(course) {
    if (!this.isLoggedIn()) {
      showLoginModal('กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนเลือกซื้อคอร์สเรียน');
      return;
    }
    if (!this.isProfileComplete()) {
      showCompleteProfileModal(course);
      return;
    }
    if (this.isEnrolled(course.id)) {
      showToast('คุณได้ลงทะเบียนในห้องเรียนของคอร์สนี้แล้ว', 'info');
      return;
    }
    if (this.cart.find(c => c.id === course.id)) {
      showToast('คอร์สนี้ถูกเพิ่มลงในตะกร้าชำระเงินเรียบร้อยแล้ว', 'info');
      return;
    }
    this.cart.push(course);
    this.saveCart();
    showToast(`เพิ่ม "${course.title}" ลงในตะกร้าแล้ว`, 'success');
  },
  
  removeFromCart(courseId) {
    this.cart = this.cart.filter(c => c.id !== courseId);
    this.saveCart();
    renderCartDrawer();
  },

  logout() {
    if (window.CloudService && typeof window.CloudService.logout === 'function') {
      window.CloudService.logout();
    }
    this.userRole = null;
    this.enrolled = [];
    sessionStorage.removeItem('inbiology_session_active');
    localStorage.removeItem('inbiology_role');
    localStorage.removeItem('inbiology_student_profile');
    localStorage.removeItem('inbiology_enrolled');
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    setTimeout(() => { location.href = 'index.html'; }, 500);
  },

  updateCartBadges() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
      b.textContent = this.cart.length;
      b.style.display = this.cart.length > 0 ? 'flex' : 'none';
    });
  }
};

// Strict Enrollment & State Synchronization
if (AppState.isLoggedIn()) {
  try {
    AppState.enrolled = AppState.getEnrolledCourses();
  } catch(e) {
    AppState.enrolled = [];
  }
} else {
  // Guests & unauthenticated visitors strictly have 0 enrolled courses
  AppState.enrolled = [];
}

// Coupon Discount Validator Engine (Supports both Flat ฿ and Percentage % discounts with instant Cloud fetch)
async function applyCouponCode(codeStr, currentSubtotal = null) {
  if (!codeStr || !codeStr.trim()) {
    showToast('กรุณากรอกโค้ดส่วนลด', 'error');
    return null;
  }
  const cleanCode = codeStr.trim().toUpperCase();

  // 1. Check in-memory COUPONS and localStorage first
  let list = (typeof COUPONS !== 'undefined' && Array.isArray(COUPONS)) ? COUPONS : [];
  try {
    const stored = JSON.parse(localStorage.getItem('inbiology_coupons') || '[]');
    if (Array.isArray(stored) && stored.length > 0) {
      stored.forEach(sc => {
        if (!list.some(x => x && x.code && x.code.toUpperCase() === sc.code.toUpperCase())) {
          list.push(sc);
        }
      });
    }
  } catch(e) {}

  let found = list.find(c => c && c.code && c.code.toUpperCase() === cleanCode);

  // 2. If not found locally, attempt fast live fetch from Cloud to ensure fresh codes work immediately
  if (!found && window.CloudService && typeof window.CloudService.fetchCouponsFromCloud === 'function') {
    try {
      const cloudList = await window.CloudService.fetchCouponsFromCloud();
      if (Array.isArray(cloudList) && cloudList.length > 0) {
        localStorage.setItem('inbiology_coupons', JSON.stringify(cloudList));
        if (typeof COUPONS !== 'undefined') {
          COUPONS.length = 0;
          COUPONS.push(...cloudList);
        }
        found = cloudList.find(c => c && c.code && c.code.toUpperCase() === cleanCode);
      }
    } catch(e) {}
  }

  if (!found) {
    showToast(`ไม่พบโค้ดส่วนลด "${cleanCode}" หรือโค้ดหมดอายุแล้ว`, 'error');
    return null;
  }

  const isPercent = found.type === 'percent';
  const val = Number(found.discount) || 0;
  let calcAmount = 0;

  // Compute discount based on subtotal
  const subtotal = currentSubtotal !== null ? currentSubtotal : (AppState.cart.reduce((s, c) => s + (Number(c.price) || 0), 0));
  if (isPercent) {
    calcAmount = subtotal > 0 ? Math.round((subtotal * val) / 100) : 0;
  } else {
    calcAmount = val;
  }
  // Discount cannot exceed subtotal
  if (subtotal > 0 && calcAmount > subtotal) {
    calcAmount = subtotal;
  }

  AppState.appliedCoupon = {
    ...found,
    code: cleanCode,
    calculatedDiscount: calcAmount
  };

  const discountBadge = isPercent ? `ลด ${val}% (-฿${formatPrice(calcAmount)})` : `ลด ฿${formatPrice(calcAmount)}`;
  showToast(`🎉 ใช้โค้ดส่วนลด "${cleanCode}" สำเร็จ (${discountBadge})`, 'success');
  return {
    ...found,
    code: cleanCode,
    discount: val,
    type: isPercent ? 'percent' : 'flat',
    discountAmount: calcAmount
  };
}

// ─── NOT READY MODAL POPUP (เริ่มเรียนฟรี / คลังข้อสอบ) ──────────────────────
function showNotReadyModal(type = 'trial') {
  let modal = document.getElementById('not-ready-modal-container');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'not-ready-modal-container';
    document.body.appendChild(modal);
  }

  const isExam = type === 'exam';
  const iconEmoji = isExam ? '📝' : '🎬';
  const title = 'ขออภัยในความไม่สะดวก';
  const message = isExam
    ? 'ขณะนี้ระบบคลังข้อสอบและคลิปเฉลยละเอียดกำลังอยู่ระหว่างการจัดทำและอัปเดตระบบใหม่ เพื่อให้ได้มาตรฐานข้อสอบที่ดีที่สุดครับ<br><br>คลิปและระบบยังไม่พร้อมใช้งานในขณะนี้ กรุณารอติดตามเร็วๆ นี้นะครับ 🙏✨'
    : 'ขณะนี้คลิปและระบบบทเรียนทดลองเรียนฟรียังไม่พร้อมใช้งาน กำลังอยู่ระหว่างการจัดเตรียมและอัปเดตบทเรียนใหม่ครับ<br><br>ขออภัยในความไม่สะดวก กรุณารอติดตามเร็วๆ นี้นะครับ 🙏✨';

  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(15,23,42,0.68);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease">
      <div style="background:white;border-radius:24px;padding:32px 28px;max-width:440px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.25);border:1.5px solid #F1F5F9;position:relative;animation:modalScaleUp 0.25s cubic-bezier(0.16,1,0.3,1)">
        <button onclick="closeNotReadyModal()" style="position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:#F1F5F9;border:none;color:#64748B;font-size:16px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all 0.2s" aria-label="ปิด">✕</button>
        <div style="width:68px;height:68px;border-radius:22px;background:#FEF2F2;border:2px solid #FEE2E2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:34px">
          ${iconEmoji}
        </div>
        <h3 style="font-size:20px;font-weight:950;color:#1E293B;margin:0 0 10px;line-height:1.3">${title}</h3>
        <p style="font-size:13.5px;color:#64748B;line-height:1.65;margin:0 0 24px">${message}</p>
        <div style="display:flex;gap:10px">
          <button onclick="closeNotReadyModal()" style="flex:1;background:var(--c-navy);color:white;font-weight:900;font-size:13.5px;padding:12px 20px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(185,28,28,0.25);transition:all 0.2s">
            ตกลง / เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.style.overflow = 'hidden';
}

function closeNotReadyModal() {
  const modal = document.getElementById('not-ready-modal-container');
  if (modal) {
    modal.innerHTML = '';
  }
  document.body.style.overflow = '';
}
window.showNotReadyModal = showNotReadyModal;
window.closeNotReadyModal = closeNotReadyModal;

// Toast Notifications System
let _toastId = 0;
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const id = ++_toastId;
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `
    <span style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;flex-shrink:0;background:${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#1E3A8A'}">
      ${type === 'success' ? '✓' : type === 'error' ? '✕' : '!'}
    </span>
    <span style="flex:1;color:#374151;font-weight:600;font-size:12px">${message}</span>
    <button onclick="this.parentElement.remove()" style="color:#9CA3AF;cursor:pointer;background:none;border:none">✕</button>
  `;
  container.appendChild(item);
  setTimeout(() => {
    if (item.parentElement) item.remove();
  }, 4000);
}


// Global Modal Drawer Handlers
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('show');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('show');
}

function renderCartDrawer() {
  let drawer = document.getElementById('cart-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'drawer-overlay';
    drawer.onclick = closeCartDrawer;
    document.body.appendChild(drawer);
  }

  const total = AppState.cart.reduce((s, c) => s + c.price, 0);

  drawer.innerHTML = `
    <div class="drawer-panel" onclick="event.stopPropagation()">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:20px;border-bottom:1px solid #E5E7EB">
        <h3 style="display:flex;align-items:center;gap:8px;font-weight:850;color:var(--c-navy);margin:0;font-size:15px">
          ตะกร้าสินค้า
          <span style="background:var(--c-red);color:white;font-size:10px;font-weight:900;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center">${AppState.cart.length}</span>
        </h3>
        <button onclick="closeCartDrawer()" style="padding:8px;border-radius:8px;cursor:pointer;background:none;border:none">✕</button>
      </div>

      <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px">
        ${AppState.cart.length === 0 
          ? `<div style="text-align:center;padding:48px 0;color:#9CA3AF">
              <p style="font-size:13px;font-weight:500">ไม่มีสินค้าในตะกร้า</p>
             </div>`
          : AppState.cart.map(c => `
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB">
                <img src="${c.imageUrl}" style="width:52px;height:36px;object-fit:cover;border-radius:8px" alt="" />
                <div style="flex:1;min-width:0">
                  <p style="font-weight:800;color:var(--c-navy);font-size:12px;margin:0 0 -2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.title}</p>
                  <p style="color:var(--c-red);font-weight:900;font-size:13px;margin:0">฿${formatPrice(c.price)}</p>
                </div>
                <button onclick="AppState.removeFromCart('${c.id}')" style="padding:4px;color:#9CA3AF;cursor:pointer;background:none;border:none">✕</button>
              </div>
            `).join('')
        }
      </div>

      ${AppState.cart.length > 0 ? `
        <div style="padding:20px;border-top:1px solid #E5E7EB;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:800;color:#374151;font-size:14px">ยอดรวม</span>
            <span style="font-weight:900;font-size:22px;color:var(--c-navy)">฿${formatPrice(total)}</span>
          </div>
          <a href="checkout.html" style="width:100%;background:var(--c-red);color:white;font-weight:850;font-size:14px;padding:14px;border-radius:12px;cursor:pointer;border:none;text-align:center">
            ดำเนินการชำระเงิน
          </a>
        </div>
      ` : ''}
    </div>
  `;
}

// Login Requirement Prompt Modal
function showLoginModal(message = 'กรุณาเข้าสู่ระบบก่อนเลือกซื้อคอร์สเรียนหรือเข้าดูบทเรียนของคุณ', redirectUrl = '') {
  let modal = document.getElementById('login-required-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'login-required-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const targetUrl = redirectUrl || (currentPath + window.location.search);
  const loginUrl = 'login.html?redirect=' + encodeURIComponent(targetUrl);

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:440px;width:90%;text-align:center;padding:32px 24px;border-radius:24px;background:white;margin:auto">
      <div style="width:60px;height:60px;background:#EFF6FF;color:#1E3A8A;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 4px 12px rgba(30,58,138,0.12)">
        <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h3 style="font-size:20px;font-weight:950;color:var(--c-navy);margin:0 0 8px">ต้องเข้าสู่ระบบก่อน</h3>
      <p style="font-size:13.5px;color:#6B7280;line-height:1.5;margin:0 0 24px">${message}</p>
      
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="${loginUrl}" style="background:#1E3A8A;color:white;font-weight:900;font-size:14px;padding:12px;border-radius:12px;text-decoration:none;display:block;box-shadow:0 4px 14px rgba(30,58,138,0.25)">
          เข้าสู่ระบบ / สมัครสมาชิก ➔
        </a>
        <button onclick="document.getElementById('login-required-modal').classList.remove('show')" style="background:none;border:1px solid #E5E7EB;color:#6B7280;font-weight:800;font-size:13px;padding:10px;border-radius:12px;cursor:pointer">
          ยกเลิก
        </button>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// ── Profile Completion Modal for Google Users ─────────────────────────────────
function showCompleteProfileModal(courseToResume = null) {
  let modal = document.getElementById('complete-profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'complete-profile-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const p = AppState.getStudentProfile() || {};
  const initialName = (p.fullName && p.fullName !== 'ผู้ใช้งาน Google') ? p.fullName : '';
  const initialNick = (p.nickname && p.nickname !== 'นักเรียน') ? p.nickname : '';
  const initialPhone = (p.phone && p.phone !== '0000000000') ? p.phone : '';
  const initialSchool = (p.school && p.school !== 'ยังไม่ได้ระบุ') ? p.school : '';
  const initialLevel = p.level || 'ม.5';
  const initialBirth = p.birthdate || '2008-01-01';

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('complete-profile-modal').classList.remove('show')"></div>
    <div class="modal-box animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:480px;width:92%;padding:28px 24px;border-radius:24px;background:white;margin:auto;max-height:90vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.2)">
      
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid #F1F5F9;padding-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:10px;background:#EFF6FF;color:#1E3A8A;display:flex;align-items:center;justify-content:center">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <div>
            <h3 style="font-size:16.5px;font-weight:900;color:var(--c-navy);margin:0">กรอกข้อมูลนักเรียนให้ครบถ้วน</h3>
            <p style="font-size:11.5px;color:#64748B;margin:2px 0 0">จำเป็นสำหรับการลงทะเบียนเรียนและตรวจสลิป</p>
          </div>
        </div>
        <button onclick="document.getElementById('complete-profile-modal').classList.remove('show')" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94A3B8;padding:4px">✕</button>
      </div>

      <!-- Info Banner -->
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;margin-bottom:16px">
        <div style="width:20px;height:20px;color:#D97706;flex-shrink:0;margin-top:1px">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div style="font-size:12px;color:#92400E;line-height:1.5">
          คุณเข้าสู่ระบบด้วย Google เรียบร้อยแล้ว กรุณาระบุ <strong>เบอร์โทรศัพท์</strong> และ <strong>โรงเรียน</strong> ให้ครบถ้วนก่อนเลือกซื้อคอร์สเรียนครับ
        </div>
      </div>

      <!-- Form -->
      <form id="complete-profile-form" onsubmit="handleCompleteProfileSubmit(event)" style="display:flex;flex-direction:column;gap:12px;text-align:left">
        
        <!-- Full Name -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            ชื่อจริง - นามสกุล <span style="color:#EF4444">*</span>
          </label>
          <input type="text" id="cprofile-fullname" required value="${initialName}" placeholder="เช่น นาย วิทศรุต สายตา"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Nickname & Level -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
              ชื่อเล่น <span style="color:#EF4444">*</span>
            </label>
            <input type="text" id="cprofile-nickname" required value="${initialNick}" placeholder="เช่น ต้น"
              style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
              ระดับชั้น <span style="color:#EF4444">*</span>
            </label>
            <select id="cprofile-level" required style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;background:white;box-sizing:border-box">
              <option value="ม.4" ${initialLevel === 'ม.4' ? 'selected' : ''}>มัธยมศึกษาปีที่ 4</option>
              <option value="ม.5" ${initialLevel === 'ม.5' ? 'selected' : ''}>มัธยมศึกษาปีที่ 5</option>
              <option value="ม.6" ${initialLevel === 'ม.6' ? 'selected' : ''}>มัธยมศึกษาปีที่ 6</option>
              <option value="ม.ต้น" ${initialLevel === 'ม.ต้น' ? 'selected' : ''}>มัธยมศึกษาตอนต้น</option>
              <option value="ปวช./ปวส." ${initialLevel === 'ปวช./ปวส.' ? 'selected' : ''}>ปวช. / ปวส.</option>
              <option value="มหาวิทยาลัย" ${initialLevel === 'มหาวิทยาลัย' ? 'selected' : ''}>มหาวิทยาลัย</option>
              <option value="บุคคลทั่วไป" ${initialLevel === 'บุคคลทั่วไป' ? 'selected' : ''}>บุคคลทั่วไป</option>
            </select>
          </div>
        </div>

        <!-- Phone Number -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            เบอร์โทรศัพท์มือถือ (10 หลัก) <span style="color:#EF4444">*</span>
          </label>
          <input type="tel" id="cprofile-phone" required maxlength="10" value="${initialPhone}" placeholder="เช่น 0812345678"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
          <span style="font-size:11px;color:#64748B;display:block;margin-top:2px">ใช้สำหรับยืนยันการเรียนและการแจ้งเตือนผลตรวจสลิป</span>
        </div>

        <!-- School -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            โรงเรียน / สถาบันการศึกษา <span style="color:#EF4444">*</span>
          </label>
          <input type="text" id="cprofile-school" required value="${initialSchool}" placeholder="เช่น สวนกุหลาบวิทยาลัย, เตรียมอุดมศึกษา"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Birthdate -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            วันเกิด
          </label>
          <input type="date" id="cprofile-birthdate" value="${initialBirth}"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Submit Button -->
        <button type="submit" id="btn-save-cprofile"
          style="margin-top:8px;background:var(--c-navy);color:white;font-weight:850;font-size:14px;padding:13px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(30,58,138,0.25)">
          บันทึกข้อมูลและดำเนินการต่อ ➔
        </button>

      </form>
    </div>
  `;

  window._pendingCourseToAddToCart = courseToResume;
  modal.classList.add('show');
}

async function handleCompleteProfileSubmit(e) {
  e.preventDefault();
  const fullName = document.getElementById('cprofile-fullname').value.trim();
  const nickname = document.getElementById('cprofile-nickname').value.trim();
  const phone = document.getElementById('cprofile-phone').value.trim().replace(/[^0-9]/g, '');
  const school = document.getElementById('cprofile-school').value.trim();
  const level = document.getElementById('cprofile-level').value;
  const birthdate = document.getElementById('cprofile-birthdate').value;

  if (!fullName) {
    showToast('กรุณากรอกชื่อจริง-นามสกุล', 'error');
    return;
  }
  if (!nickname) {
    showToast('กรุณากรอกชื่อเล่น', 'error');
    return;
  }
  if (phone.length < 9 || phone.length > 10) {
    showToast('กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง', 'error');
    return;
  }
  if (!school) {
    showToast('กรุณากรอกชื่อโรงเรียน', 'error');
    return;
  }

  const btn = document.getElementById('btn-save-cprofile');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ กำลังบันทึกข้อมูล...'; }

  try {
    const current = AppState.getStudentProfile() || {};
    const updated = {
      ...current,
      fullName,
      nickname,
      phone,
      school,
      level,
      birthdate,
      profileCompleted: true
    };

    AppState.saveStudentProfile(updated);

    // Save to Supabase Cloud in background
    if (window.CloudService && typeof window.CloudService.saveUserProfile === 'function') {
      window.CloudService.saveUserProfile(updated.id || updated.email, updated).catch(err => {
        console.warn('Cloud profile save note:', err);
      });
    }

    const modal = document.getElementById('complete-profile-modal');
    if (modal) modal.classList.remove('show');

    showToast('บันทึกข้อมูลเรียบร้อยแล้ว', 'success');

    if (typeof renderHeader === 'function') {
      renderHeader();
    }

    // Resume adding course to cart if pending
    if (window._pendingCourseToAddToCart) {
      const course = window._pendingCourseToAddToCart;
      window._pendingCourseToAddToCart = null;
      AppState.addToCart(course);
    }
  } catch(err) {
    showToast('เกิดข้อผิดพลาด: ' + (err.message || 'กรุณาลองใหม่อีกครั้ง'), 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'บันทึกข้อมูลและดำเนินการต่อ ➔'; }
  }
}

// Video Trial Modal Popup Player
function openTrialModal(trialItem) {
  if (!trialItem) return;
  let modal = document.getElementById('trial-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'trial-video-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => {
      modal.classList.remove('show');
      modal.innerHTML = '';
    };
    document.body.appendChild(modal);
  }

  const ytId = extractYouTubeId(trialItem.videoUrl);
  let playerHtml = '';
  if (ytId) {
    playerHtml = `
      <iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width:100%;height:100%;border:none;border-radius:16px"></iframe>
    `;
  } else if (trialItem.videoUrl) {
    playerHtml = `
      <video src="${trialItem.videoUrl}" controls autoplay style="width:100%;height:100%;object-fit:contain;border-radius:16px"></video>
    `;
  } else {
    playerHtml = `
      <div style="color:#94A3B8;display:flex;align-items:center;justify-content:center;height:100%;font-size:13px">ไม่พบลิงก์วิดีโอสำหรับบทเรียนนี้</div>
    `;
  }

  const sheetSectionHtml = trialItem.sheetUrl ? `
    <div style="margin-top:16px;padding:14px 18px;background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:#DCFCE7;color:#166534">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </span>
        <div>
          <div style="font-size:13.5px;font-weight:900;color:#166534">${trialItem.sheetTitle || 'ชีทสรุปประกอบการเรียนฟรี (PDF)'}</div>
          <div style="font-size:11.5px;color:#15803D;margin-top:2px">ดาวน์โหลดเอกสารทบทวนไปพร้อมกับคลิปวิดีโอ</div>
        </div>
      </div>
      <a href="${trialItem.sheetUrl}" target="_blank" rel="noopener noreferrer" style="background:#166534;color:white;font-weight:850;font-size:12px;padding:8px 18px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 3px 8px rgba(22,101,52,0.25)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ดาวน์โหลดชีท (PDF)
      </a>
    </div>
  ` : '';

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="const m=document.getElementById('trial-video-modal');if(m){m.classList.remove('show');m.innerHTML='';}"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:760px">
      <div class="modal-header" style="padding:16px 20px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;background:#EFF6FF;color:#1E3A8A">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </span>
          <h3 style="font-weight:900;color:var(--c-navy);font-size:15px;margin:0">วิดีโอตัวอย่างทดลองเรียนฟรี</h3>
        </div>
        <button onclick="const m=document.getElementById('trial-video-modal');if(m){m.classList.remove('show');m.innerHTML='';}" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#F8FAFC;border:none;font-size:16px;color:#64748B">✕</button>
      </div>
      <div class="modal-body" style="padding:20px">
        <div style="background:black;border-radius:16px;aspect-ratio:16/9;overflow:hidden;margin-bottom:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px rgba(0,0,0,0.15)">
          ${playerHtml}
        </div>
        <h4 style="font-size:16px;font-weight:900;color:var(--c-navy);margin:0 0 6px;line-height:1.4">${trialItem.title}</h4>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;color:var(--c-sky);font-weight:700">
          <span style="background:#EFF6FF;padding:3px 10px;border-radius:6px;border:1px solid #DBEAFE">${trialItem.course}</span>
          <span>ความยาว ${trialItem.duration}</span>
        </div>
        ${sheetSectionHtml}
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Full Article Reader Modal Popup
function openArticleModal(article) {
  if (!article) return;
  let modal = document.getElementById('article-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'article-reader-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  const rawContent = article.content || article.summary || 'ไม่มีเนื้อหาเพิ่มเติมสำหรับบทความนี้';
  const paragraphs = rawContent
    .split('\n\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 16px">${p.trim().replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const docBoxHtml = article.documentUrl ? `
    <div style="margin:20px 0;padding:16px 20px;background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:#DCFCE7;color:#166534">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </span>
        <div>
          <div style="font-size:14px;font-weight:900;color:#166534">${article.documentName || 'เอกสารประกอบบทความ (PDF)'}</div>
          <div style="font-size:12px;color:#15803D;margin-top:2px">เอกสารและชีทสรุปสำหรับอ่านทบทวน ดาวน์โหลดได้ฟรี</div>
        </div>
      </div>
      <a href="${article.documentUrl}" target="_blank" rel="noopener noreferrer" style="background:#166534;color:white;font-weight:850;font-size:12.5px;padding:9px 20px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 3px 10px rgba(22,101,52,0.25)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ดาวน์โหลดเอกสาร (PDF)
      </a>
    </div>
  ` : '';

  const extLinkHtml = article.articleUrl ? `
    <div style="margin-top:16px;text-align:right">
      <a href="${article.articleUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#1E40AF;text-decoration:none;background:#EFF6FF;border:1px solid #BFDBFE;padding:8px 16px;border-radius:8px">
        <span>อ่านบทความต้นฉบับ / แหล่งอ้างอิง</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  ` : '';

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('article-reader-modal').classList.remove('show')"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:720px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden">
      <div class="modal-header" style="padding:18px 24px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;font-weight:900;background:#EFF6FF;color:#1E40AF;padding:4px 10px;border-radius:6px;border:1px solid #DBEAFE">
            ${article.category || 'บทความชีววิทยา'}
          </span>
          <span style="font-size:12px;color:#64748B;font-weight:600">${article.date}</span>
        </div>
        <button onclick="document.getElementById('article-reader-modal').classList.remove('show')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#F8FAFC;border:none;font-size:16px;color:#64748B">✕</button>
      </div>
      <div class="modal-body" style="padding:24px;overflow-y:auto">
        <h2 style="font-size:20px;font-weight:900;color:var(--c-navy);margin:0 0 12px;line-height:1.4">${article.title}</h2>
        <div style="display:flex;align-items:center;gap:14px;font-size:12px;color:#64748B;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #F1F5F9;flex-wrap:wrap">
          <span style="font-weight:800;color:#1E3A8A">โดย ${article.author || 'พี่ต้น INBIOLOGY'}</span>
          <span>ยอดอ่าน ${article.views || 0} ครั้ง</span>
          <span>เวลาอ่าน ${article.readTime || '5 นาที'}</span>
        </div>

        ${article.imageUrl ? `
          <div style="margin-bottom:20px;border-radius:16px;overflow:hidden;max-height:240px;background:#F1F5F9;display:flex;align-items:center;justify-content:center">
            <img src="${article.imageUrl}" alt="" style="width:100%;height:100%;object-fit:cover" />
          </div>
        ` : ''}

        ${docBoxHtml}

        <div style="color:#374151;margin-top:16px">
          ${paragraphs}
        </div>

        ${extLinkHtml}
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Helpers to find item by ID
window.findArticleItem = function(id) {
  let articles = null;
  try {
    const s = localStorage.getItem('inbiology_articles');
    if (s !== null) articles = JSON.parse(s);
  } catch(e) {}
  if (!Array.isArray(articles) && typeof ARTICLES !== 'undefined') articles = ARTICLES;
  return (articles || []).find(a => String(a.id) === String(id));
};

window.findTrialItem = function(id) {
  let trials = null;
  try {
    const s = localStorage.getItem('inbiology_free_trials');
    if (s !== null) trials = JSON.parse(s);
  } catch(e) {}
  if (!Array.isArray(trials) && typeof FREE_TRIALS !== 'undefined') trials = FREE_TRIALS;
  return (trials || []).find(t => String(t.id) === String(id));
};

// Review Detail Modal Helper
function openReviewModal(studentNameOrId) {
  const r = (typeof REVIEWS !== 'undefined' ? REVIEWS : []).find(x => x.id === studentNameOrId || x.name === studentNameOrId);
  if (!r) return;

  let modal = document.getElementById('review-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'review-detail-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('review-detail-modal').classList.remove('show')"></div>
    <div class="modal-box animate-fade-in-up" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="font-weight:800;color:var(--c-navy);font-size:14px;margin:0">รีวิวจาก ${r.name}</h3>
        <button onclick="document.getElementById('review-detail-modal').classList.remove('show')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center">
          <div style="width:130px;height:130px;border-radius:50%;overflow:hidden;background:#DEC8B3;border:3px solid #B91C1C;box-shadow:0 8px 24px rgba(0,0,0,0.1)">
            <img src="${r.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:${r.imagePosition || 'center top'}" />
          </div>
          <div>
            <h3 style="color:#B91C1C;margin:0 0 4px;font-size:18px;font-weight:900">${r.name}</h3>
            ${r.school ? `<p style="color:#1E3A8A;font-weight:800;font-size:13px;margin:4px 0">${r.school}</p>` : ''}
            <span style="background:#FEE2E2;color:#B91C1C;font-size:11px;font-weight:850;padding:6px 14px;border-radius:20px;border:1px solid rgba(185,28,28,0.1);display:inline-block;margin-top:6px;line-height:1.4">${r.score}</span>
          </div>
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:20px;width:100%;text-align:left">
            <p style="color:#374151;font-size:13.5px;line-height:1.7;margin:0;white-space:pre-line">"${r.text}"</p>
          </div>
          <div style="align-self:flex-start;font-size:12px;color:#6B7280;font-weight:700">
            <span>คอร์สเรียน: </span><span style="color:#1E3A8A">${r.course}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Bio Intensive I - VI Terms Detail Modal
function openBioIntensiveModal() {
  let modal = document.getElementById('global-bio-intensive-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-bio-intensive-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const termsData = [
    {
      term: 'ม.4 (เทอม 1)',
      badge: 'Bio Intensive I',
      badgeBg: '#1E3A8A',
      courseId: 'bio-intensive-1',
      title: 'Introbiology & Biochemistry & Cell Biology',
      cover: './course-cover-bio-intensive-1.jpg',
      price: 1190,
      originalPrice: 2500,
      topics: [
        'บทนำชีววิทยา & ทักษะการสืบเสาะ',
        'สารชีวโมเลกุล (คาร์โบไฮเดรต, โปรตีน, ลิพิด, กรดนิวคลีอิก)',
        'โครงสร้างและหน้าที่ของเซลล์ & ออร์แกเนลล์',
        'การลำเลียงสารผ่านเยื่อหุ้มเซลล์ & เอนไซม์',
        'การแบ่งเซลล์ Mitosis & Meiosis'
      ]
    },
    {
      term: 'ม.4 (เทอม 2)',
      badge: 'Bio Intensive II',
      badgeBg: '#0284C7',
      courseId: 'c-1790176559102',
      title: 'Genetics & Evolution (พันธุศาสตร์และวิวัฒนาการ)',
      cover: './course-cover-c-1790176559102.jpg',
      price: 1250,
      originalPrice: 2500,
      topics: [
        'พันธุศาสตร์เมนเดล & ส่วนขยายเมนเดล',
        'โครงสร้าง DNA, RNA & การจำลองตัวของดีเอ็นเอ',
        'การถอดรหัสและการแปลรหัสพันธุกรรม',
        'เทคโนโลยีทางดีเอ็นเอ (PCR, Gel Electrophoresis)',
        'หลักการและกลไกการเกิดวิวัฒนาการ'
      ]
    },
    {
      term: 'ม.5 (เทอม 1)',
      badge: 'Bio Intensive III',
      badgeBg: '#10B981',
      courseId: 'bio-intensive-3',
      title: 'Plant Biology (ชีววิทยาของพืช)',
      cover: './course-cover-3.jpg',
      price: 1290,
      originalPrice: 2400,
      topics: [
        'โครงสร้างและเนื้อเยื่อพืชมีท่อลำเลียง',
        'กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis)',
        'การลำเลียงน้ำและอาหารในพืช (Xylem & Phloem)',
        'การสืบพันธุ์และการเจริญเติบโตของพืชดอก',
        'ฮอร์โมนพืช (Auxin, Gibberellin, Cytokinin)'
      ]
    },
    {
      term: 'ม.5 (เทอม 2)',
      badge: 'Bio Intensive IV',
      badgeBg: '#F59E0B',
      courseId: 'bio-intensive-4',
      title: 'Animal Biology I (สรีรวิทยาสัตว์และมนุษย์ พาร์ต 1)',
      cover: './course-cover-4.jpg',
      price: 1490,
      originalPrice: 2800,
      topics: [
        'ระบบย่อยอาหารและการดูดซึมสารอาหาร',
        'โครงสร้างหัวใจและระบบหมุนเวียนเลือด/น้ำเหลือง',
        'ระบบแลกเปลี่ยนแก๊สและการหายใจ',
        'โครงสร้างไต ระบบขับถ่าย และการรักษาสมดุลร่างกาย'
      ]
    },
    {
      term: 'ม.6 (เทอม 1)',
      badge: 'Bio Intensive V',
      badgeBg: '#8B5CF6',
      courseId: 'bio-intensive-5',
      title: 'Animal Biology II (ระบบควบคุมและประสานงาน)',
      cover: './course-cover-bio-intensive-5.jpg',
      price: 1490,
      originalPrice: 2800,
      topics: [
        'เซลล์ประสาท การส่งกระแสประสาท (Action Potential)',
        'ระบบสมอง ไขสันหลัง และระบบประสาทอัตโนมัติ',
        'ระบบต่อมไร้ท่อและการควบคุมฮอร์โมน',
        'ระบบภูมิคุ้มกันร่างกายและการป้องกันเชื้อโรค',
        'ระบบสืบพันธุ์และการเจริญเติบโตของเอ็มบริโอ'
      ]
    },
    {
      term: 'ม.6 (เทอม 2)',
      badge: 'Bio Intensive VI',
      badgeBg: '#059669',
      courseId: 'bio-intensive-6',
      title: 'Ecology, Diversity & Animal Behavior (นิเวศวิทยาและความหลากหลาย)',
      cover: './course-cover-bio-intensive-6.jpg',
      price: 1390,
      originalPrice: 2600,
      topics: [
        'พฤติกรรมของสัตว์ (Innate & Learned Behavior)',
        'ระบบนิเวศ ไบโอม และการถ่ายทอดพลังงาน',
        'ประชากรศาสตร์และปฏิสัมพันธ์สิ่งมีชีวิต',
        'ความหลากหลายทางชีวภาพและ 5 อาณาจักร',
        'การอนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม'
      ]
    }
  ];

  let deletedList = [];
  try {
    deletedList = JSON.parse(localStorage.getItem('inbiology_deleted_courses') || '[]');
  } catch(e) {}
  const availableTerms = termsData.filter(t => !deletedList.includes(t.courseId) && (typeof COURSES === 'undefined' || COURSES.some(c => c.id === t.courseId || (t.courseId === 'c-1790176559102' && c.id === 'bio-intensive-2'))));

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('global-bio-intensive-modal').classList.remove('show')"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:980px;max-height:90vh;display:flex;flex-direction:column;padding:0;overflow:hidden;border-radius:24px">
      <!-- Modal Header -->
      <div style="background:linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);color:white;padding:24px 28px;position:relative">
        <button onclick="document.getElementById('global-bio-intensive-modal').classList.remove('show')" style="position:absolute;top:20px;right:20px;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,255,255,0.15);border:none;font-size:18px;color:white;transition:background 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">✕</button>
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(250,204,21,0.2);border:1px solid rgba(250,204,21,0.4);color:#FDE047;font-size:11px;font-weight:900;padding:4px 12px;border-radius:999px;margin-bottom:10px">
          🧬 เจาะลึกชีววิทยา ม.ปลาย ครบทุกเทอม (สสวท.)
        </div>
        <h2 style="font-size:24px;font-weight:950;margin:0 0 6px;color:white;line-height:1.3">
          Bio Intensive I - VI ตะลุยเนื้อหา ม.ปลาย เข้มข้น
        </h2>
        <p style="font-size:13.5px;color:#CBD5E1;margin:0;line-height:1.6">
          โครงสร้างเนื้อหาแบ่งตามระดับชั้นและรายเทอม ชัดเจน ตรงประเด็น เตรียมพร้อมทั้งสอบเพิ่มเกรดและสอบเข้ามหาวิทยาลัย
        </p>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div style="padding:22px 24px;overflow-y:auto;background:#F8FAFC;flex:1">
        <!-- Promo Bundle Callout Banner -->
        <div style="background:linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);border:1.5px solid #BFDBFE;border-radius:18px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="background:#EF4444;color:white;font-size:10px;font-weight:900;padding:2px 8px;border-radius:6px">FLASH SALE</span>
              <strong style="color:#1E3A8A;font-size:15px;font-weight:900">Bio Intensive I - VI Complete Set (ครบชุด 6 คอร์ส)</strong>
            </div>
            <p style="font-size:12.5px;color:#475569;margin:0">สมัครครบเซตลดสูงสุด 30% จัดส่งเอกสารและรูปเล่มสรุปฟรีถึงบ้าน!</p>
          </div>
          <button onclick="document.getElementById('global-bio-intensive-modal').classList.remove('show');location.href='courses.html?category=bio-intensive'" style="background:#EF4444;color:white;font-size:13px;font-weight:850;padding:10px 20px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(239,68,68,0.3);white-space:nowrap;transition:transform 0.15s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
            ดูคอร์สทั้งหมด ➔
          </button>
        </div>

        <!-- Terms Cards Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
          ${availableTerms.map(t => `
            <div style="background:white;border:1px solid #E2E8F0;border-radius:18px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s,box-shadow 0.2s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.03)'">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                  <span style="background:${t.badgeBg};color:white;font-size:10.5px;font-weight:900;padding:3px 10px;border-radius:6px">${t.badge}</span>
                  <span style="font-size:11.5px;font-weight:850;color:#1E3A8A;background:#EFF6FF;padding:3px 10px;border-radius:999px;border:1px solid #DBEAFE">📅 ${t.term}</span>
                </div>
                <h3 style="font-size:14.5px;font-weight:900;color:#0F172A;margin:0 0 10px;line-height:1.4">${t.title}</h3>
                <div style="background:#F8FAFC;border:1px solid #F1F5F9;border-radius:12px;padding:10px 12px;margin-bottom:14px">
                  <p style="font-size:11px;font-weight:800;color:#64748B;margin:0 0 6px">เนื้อหาสำคัญประจำเทอม:</p>
                  <ul style="margin:0;padding-left:16px;font-size:11.5px;color:#334155;line-height:1.65;font-weight:600">
                    ${t.topics.map(tp => `<li>${tp}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #F1F5F9;margin-top:auto">
                <div>
                  <span style="font-size:11px;color:#94A3B8;text-decoration:line-through;margin-right:4px">฿${t.originalPrice.toLocaleString()}</span>
                  <span style="font-size:16px;font-weight:950;color:#B91C1C">฿${t.price.toLocaleString()}</span>
                </div>
                <div style="display:flex;gap:6px">
                  <button onclick="document.getElementById('global-bio-intensive-modal').classList.remove('show');if(window.openCourseModal && (typeof COURSES!=='undefined')){const c=COURSES.find(x=>x.id==='${t.courseId}');if(c)openCourseModal(c);else location.href='courses.html';}" style="background:#EFF6FF;color:#1E3A8A;border:1px solid #BFDBFE;font-size:11px;font-weight:800;padding:6px 10px;border-radius:8px;cursor:pointer">
                    รายละเอียด
                  </button>
                  <button onclick="document.getElementById('global-bio-intensive-modal').classList.remove('show');if(typeof AppState!=='undefined' && (typeof COURSES!=='undefined')){const c=COURSES.find(x=>x.id==='${t.courseId}');if(c)AppState.addToCart(c);else location.href='courses.html';}" style="background:#1E3A8A;color:white;border:none;font-size:11px;font-weight:800;padding:6px 12px;border-radius:8px;cursor:pointer">
                    🛒 สมัคร
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');
}
window.openBioIntensiveModal = openBioIntensiveModal;

// Course Detail Modal Helper
function openCourseModal(course) {
  let modal = document.getElementById('global-course-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-course-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  const isEnrolled = AppState.isEnrolled ? AppState.isEnrolled(course.id) : AppState.enrolled.includes(course.id);
  const discountPercent = (course.originalPrice && course.originalPrice > course.price)
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : null;

  const lessons = AppState.getCourseLessons(course.id) || [];
  const lessonCount = lessons.length > 0 ? lessons.length : (course.lessons || 6);
  const durationMinutes = lessons.reduce((acc, l) => acc + (Number(l.duration) || 45), 0);

  const trial = (typeof TRIAL_LESSONS !== 'undefined' ? TRIAL_LESSONS.find(t =>
    (course.badge && t.course.toLowerCase().includes(course.badge.toLowerCase())) ||
    (course.title && t.course.toLowerCase().includes(course.title.toLowerCase()))
  ) : null) || (typeof TRIAL_LESSONS !== 'undefined' ? TRIAL_LESSONS[0] : null);

  modal.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('global-course-modal').classList.remove('show')"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()">
      <div class="modal-header" style="background:#F8FAFC">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="background:${course.badgeBg || '#1E3A8A'};color:white;font-size:11px;font-weight:900;padding:3px 10px;border-radius:6px">${course.badge || 'INBIOLOGY'}</span>
          <span style="background:#E2E8F0;color:#334155;font-size:11px;font-weight:800;padding:3px 10px;border-radius:6px">${course.level || 'ม.ปลาย'}</span>
          <span style="font-weight:800;color:var(--c-navy);font-size:13px">หน้ารายละเอียดหลักสูตร</span>
        </div>
        <button onclick="document.getElementById('global-course-modal').classList.remove('show')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none;font-size:18px;color:#64748B">✕</button>
      </div>
      <div class="modal-body" style="background:#FAFAFA">
        <div class="course-modal-grid">
          <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
            <div style="height:210px;background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);border-radius:18px;display:flex;align-items:center;justify-content:center;padding:16px;box-shadow:inset 0 2px 8px rgba(255,255,255,0.05)">
              <img src="${course.imageUrl || './course-cover-1.png'}" style="height:170px;max-width:85%;object-fit:contain;border-radius:10px;box-shadow:0 12px 28px rgba(0,0,0,0.35)" alt="${course.title}" onerror="this.src='./course-cover-1.png'" />
            </div>

            <div>
              <h2 style="font-size:20px;font-weight:950;color:var(--c-navy);margin:0 0 8px;line-height:1.35">${course.title}</h2>
              <p style="font-size:13px;color:#4B5563;line-height:1.65;margin:0 0 12px">${course.description || 'คอร์สเรียนชีววิทยาเข้มข้น จัดเต็มเนื้อหาและเทคนิคการจำ ตรงตามแนวข้อสอบจริง'}</p>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;background:white;padding:14px;border-radius:14px;border:1px solid #E2E8F0">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:20px">⏱️</span>
                <div>
                  <div style="font-size:10px;color:#64748B;font-weight:700">ชั่วโมงเรียน</div>
                  <div style="font-size:13px;font-weight:900;color:var(--c-navy)">${course.hours || 30} ชั่วโมง</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                <div>
                  <div style="font-size:10px;color:#64748B;font-weight:700">จำนวนบทเรียน</div>
                  <div style="font-size:13px;font-weight:900;color:var(--c-navy)">${lessonCount} ตอน (${durationMinutes} น.)</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div>
                  <div style="font-size:10px;color:#64748B;font-weight:700">อายุการใช้งาน</div>
                  <div style="font-size:13px;font-weight:900;color:var(--c-navy)">${course.validityDays || 365} วัน</div>
                </div>
              </div>
            </div>

            <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:12px">
              <img src="./hero-instructor.png" alt="พี่ต้น" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #1E3A8A;flex-shrink:0" onerror="this.style.display='none'" />
              <div>
                <div style="font-size:12.5px;font-weight:900;color:#1E3A8A">สอนโดย พี่ต้น (INBIOLOGY)</div>
                <div style="font-size:11px;color:#3B82F6;font-weight:700">เกียรตินิยมอันดับ 1 • ประสบการณ์สอนชีววิทยา 9 ปี</div>
              </div>
            </div>
          </div>

          <div style="background:white;border:1px solid #E2E8F0;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:16px;box-shadow:0 4px 16px rgba(0,0,0,0.03);position:sticky;top:20px">
            <div>
              <div style="font-size:11px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.5px">ราคาคอร์สเรียน</div>
              <div style="display:flex;align-items:baseline;gap:8px;margin-top:4px">
                <span style="font-size:32px;font-weight:950;color:#B91C1C;line-height:1">฿${formatPrice(course.price)}</span>
                ${course.originalPrice && course.originalPrice > course.price ? `
                  <span style="font-size:16px;color:#94A3B8;text-decoration:line-through;font-weight:700">฿${formatPrice(course.originalPrice)}</span>
                  <span style="background:#FEE2E2;color:#DC2626;font-size:11px;font-weight:900;padding:2px 8px;border-radius:6px">-${discountPercent}%</span>
                ` : ''}
              </div>
            </div>

            <div style="border-top:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;padding:12px 0;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#334155">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:#10B981;font-weight:900">✓</span>
                <span>เข้าดูคลิปวิดีโอได้ไม่จำกัดรอบตลอด ${course.validityDays || 365} วัน</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:#10B981;font-weight:900">✓</span>
                <span>ฟรี ไฟล์ e-Book PDF & ชีทสรุป Mindmap</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:#10B981;font-weight:900">✓</span>
                <span>ระบบบันทึกโน้ตย่อส่วนตัวในบทเรียน</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:#10B981;font-weight:900">✓</span>
                <span>ระบบพิมพ์คำถามส่งตรงถึงพี่ต้น</span>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px">
              ${isEnrolled ? `
                <a href="classroom.html?course=${course.id}" style="width:100%;background:#D1FAE5;color:#065F46;border:1.5px solid #6EE7B7;font-weight:900;font-size:14px;padding:13px;border-radius:12px;cursor:pointer;text-align:center;text-decoration:none;display:block;box-sizing:border-box">
                  เข้าสู่ห้องเรียน ➔
                </a>
              ` : `
                <button onclick="AppState.addToCart(COURSES.find(c=>c.id==='${course.id}'));document.getElementById('global-course-modal').classList.remove('show')" style="width:100%;background:var(--c-sky);color:white;font-weight:900;font-size:14px;padding:13px;border-radius:12px;cursor:pointer;border:none;box-shadow:0 4px 14px rgba(30,58,138,0.25);transition:transform 0.15s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                  สมัครเรียนคอร์สนี้
                </button>
              `}

              ${trial ? `
                <button onclick="document.getElementById('global-course-modal').classList.remove('show');openTrialModal(TRIAL_LESSONS.find(t=>t.id==='${trial.id}') || TRIAL_LESSONS[0])" style="width:100%;background:#EFF6FF;color:#1E3A8A;border:1px solid #BFDBFE;font-weight:850;font-size:12.5px;padding:11px;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px">
                  ทดลองเรียนฟรี
                </button>
              ` : ''}

              ${AppState.userRole === 'admin' ? `
                <a href="admin.html?edit=${course.id}" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;font-weight:800;font-size:11.5px;padding:9px 12px;border-radius:10px;text-decoration:none;box-sizing:border-box">
                  แก้ไขคอร์สนี้ในระบบแอดมิน
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Universal Header Builder
function renderHeader(activePage = 'home') {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const isLoggedIn = Boolean(AppState.userRole && AppState.userRole !== 'guest');
  const isAdmin = AppState.userRole === 'admin';

  const studentProfile = AppState.getStudentProfile();
  const studentDisplayName = studentProfile ? `น้อง${studentProfile.nickname || studentProfile.fullName || 'นักเรียน'}` : 'นักเรียน';

  header.innerHTML = `
    <div class="header-container">
      <a href="index.html" class="logo-btn" aria-label="INBIOLOGY หน้าแรก">
        <img src="./logo.png" alt="INBIOLOGY Logo" class="logo-img" style="height:44px;width:auto;object-fit:contain" />
        <div style="text-align:left">
          <span style="font-weight:700;font-size:18px;color:var(--c-navy);display:block;line-height:1;letter-spacing:-0.3px">INBIOLOGY</span>
          <span style="font-size:10px;font-weight:600;color:var(--c-sky);display:block;margin-top:2px">by พี่ต้น</span>
        </div>
      </a>

      <nav class="desktop-nav" aria-label="เมนูหลัก">
        <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">หน้าแรก</a>
        <a href="courses.html" class="nav-link ${activePage === 'courses' ? 'active' : ''}">คอร์สเรียน</a>
        <a href="javascript:void(0)" onclick="showNotReadyModal('exam')" class="nav-link ${activePage === 'exam' ? 'active' : ''}">คลังข้อสอบ</a>
        <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">เกี่ยวกับเรา</a>
        <a href="faq.html" class="nav-link ${activePage === 'faq' ? 'active' : ''}">คำถามพบบ่อย</a>
        ${isLoggedIn ? `
          <a href="classroom.html" class="nav-link ${activePage === 'classroom' ? 'active' : ''}">คอร์สของฉัน</a>
          <a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">แดชบอร์ด</a>
        ` : ''}
        ${isAdmin ? `<a href="admin.html" class="nav-link ${activePage === 'admin' ? 'active' : ''}">แอดมิน</a>` : ''}
      </nav>

      <div class="header-right-actions" style="display:flex;align-items:center;gap:8px">
        <button onclick="openCartDrawer()" class="cart-icon-btn" title="ตะกร้าสินค้า" aria-label="เปิดตะกร้าสินค้า">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span class="cart-badge" style="display:${AppState.cart.length > 0 ? 'flex' : 'none'}">${AppState.cart.length}</span>
        </button>

        ${!isLoggedIn
          ? `<a href="login.html" class="btn-login">เข้าสู่ระบบ</a>`
          : `<div class="header-user-actions" style="display:flex;align-items:center;gap:6px">
              <a href="dashboard.html" class="header-user-badge">
                ${isAdmin ? 'แอดมิน' : studentDisplayName}
              </a>
              <button onclick="AppState.logout()" class="header-logout-btn" title="ออกจากระบบ" style="padding:6px 12px;background:#FEE2E2;color:#DC2626;border-radius:10px;font-size:11px;font-weight:800;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;white-space:nowrap">
                ออกจากระบบ
              </button>
            </div>`
        }

        <button onclick="document.getElementById('nav-dropdown').classList.toggle('show')" class="hamburger-btn" aria-label="เปิดเมนูบนมือถือ">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <div id="nav-dropdown" class="dropdown-panel">
          <a href="index.html" class="dropdown-item">หน้าแรก</a>
          <a href="courses.html" class="dropdown-item">คอร์สเรียนทั้งหมด</a>
          <a href="javascript:void(0)" onclick="showNotReadyModal('exam')" class="dropdown-item">คลังข้อสอบ A-Level</a>
          <a href="about.html" class="dropdown-item">เกี่ยวกับเรา</a>
          <a href="faq.html" class="dropdown-item">คำถามพบบ่อย</a>
          <a href="guide.html" class="dropdown-item">คู่มือการใช้งาน</a>
          ${isLoggedIn ? `
            <a href="classroom.html" class="dropdown-item">คอร์สเรียนของฉัน</a>
            <a href="dashboard.html" class="dropdown-item">แดชบอร์ดของฉัน</a>
            <a href="dashboard.html?tab=orders" class="dropdown-item">ประวัติการสั่งซื้อ</a>
          ` : ''}
          ${isAdmin ? `<a href="admin.html" class="dropdown-item">แดชบอร์ดแอดมิน</a>` : ''}
          ${isLoggedIn 
            ? `<button onclick="AppState.logout()" class="dropdown-item" style="color:#DC2626;font-weight:800">ออกจากระบบ</button>`
            : `<a href="login.html" class="dropdown-item" style="color:var(--c-sky);font-weight:800">เข้าสู่ระบบ</a>`
          }
        </div>
      </div>
    </div>
  `;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  renderFooter();
  initBackToTop();
}

// Clean, Streamlined Footer (Non-cluttered & hidden on focused workspaces)
function renderFooter() {
  const currentPath = window.location.pathname.toLowerCase();
  const isFocusedPage = currentPath.includes('classroom') || currentPath.includes('checkout') || currentPath.includes('admin') || currentPath.includes('login');

  let footer = document.querySelector('.site-footer') || document.getElementById('footer-container');

  if (isFocusedPage) {
    if (footer) footer.style.display = 'none';
    return;
  }

  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer';
    document.body.appendChild(footer);
  } else {
    footer.className = 'site-footer';
    footer.style.display = 'block';
  }

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-clean-content">
        <!-- Brand & Description -->
        <div class="footer-brand-block">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <img src="./logo.png" alt="INBIOLOGY Logo" style="height:36px;width:auto;object-fit:contain" />
            <div>
              <span style="font-weight:800;font-size:16px;color:#F8FAFC;display:block;line-height:1">INBIOLOGY</span>
              <span style="font-size:10.5px;font-weight:600;color:#93C5FD;display:block;margin-top:2px">สถาบันกวดวิชาชีววิทยาออนไลน์ โดย พี่ต้น</span>
            </div>
          </div>
          <p style="font-size:12.5px;color:#94A3B8;margin:0 0 14px;line-height:1.5">
            เรียนชีวะให้เข้าใจ ไม่ใช่แค่ท่องจำ ดูแลน้องๆ สู่คณะในฝัน
          </p>
          <div class="footer-social-row" style="margin-top:0">
            <a href="https://www.facebook.com/share/1K2bmAys3f/?mibextid=wwXIfr" target="_blank" rel="noopener" class="footer-social-btn" title="Facebook INBIOLOGY" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="color:#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://lin.ee/sYQ6MIn" target="_blank" rel="noopener" class="footer-social-btn" title="LINE Official @inbiology" aria-label="LINE Official">
              <img src="./social_line.png" alt="LINE" style="width:18px;height:18px;object-fit:contain" />
            </a>
            <a href="https://www.tiktok.com/@tonnarabbit" target="_blank" rel="noopener" class="footer-social-btn" title="TikTok @ครูต้นInbiology" aria-label="TikTok">
              <img src="./social_tiktok.png" alt="TikTok" style="width:18px;height:18px;object-fit:contain" />
            </a>
            <a href="https://www.instagram.com/inbiology_/" target="_blank" rel="noopener" class="footer-social-btn" title="Instagram @INBIOLOGY_" aria-label="Instagram">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="color:#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Navigation Links -->
        <div class="footer-quick-nav">
          <div class="footer-col">
            <h4>เมนูลัด</h4>
            <ul class="footer-links">
              <li><a href="index.html">หน้าแรก</a></li>
              <li><a href="courses.html">คอร์สเรียนทั้งหมด</a></li>
              <li><a href="exam.html">คลังข้อสอบ A-Level</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>ติดต่อ & ช่วยเหลือ</h4>
            <ul class="footer-links">
              <li><a href="about.html">เกี่ยวกับพี่ต้น</a></li>
              <li><a href="faq.html">คำถามพบบ่อย</a></li>
              <li><a href="https://lin.ee/sYQ6MIn" target="_blank" rel="noopener" style="color:#38BDF8;font-weight:800">LINE: @inbiology</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom" style="margin-top:24px;padding-top:16px;border-top:1px solid #1E293B">
        <div style="font-size:12px">
          © 2026 <strong>INBIOLOGY Academy by พี่ต้น</strong>. All rights reserved.
        </div>
        <div class="footer-legal-links" style="font-size:11.5px;gap:14px">
          <a href="privacy.html">นโยบายความเป็นส่วนตัว (PDPA)</a>
          <span>•</span>
          <a href="terms.html">ข้อกำหนดการใช้งาน</a>
        </div>
      </div>
    </div>
  `;
}

// Floating Back-to-Top Button (Audit 2.2)
function initBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'กลับสู่ด้านบนสุดของหน้า');
    btn.title = 'กลับสู่ด้านบนสุด';
    btn.innerHTML = '↑';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

function toggleMyCoursesMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('my-courses-menu');
  if (!menu) return;

  const isShowing = menu.style.display === 'flex';
  if (isShowing) {
    menu.style.display = 'none';
    return;
  }

  const enrolledCourses = COURSES.filter(c => AppState.isEnrolled ? AppState.isEnrolled(c.id) : AppState.enrolled.includes(c.id));

  if (enrolledCourses.length === 0) {
    menu.innerHTML = `
      <div style="padding:12px;text-align:center">
        <p style="font-size:11px;color:#6B7280;margin:0 0 8px">ยังไม่มีคอร์สเรียนที่ลงทะเบียน</p>
        <a href="courses.html" style="background:var(--c-navy);color:white;font-weight:800;font-size:11px;padding:6px 12px;border-radius:8px;text-decoration:none;display:inline-block">เลือกดูคอร์สเรียนทั้งหมด</a>
      </div>
    `;
  } else {
    menu.innerHTML = `
      <div style="padding:4px 6px;border-bottom:1px solid #F3F4F6;margin-bottom:4px">
        <span style="font-size:10px;font-weight:900;color:#9CA3AF">คอร์สที่พร้อมเรียน (${enrolledCourses.length})</span>
      </div>
      ${enrolledCourses.map(c => `
        <a href="classroom.html" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;text-decoration:none;transition:background 0.2s" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='transparent'">
          <img src="${c.imageUrl}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;background:#F1F5F9;padding:2px" alt="" />
          <div style="overflow:hidden">
            <h5 style="font-size:12px;font-weight:850;color:var(--c-navy);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</h5>
            <span style="font-size:10px;color:var(--c-sky);font-weight:700">เข้าเรียนบทเรียนนี้ ➔</span>
          </div>
        </a>
      `).join('')}
    `;
  }

  menu.style.display = 'flex';
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('my-courses-menu');
  if (menu && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }

  const dropdown = document.getElementById('nav-dropdown');
  const hamburger = document.querySelector('.hamburger-btn');
  if (dropdown && dropdown.classList.contains('show')) {
    if (!dropdown.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
      dropdown.classList.remove('show');
    }
  }
});

// Scroll Reveal Observer Engine (Instant viewport reveal for Safari & Mobile)
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // 1. Immediately reveal elements already within the initial screen view (0ms delay for Safari)
  const vh = window.innerHeight || document.documentElement.clientHeight || 800;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 100 && rect.bottom > -50) {
      el.classList.add('revealed');
    }
  });

  // 2. Observe remaining off-screen elements
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 60px 0px'
    });

    elements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        const delay = el.getAttribute('data-delay');
        if (delay) {
          el.style.transitionDelay = delay;
        }
        observer.observe(el);
      }
    });
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }

  // 3. Fallback safety timer: ensure any unrevealed element becomes visible within 800ms
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 800);
}

// Automatically re-trigger scroll reveal whenever courses or site content update
window.addEventListener('coursesUpdated', () => {
  setTimeout(() => {
    if (typeof initScrollReveal === 'function') initScrollReveal();
  }, 50);
});

// FAQ Accordion & Category Filter Helper (Audit 1.2)
function initFaqPage() {
  const container = document.getElementById('faq-list-container');
  if (!container) return;

  function renderFaqItems(filterCat = 'all') {
    const items = filterCat === 'all' 
      ? FAQS 
      : FAQS.filter(f => f.category === filterCat);
    
    container.innerHTML = items.map((f, idx) => `
      <div class="faq-item-card ${idx === 0 ? 'open' : ''}" data-category="${f.category}">
        <button class="faq-header-btn" onclick="this.parentElement.classList.toggle('open')" aria-expanded="${idx === 0}">
          <span style="font-weight:700">${f.q}</span>
          <span class="faq-icon-arrow">▼</span>
        </button>
        <div class="faq-answer-body">
          <p>${f.a}</p>
        </div>
      </div>
    `).join('');
  }

  const pills = document.querySelectorAll('.faq-cat-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-cat') || 'all';
      renderFaqItems(cat);
    });
  });

  renderFaqItems('all');
}

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('inbiology_darkmode');
  document.body.classList.remove('dark-mode');
  initScrollReveal();

  const isAuthPage = Boolean(
    document.querySelector('.auth-wrapper') ||
    window.location.pathname.endsWith('login.html')
  );

  if (!isAuthPage) {
    initBackToTop();
    if (!document.querySelector('.site-footer')) {
      renderFooter();
    }
  }

  if (document.getElementById('faq-list-container')) {
    initFaqPage();
  }

  // ☁️ Sync latest real-time courses and video lessons from Supabase cloud
  if (typeof AppState !== 'undefined' && typeof AppState.syncCoursesAndLessonsFromCloud === 'function') {
    AppState.syncCoursesAndLessonsFromCloud();
  }

  // 🔄 Multi-Device Cloud Sync: Sync user role and profile from Supabase cloud
  if (typeof AppState !== 'undefined' && typeof AppState.syncUserProfileWithCloud === 'function') {
    AppState.syncUserProfileWithCloud();
  }
});

