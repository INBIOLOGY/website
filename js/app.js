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
  enrolled: JSON.parse(localStorage.getItem('inbiology_enrolled') || '["bio-intensive-1"]'),
  userRole: localStorage.getItem('inbiology_role') || null,
  darkMode: localStorage.getItem('inbiology_darkmode') === 'true',
  lang: localStorage.getItem('inbiology_lang') || 'TH',
  appliedCoupon: null,
  
  getStudentProfile() {
    const saved = localStorage.getItem('inbiology_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return {
      nickname: 'วิทศรุต',
      fullName: 'นาย วิทศรุต สายตา',
      school: 'โรงเรียนสตรีวิทยา',
      level: 'ม.5',
      email: 'witsarut@inbiology.com',
      password: '••••••••'
    };
  },

  saveStudentProfile(profile) {
    localStorage.setItem('inbiology_student_profile', JSON.stringify(profile));
  },
  
  saveCart() {
    localStorage.setItem('inbiology_cart', JSON.stringify(this.cart));
    this.updateCartBadges();
  },
  
  addToCart(course) {
    if (!this.userRole || this.userRole === 'guest') {
      showLoginModal('กรุณาเข้าสู่ระบบก่อนเลือกซื้อคอร์สเรียนลงในตะกร้าสินค้า');
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
    this.userRole = null;
    localStorage.removeItem('inbiology_role');
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

// Dark Mode Handler
function applyDarkMode(enable) {
  AppState.darkMode = enable;
  localStorage.setItem('inbiology_darkmode', enable);
  if (enable) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
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
function showLoginModal(message = 'กรุณาเข้าสู่ระบบก่อนเลือกซื้อคอร์สเรียนหรือเข้าดูบทเรียนของคุณ') {
  let modal = document.getElementById('login-required-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'login-required-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.remove('show');
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box animate-fade-in-up" onclick="event.stopPropagation()" style="max-width:440px;width:90%;text-align:center;padding:32px 24px;border-radius:24px;background:white;margin:auto">
      <div style="width:64px;height:64px;background:#FEF2F2;color:#DC2626;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px;box-shadow:0 6px 16px rgba(220,38,38,0.15)">
        🔒
      </div>
      <h3 style="font-size:20px;font-weight:950;color:var(--c-navy);margin:0 0 8px">ต้องเข้าสู่ระบบก่อน</h3>
      <p style="font-size:13.5px;color:#6B7280;line-height:1.5;margin:0 0 24px">${message}</p>
      
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="login.html" style="background:#1E3A8A;color:white;font-weight:900;font-size:14px;padding:12px;border-radius:12px;text-decoration:none;display:block;box-shadow:0 4px 14px rgba(30,58,138,0.25)">
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
  const studentDisplayName = `🎓 น้อง${studentProfile.nickname || 'วิทศรุต'}`;

  header.innerHTML = `
    <div class="header-container">
      <a href="index.html" class="logo-btn">
        <img src="./logo.png" alt="INBIOLOGY Logo" class="logo-img" style="height:46px;width:auto;object-fit:contain" />
        <div style="text-align:left">
          <span style="font-weight:900;font-size:20px;color:var(--c-navy);display:block;line-height:1">INBIOLOGY</span>
          <span style="font-size:10px;font-weight:700;color:var(--c-sky);display:block;margin-top:2px">by พี่ต้น</span>
        </div>
      </a>

      <nav class="desktop-nav">
        <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">หน้าแรก</a>
        <a href="courses.html" class="nav-link ${activePage === 'courses' ? 'active' : ''}">คอร์สเรียน</a>
        <a href="classroom.html" class="nav-link ${activePage === 'classroom' ? 'active' : ''}">คอร์สเรียนของฉัน</a>
        <a href="exam.html" class="nav-link ${activePage === 'exam' ? 'active' : ''}">คลังข้อสอบ</a>
        <a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
        ${isAdmin ? `<a href="admin.html" class="nav-link ${activePage === 'admin' ? 'active' : ''}">แอดมิน</a>` : ''}
      </nav>

      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="openCartDrawer()" class="cart-icon-btn" title="ตะกร้าสินค้า">
          <span style="font-size:20px">🛒</span>
          <span class="cart-badge" style="display:${AppState.cart.length > 0 ? 'flex' : 'none'}">${AppState.cart.length}</span>
        </button>

        ${!isLoggedIn
          ? `<a href="login.html" class="btn-login">เข้าสู่ระบบ</a>`
          : `<div style="display:flex;align-items:center;gap:8px">
              <a href="dashboard.html" style="font-weight:800;font-size:12px;color:var(--c-navy);background:#FEF2F2;padding:6px 12px;border-radius:10px;border:1px solid rgba(185,28,28,0.15)">
                ${isAdmin ? '🛡️ แอดมินผู้ดูแล' : studentDisplayName}
              </a>
              <button onclick="AppState.logout()" title="ออกจากระบบ" style="padding:6px 12px;background:#FEE2E2;color:#DC2626;border-radius:10px;font-size:11px;font-weight:800;border:none;cursor:pointer;display:flex;align-items:center;gap:4px">
                🚪 ออกจากระบบ
              </button>
            </div>`
        }

        <button onclick="document.getElementById('nav-dropdown').classList.toggle('show')" class="hamburger-btn">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <div id="nav-dropdown" class="dropdown-panel">
          <a href="index.html" class="dropdown-item">👉 หน้าแรก</a>
          <a href="courses.html" class="dropdown-item">📚 คอร์สเรียนทั้งหมด</a>
          <a href="classroom.html" class="dropdown-item">🎓 คอร์สเรียนของฉัน</a>
          <a href="exam.html" class="dropdown-item">🏆 คลังข้อสอบ A-Level</a>
          <a href="guide.html" class="dropdown-item">📖 คู่มือการใช้งาน</a>
          ${isAdmin ? `<a href="admin.html" class="dropdown-item">🛡 แดชบอร์ดแอดมิน</a>` : ''}
          <button onclick="applyDarkMode(!AppState.darkMode)" class="dropdown-item">
            ${AppState.darkMode ? '☀️ โหมดสว่าง' : '🌙 โหมดมืด'}
          </button>
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
});

document.addEventListener('DOMContentLoaded', () => {
  applyDarkMode(AppState.darkMode);
});
