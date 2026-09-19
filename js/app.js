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

// Global Application State & Storage
const AppState = {
  cart: JSON.parse(localStorage.getItem('inbiology_cart') || '[]'),
  enrolled: [],
  lang: localStorage.getItem('inbiology_lang') || 'TH',
  appliedCoupon: null,
  userRole: localStorage.getItem('inbiology_role') || null,

  isLoggedIn() {
    return Boolean(this.userRole && this.userRole !== 'guest');
  },
  
  getStudentProfile() {
    const saved = localStorage.getItem('inbiology_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return null;
  },

  saveStudentProfile(profile) {
    localStorage.setItem('inbiology_student_profile', JSON.stringify(profile));
  },

  getCourseProgress(courseId) {
    const saved = localStorage.getItem('inbiology_progress_' + courseId);
    let completed = [];
    if (saved) {
      try { completed = JSON.parse(saved); } catch(e){}
    }
    const course = typeof COURSES !== 'undefined' ? COURSES.find(c => c.id === courseId) : null;
    const total = course && course.lessons && course.lessons.length ? course.lessons.length : 1;
    const count = completed.length;
    const percentage = Math.min(100, Math.round((count / total) * 100));
    return {
      completedLessonIds: completed,
      completedCount: count,
      totalCount: total,
      percentage: percentage
    };
  },

  toggleLessonProgress(courseId, lessonId) {
    const saved = localStorage.getItem('inbiology_progress_' + courseId);
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
    localStorage.setItem('inbiology_progress_' + courseId, JSON.stringify(completed));
    return this.getCourseProgress(courseId);
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
    if (this.enrolled.includes(course.id)) {
      showToast('คุณได้ลงทะเบียนในห้องเรียนของคอร์สนี้แล้ว', 'info');
      return;
    }
    if (this.cart.find(c => c.id === course.id)) {
      showToast('คอร์สนี้ถูกเพิ่มลงในตะกร้าชำระเงินเรียบร้อยแล้ว', 'info');
      return;
    }
    this.cart.push(course);
    this.saveCart();
    showToast(`🛒 เพิ่ม "${course.title}" ลงตะกร้าแล้ว`, 'success');
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
    localStorage.removeItem('inbiology_role');
    localStorage.removeItem('inbiology_student_profile');
    localStorage.removeItem('inbiology_enrolled');
    showToast('👋 ออกจากระบบเรียบร้อยแล้ว', 'info');
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
    AppState.enrolled = JSON.parse(localStorage.getItem('inbiology_enrolled') || '[]');
  } catch(e) {
    AppState.enrolled = [];
  }
} else {
  // Guests & unauthenticated visitors strictly have 0 enrolled courses
  AppState.enrolled = [];
  localStorage.removeItem('inbiology_enrolled');
}

// Coupon Discount Validator Engine
function applyCouponCode(codeStr) {
  if (!codeStr || !codeStr.trim()) {
    showToast('กรุณากรอกโค้ดส่วนลด', 'error');
    return null;
  }
  const found = COUPONS.find(c => c.code.toUpperCase() === codeStr.trim().toUpperCase());
  if (!found) {
    showToast('❌ โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว', 'error');
    return null;
  }
  AppState.appliedCoupon = found;
  showToast(`🎉 ใช้โค้ด "${found.code}" สำเร็จ!`, 'success');
  return found;
}

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
          🛒 ตะกร้าชำระเงิน
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
      <div style="width:64px;height:64px;background:#FEF2F2;color:#DC2626;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px;box-shadow:0 6px 16px rgba(220,38,38,0.15)">
        🔒
      </div>
      <h3 style="font-size:20px;font-weight:950;color:var(--c-navy);margin:0 0 8px">ต้องเข้าสู่ระบบก่อน</h3>
      <p style="font-size:13.5px;color:#6B7280;line-height:1.5;margin:0 0 24px">${message}</p>
      
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="${loginUrl}" style="background:#1E3A8A;color:white;font-weight:900;font-size:14px;padding:12px;border-radius:12px;text-decoration:none;display:block;box-shadow:0 4px 14px rgba(30,58,138,0.25)">
          🔑 เข้าสู่ระบบ / สมัครสมาชิก ➔
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
          <span style="font-size:26px">📝</span>
          <div>
            <h3 style="font-size:16.5px;font-weight:900;color:var(--c-navy);margin:0">กรอกข้อมูลนักเรียนให้ครบถ้วน</h3>
            <p style="font-size:11.5px;color:#64748B;margin:2px 0 0">จำเป็นสำหรับการลงทะเบียนเรียนและตรวจสลิป</p>
          </div>
        </div>
        <button onclick="document.getElementById('complete-profile-modal').classList.remove('show')" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94A3B8;padding:4px">✕</button>
      </div>

      <!-- Info Banner -->
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;margin-bottom:16px">
        <span style="font-size:20px;flex-shrink:0">💡</span>
        <div style="font-size:12px;color:#92400E;line-height:1.5">
          คุณเข้าสู่ระบบด้วย Google เรียบร้อยแล้ว กรุณาระบุ <strong>เบอร์โทรศัพท์</strong> และ <strong>โรงเรียน</strong> ให้ครบถ้วนก่อนเลือกซื้อคอร์สเรียนครับ
        </div>
      </div>

      <!-- Form -->
      <form id="complete-profile-form" onsubmit="handleCompleteProfileSubmit(event)" style="display:flex;flex-direction:column;gap:12px;text-align:left">
        
        <!-- Full Name -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            👤 ชื่อจริง - นามสกุล <span style="color:#EF4444">*</span>
          </label>
          <input type="text" id="cprofile-fullname" required value="${initialName}" placeholder="เช่น นาย วิทศรุต สายตา"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Nickname & Level -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
              😊 ชื่อเล่น <span style="color:#EF4444">*</span>
            </label>
            <input type="text" id="cprofile-nickname" required value="${initialNick}" placeholder="เช่น ต้น"
              style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
              🎓 ระดับชั้น <span style="color:#EF4444">*</span>
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
            📱 เบอร์โทรศัพท์มือถือ (10 หลัก) <span style="color:#EF4444">*</span>
          </label>
          <input type="tel" id="cprofile-phone" required maxlength="10" value="${initialPhone}" placeholder="เช่น 0812345678"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
          <span style="font-size:11px;color:#64748B;display:block;margin-top:2px">ใช้สำหรับยืนยันการเรียนและการแจ้งเตือนผลตรวจสลิป</span>
        </div>

        <!-- School -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            🏫 โรงเรียน / สถาบันการศึกษา <span style="color:#EF4444">*</span>
          </label>
          <input type="text" id="cprofile-school" required value="${initialSchool}" placeholder="เช่น สวนกุหลาบวิทยาลัย, เตรียมอุดมศึกษา"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Birthdate -->
        <div>
          <label style="display:block;font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">
            🎂 วันเกิด
          </label>
          <input type="date" id="cprofile-birthdate" value="${initialBirth}"
            style="width:100%;border:1px solid #CBD5E1;border-radius:10px;padding:10px 12px;font-size:13px;outline:none;box-sizing:border-box" />
        </div>

        <!-- Submit Button -->
        <button type="submit" id="btn-save-cprofile"
          style="margin-top:8px;background:var(--c-navy);color:white;font-weight:850;font-size:14px;padding:13px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(30,58,138,0.25)">
          ✓ บันทึกข้อมูลและเลือกคอร์สต่อ ➔
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

    showToast('🎉 บันทึกข้อมูลนักเรียนเรียบร้อยแล้ว!', 'success');

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
    if (btn) { btn.disabled = false; btn.textContent = '✓ บันทึกข้อมูลและเลือกคอร์สต่อ ➔'; }
  }
}

// Video Trial Modal Popup Player
function openTrialModal(trialItem) {
  let modal = document.getElementById('trial-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'trial-video-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="font-weight:800;color:var(--c-navy);font-size:14px;margin:0">▶ วิดีโอตัวอย่างทดลองเรียนฟรี</h3>
        <button onclick="document.getElementById('trial-video-modal').classList.remove('show')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:black;border-radius:16px;aspect-ratio:16/9;overflow:hidden;margin-bottom:16px">
          <video src="${trialItem.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}" controls autoplay style="width:100%;height:100%;object-fit:contain"></video>
        </div>
        <h4 style="font-size:16px;font-weight:900;color:var(--c-navy);margin:0 0 4px">${trialItem.title}</h4>
        <p style="font-size:12px;color:var(--c-sky);font-weight:700;margin:0">${trialItem.course} • ความยาว ${trialItem.duration}</p>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Review Detail Modal Helper
function openReviewModal(studentName) {
  const r = REVIEWS.find(x => x.name === studentName);
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
    <div class="modal-backdrop"></div>
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
            <p style="color:#1E3A8A;font-weight:800;font-size:13px;margin:4px 0">${r.school}</p>
            <span style="background:#FEE2E2;color:#B91C1C;font-size:11px;font-weight:850;padding:4px 12px;border-radius:20px;border:1px solid rgba(185,28,28,0.1);display:inline-block;margin-top:6px">${r.score}</span>
          </div>
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:20px;width:100%;text-align:left">
            <p style="color:#374151;font-size:13.5px;line-height:1.7;margin:0;white-space:pre-line">"${r.text}"</p>
          </div>
          <div style="align-self:flex-start;font-size:12px;color:#6B7280;font-weight:700">
            <span>📚 คอร์สเรียน: </span><span style="color:#1E3A8A">${r.course}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

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

  const isEnrolled = AppState.enrolled.includes(course.id);

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box wide animate-fade-in-up" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="font-weight:800;color:var(--c-navy);font-size:14px;margin:0">หน้ารายละเอียดหลักสูตรคอร์สเรียนชีวะ</h3>
        <button onclick="document.getElementById('global-course-modal').classList.remove('show')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;flex-direction:column;gap:20px">
          <div style="display:grid;grid-template-columns:1.2fr 0.8fr;gap:24px;align-items:start">
            <div>
              <div style="height:220px;background:#0F172A;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;padding:20px;margin-bottom:16px">
                <img src="${course.imageUrl}" style="max-height:100%;max-width:100%;object-fit:contain;border-radius:8px;opacity:0.9" alt="" />
              </div>
              <h2 style="font-size:20px;font-weight:900;color:var(--c-navy);margin:0 0 8px">${course.title}</h2>
              <p style="font-size:13px;color:#4B5563;line-height:1.6">${course.description}</p>
            </div>
            <div style="background:white;border:1px solid #E5E7EB;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:16px">
              <div style="font-size:32px;font-weight:950;color:var(--c-navy)">฿${formatPrice(course.price)}</div>
              <button onclick="AppState.addToCart(COURSES.find(c=>c.id==='${course.id}'));document.getElementById('global-course-modal').classList.remove('show')" ${isEnrolled ? 'disabled' : ''} style="width:100%;background:${isEnrolled ? '#D1FAE5' : 'var(--c-sky)'};color:${isEnrolled ? '#065F46' : 'white'};font-weight:800;font-size:14px;padding:14px;border-radius:12px;cursor:pointer;border:none">
                ${isEnrolled ? '✓ คุณเป็นเจ้าของคอร์สนี้แล้ว' : '🛒 ซื้อคอร์สเรียนนี้เลย'}
              </button>
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
  const studentDisplayName = studentProfile ? `🎓 น้อง${studentProfile.nickname || 'นักเรียน'}` : '🎓 นักเรียน';

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
        <a href="exam.html" class="nav-link ${activePage === 'exam' ? 'active' : ''}">คลังข้อสอบ</a>
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
          <span style="font-size:18px;line-height:1">🛒</span>
          <span class="cart-badge" style="display:${AppState.cart.length > 0 ? 'flex' : 'none'}">${AppState.cart.length}</span>
        </button>

        ${!isLoggedIn
          ? `<a href="login.html" class="btn-login">เข้าสู่ระบบ</a>`
          : `<div class="header-user-actions" style="display:flex;align-items:center;gap:6px">
              <a href="dashboard.html" class="header-user-badge">
                ${isAdmin ? '🛡️ แอดมิน' : studentDisplayName}
              </a>
              <button onclick="AppState.logout()" class="header-logout-btn" title="ออกจากระบบ" style="padding:6px 12px;background:#FEE2E2;color:#DC2626;border-radius:10px;font-size:11px;font-weight:800;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;white-space:nowrap">
                🚪 ออกจากระบบ
              </button>
            </div>`
        }

        <button onclick="document.getElementById('nav-dropdown').classList.toggle('show')" class="hamburger-btn" aria-label="เปิดเมนูบนมือถือ">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <div id="nav-dropdown" class="dropdown-panel">
          <a href="index.html" class="dropdown-item">👉 หน้าแรก</a>
          <a href="courses.html" class="dropdown-item">📚 คอร์สเรียนทั้งหมด</a>
          <a href="exam.html" class="dropdown-item">🏆 คลังข้อสอบ A-Level</a>
          <a href="about.html" class="dropdown-item">🔬 เกี่ยวกับเรา (พี่ต้น)</a>
          <a href="faq.html" class="dropdown-item">❓ คำถามพบบ่อย (FAQ)</a>
          <a href="guide.html" class="dropdown-item">📖 คู่มือการใช้งาน</a>
          ${isLoggedIn ? `
            <a href="classroom.html" class="dropdown-item">🎓 คอร์สเรียนของฉัน</a>
            <a href="dashboard.html" class="dropdown-item">👤 แดชบอร์ดของฉัน</a>
            <a href="dashboard.html?tab=orders" class="dropdown-item">🧾 ประวัติการสั่งซื้อ</a>
          ` : ''}
          ${isAdmin ? `<a href="admin.html" class="dropdown-item">🛡 แดชบอร์ดแอดมิน</a>` : ''}
          ${isLoggedIn 
            ? `<button onclick="AppState.logout()" class="dropdown-item" style="color:#DC2626;font-weight:800">🚪 ออกจากระบบ</button>`
            : `<a href="login.html" class="dropdown-item" style="color:var(--c-sky);font-weight:800">🔑 เข้าสู่ระบบ</a>`
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

// Universal Rich Multi-Column Footer (Audit 2.1, 2.2)
function renderFooter() {
  let footer = document.querySelector('.site-footer') || document.getElementById('footer-container');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer';
    document.body.appendChild(footer);
  } else {
    footer.className = 'site-footer';
  }

  const isLoggedIn = AppState.isLoggedIn();
  const profileLink = isLoggedIn ? 'dashboard.html' : 'login.html?redirect=dashboard.html';

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top-grid">
        <!-- Col 1: Brand & Bio -->
        <div class="footer-col">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <img src="./logo.png" alt="INBIOLOGY Logo" style="height:42px;width:auto;object-fit:contain" />
            <div>
              <span style="font-weight:800;font-size:18px;color:#F8FAFC;display:block;line-height:1">INBIOLOGY</span>
              <span style="font-size:11px;font-weight:600;color:#93C5FD;display:block;margin-top:2px">สถาบันกวดวิชาชีววิทยาออนไลน์</span>
            </div>
          </div>
          <p>
            ติวเข้มชีววิทยา ม.ปลาย กับ <strong>พี่ต้น</strong> (เกียรตินิยมอันดับ 1 มหาวิทยาลัยนเรศวร & มหาวิทยาลัยขอนแก่น) ประสบการณ์สอนกว่า 9 ปี เน้นความเข้าใจ ไม่ใช่แค่ท่องจำ ดูแลนักเรียนกว่า 50,000+ คน สู่คณะในฝัน
          </p>
          <div class="footer-social-row">
            <a href="https://line.me" target="_blank" rel="noopener" class="footer-social-btn" title="LINE Official @inbiology" aria-label="LINE Official">
              <img src="./social_line.png" alt="LINE" style="width:20px;height:20px;object-fit:contain" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener" class="footer-social-btn" title="TikTok @inbiology" aria-label="TikTok">
              <img src="./social_tiktok.png" alt="TikTok" style="width:20px;height:20px;object-fit:contain" />
            </a>
            <a href="about.html" class="footer-social-btn" title="Facebook / สตูดิโอ" aria-label="Facebook">
              <span style="font-size:16px">📘</span>
            </a>
            <a href="about.html" class="footer-social-btn" title="Instagram" aria-label="Instagram">
              <span style="font-size:16px">📸</span>
            </a>
          </div>
        </div>

        <!-- Col 2: Courses -->
        <div class="footer-col">
          <h4>หลักสูตรยอดนิยม</h4>
          <ul class="footer-links">
            <li><a href="courses.html?search=Bio+Intensive">🧬 Bio Intensive I - VI</a></li>
            <li><a href="courses.html?search=Complete">📦 Bio Intensive Complete</a></li>
            <li><a href="courses.html?search=A-Level">🎯 ตะลุยโจทย์ A-Level</a></li>
            <li><a href="courses.html?search=สอวน">🏅 สอวน. ชีววิทยา ค่าย 1</a></li>
            <li><a href="courses.html?search=99">⚡ คอร์ส 99.- Quick Review</a></li>
            <li><a href="exam.html">🏆 คลังข้อสอบจับเวลาฟรี</a></li>
          </ul>
        </div>

        <!-- Col 3: Quick Links & Support -->
        <div class="footer-col">
          <h4>ข้อมูล & ช่วยเหลือ</h4>
          <ul class="footer-links">
            <li><a href="about.html">🔬 เกี่ยวกับพี่ต้น & สถาบัน</a></li>
            <li><a href="faq.html">❓ คำถามที่พบบ่อย (FAQ)</a></li>
            <li><a href="guide.html">📖 คู่มือการเรียน & ใช้งาน</a></li>
            <li><a href="${profileLink}">👤 โปรไฟล์และประวัติการเรียน</a></li>
            <li><a href="privacy.html">🔒 นโยบายความเป็นส่วนตัว</a></li>
            <li><a href="terms.html">📜 ข้อตกลงและเงื่อนไข</a></li>
          </ul>
        </div>

        <!-- Col 4: Contact & Verification -->
        <div class="footer-col">
          <h4>ติดต่อ & บริการนักเรียน</h4>
          <div class="footer-contact-item">
            <span>💬</span>
            <div>
              <strong style="color:#F1F5F9">LINE Official:</strong>
              <div>@inbiology (ตอบกลับทุกวัน 09:00 - 21:00 น.)</div>
            </div>
          </div>
          <div class="footer-contact-item">
            <span>📧</span>
            <div>
              <strong style="color:#F1F5F9">อีเมลติดต่อ:</strong>
              <div>contact.inbiology@gmail.com</div>
            </div>
          </div>
          <div class="footer-contact-item">
            <span>📱</span>
            <div>
              <strong style="color:#F1F5F9">ฝ่ายบริการนักเรียน:</strong>
              <div>ติดต่อด่วนผ่าน LINE @inbiology</div>
            </div>
          </div>
          <div style="margin-top:14px;background:#1E293B;padding:12px 14px;border-radius:12px;border:1px solid #334155;font-size:12px;line-height:1.5;color:#CBD5E1">
            🛡️ <strong>ความปลอดภัยการชำระเงิน:</strong><br>
            ชำระผ่าน PromptPay บัญชีทางการสถาบัน ตรวจสอบสลิปและรับใบเสร็จผ่าน LINE Official
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          © 2026 <strong>INBIOLOGY Academy by พี่ต้น</strong>. สงวนลิขสิทธิ์ทุกประการ.
        </div>
        <div class="footer-legal-links">
          <a href="privacy.html">นโยบายความเป็นส่วนตัว (PDPA)</a>
          <span>•</span>
          <a href="terms.html">ข้อกำหนดการใช้งาน</a>
          <span>•</span>
          <a href="terms.html#refund">นโยบายการคืนเงินและเปลี่ยนคอร์ส</a>
          <span>•</span>
          <a href="terms.html#lifetime">เงื่อนไขสิทธิ์ตลอดชีพ</a>
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

  const enrolledCourses = COURSES.filter(c => AppState.enrolled.includes(c.id));

  if (enrolledCourses.length === 0) {
    menu.innerHTML = `
      <div style="padding:12px;text-align:center">
        <p style="font-size:11px;color:#6B7280;margin:0 0 8px">ยังไม่มีคอร์สเรียนที่ลงทะเบียน</p>
        <a href="courses.html" style="background:var(--c-navy);color:white;font-weight:800;font-size:11px;padding:6px 12px;border-radius:8px;text-decoration:none;display:inline-block">🛒 เลือกซื้อคอร์สเรียน</a>
      </div>
    `;
  } else {
    menu.innerHTML = `
      <div style="padding:4px 6px;border-bottom:1px solid #F3F4F6;margin-bottom:4px">
        <span style="font-size:10px;font-weight:900;color:#9CA3AF">🎓 คอร์สของคุณที่พร้อมเรียน (${enrolledCourses.length})</span>
      </div>
      ${enrolledCourses.map(c => `
        <a href="classroom.html" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;text-decoration:none;transition:background 0.2s" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='transparent'">
          <img src="${c.imageUrl}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;background:#F1F5F9;padding:2px" alt="" />
          <div style="overflow:hidden">
            <h5 style="font-size:12px;font-weight:850;color:var(--c-navy);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</h5>
            <span style="font-size:10px;color:var(--c-sky);font-weight:700">▶ เข้าเรียนบทเรียนนี้</span>
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

// Scroll Reveal Observer Engine (supports prefers-reduced-motion)
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => {
      const delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = delay;
      }
      observer.observe(el);
    });
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

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
          <span style="font-weight:700">❓ ${f.q}</span>
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
});

