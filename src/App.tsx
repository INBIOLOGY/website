'use client';

import { useState, useEffect } from 'react';
import { useLegacyNavigation } from '@/features/navigation/use-legacy-navigation';
import { getCurrentUser, logoutSession } from '@/features/auth/client';
import { createPendingOrder } from '@/features/checkout/client';
import { listPublishedCourses } from '@/features/catalog/client';
import { PUBLIC_PAGES } from '@/features/navigation/routes';
import { Play } from 'lucide-react';
import { C, COURSES, DEFAULT_SLIDES } from '@/src/app-data'
import { ToastContainer } from '@/src/ui/feedback/ToastContainer'
import { Modal } from '@/src/ui/feedback/Modal'
import { Navbar } from '@/features/navigation/components/Navbar'
import { CourseDetailView } from '@/features/catalog/components/CourseDetailView'
import { CatalogPage } from '@/features/catalog/components/CatalogPage'
import { CheckoutPage } from '@/features/checkout/components/CheckoutPage'
import { CartDrawer } from '@/features/checkout/components/CartDrawer'
import { ClassroomPage } from '@/features/learning/components/ClassroomPage'
import { ExamCenterPage } from '@/features/learning/components/ExamCenterPage'
import { StudentDashboard } from '@/features/learning/components/StudentDashboard'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { AdminDashboard } from '@/features/admin/components/AdminDashboard'
import { LandingPage } from '@/features/marketing/components/LandingPage'
import { GuidePage } from '@/features/content/components/GuidePage'
import { SettingsPage } from '@/features/settings/components/SettingsPage'
import type { AddToast, Course, Coupon, Language, Order, Slide, StudyNote, Toast, Trial, UserRole, ToastType } from '@/src/app-types'

// ─────────────────────────────────────────────────────────────────────────────
// BRAND COLORS
// ─────────────────────────────────────────────────────────────────────────────
// TOASTS
// ─────────────────────────────────────────────────────────────────────────────
let _tid = 0;

// ─────────────────────────────────────────────────────────────────────────────
// EXAM CENTER & TIMER SIMULATOR
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const { page, setPage } = useLegacyNavigation();
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [authReady, setAuthReady] = useState(false);
  const [enrolledCourses] = useState<string[]>(['bio-intensive-1']);
  const [activeCourseId, setActiveCourseId] = useState('bio-intensive-1');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cart, setCart] = useState<Course[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('TH');

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(user => {
        if (!cancelled && user) setUserRole(user.role);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (page === 'admin' && userRole !== 'admin') {
      setPage('login');
      return;
    }
    if (!PUBLIC_PAGES.has(page) && userRole === 'guest') setPage('login');
  }, [authReady, page, setPage, userRole]);

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch {
      addToast('ออกจากระบบเฉพาะอุปกรณ์นี้แล้ว', 'info');
    } finally {
      setUserRole('guest');
      setPage('landing');
    }
  };

  // Apply dark mode CSS class on body
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [trialModal, setTrialModal] = useState<Trial | null>(null);

  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'INBIOLOGY100', discount: 100, type: 'flat' },
    { code: 'FREEBIO', discount: 100, type: 'percent' }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-101', studentName: 'นาย ภูมิพัฒน์ รัตนชัย', courseTitle: 'Bio Intensive I: Introbiology & Biochemistry & Cell biology', price: 1290, date: '18/07/2026', status: 'approved', paymentMethod: 'PromptPay' },
    { id: 'ORD-102', studentName: 'นางสาว ณัฐนิชา สุขใจ', courseTitle: 'คอร์ส ตะลุยโจทย์ สอวน . ละเอียด 100 ข้อ', price: 390, date: '18/07/2026', status: 'pending', paymentMethod: 'PromptPay' }
  ]);

  const [notes, setNotes] = useState<StudyNote[]>([
    { id: 1, courseId: 'bio-intensive-1', courseTitle: '🧬 Bio Intensive I: Introbiology & Biochemistry & Cell biology', time: 'โครงสร้างและหน้าที่ของออร์แกเนลล์', text: 'ออร์แกเนลล์เดี่ยวที่มีเยื่อหุ้ม 1 ชั้น เช่น Lysosome ทำหน้าที่ย่อยสารและสิ่งแปลกปลอมในเซลล์, Vacuole เก็บสะสมน้ำและของเสีย' }
  ]);

  const [courses, setCourses] = useState<Course[]>(COURSES as Course[]);
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES as Slide[]);
  const [catalogHydrated, setCatalogHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const storedCourses = localStorage.getItem('inbiology_courses_v9');
      const storedSlides = localStorage.getItem('inbiology_slides_v9');
      if (storedCourses) setCourses(JSON.parse(storedCourses) as Course[]);
      if (storedSlides) setSlides(JSON.parse(storedSlides) as Slide[]);
    } catch {
      // Ignore malformed prototype data and keep the server-rendered defaults.
    }
    listPublishedCourses()
      .then((publishedCourses) => {
        if (cancelled || publishedCourses.length === 0) return;
        setCourses(publishedCourses.map((course) => ({
          id: course.slug,
          slug: course.slug,
          title: course.title,
          description: course.description || '',
          price: course.price,
          originalPrice: course.originalPrice || course.price,
          Level: course.level || 'ทุกระดับ',
          imageUrl: course.imageUrl?.startsWith('/') ? course.imageUrl : '/course-biology.jpg',
          lessons: [],
          rating: 5,
          reviewCount: 0,
          status: course.status,
        })));
      })
      .catch(() => {
        // Keep local prototype data when the API/database is unavailable.
      })
      .finally(() => {
        if (!cancelled) setCatalogHydrated(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (catalogHydrated) localStorage.setItem('inbiology_courses_v9', JSON.stringify(courses));
  }, [courses, catalogHydrated]);

  useEffect(() => {
    if (catalogHydrated) localStorage.setItem('inbiology_slides_v9', JSON.stringify(slides));
  }, [slides, catalogHydrated]);

  const addToast: AddToast = (msg, type: ToastType = 'info') => { const id = ++_tid; setToasts(p => [...p, { id, message: msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000); };

  const addToCart = (course: Course) => {
    if (enrolledCourses.includes(course.id)) { addToast('คุณได้ลงทะเบียนในห้องเรียนของคอร์สนี้แล้ว', 'info'); return; }
    if (cart.find(c => c.id === course.id)) { addToast('คอร์สนี้ถูกเพิ่มลงในตะกร้าชำระเงินเรียบร้อยแล้ว', 'info'); return; }
    setCart(p => [...p, course]);
    addToast(`🛒 เพิ่ม "${course.title}" ลงตะกร้าแล้ว`, 'success');
  };

  const checkout = async ({ couponCode, paymentMethod }: { couponCode?: string; paymentMethod: string }) => {
    try {
      const order = await createPendingOrder({
        courseSlugs: cart.map(course => course.id),
        couponCode: couponCode || undefined,
        paymentMethod: paymentMethod as 'promptpay' | 'credit' | 'truemoney' | 'bank',
      });
      addToast(`สร้างคำสั่งซื้อ ${order.orderId} แล้ว กรุณาดำเนินการชำระเงิน`, 'success');
      if (order.paymentUrl) window.location.assign(order.paymentUrl);
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'ไม่สามารถสร้างคำสั่งซื้อได้', 'error');
    }
  };
  return (
    <div id="app-root" style={{ fontFamily: "'Outfit','Prompt',sans-serif", WebkitFontSmoothing: 'antialiased', background: C.page, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed',
        top: '15%',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'rgba(185, 28, 28, 0.04)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'rgba(30, 58, 138, 0.05)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'float 12s ease-in-out infinite'
      }} />
      {page !== 'login' && (
        <Navbar setPage={setPage} userRole={userRole}
          onLogout={handleLogout}
          cartCount={cart.length} openCart={() => setCartOpen(true)}
          addToast={addToast}
          darkMode={darkMode} setDarkMode={setDarkMode}
          lang={lang} setLang={setLang}
        />
      )}
      {page === 'landing' && <LandingPage courses={courses} slides={slides} addToast={addToast} setPage={setPage} enrolledIds={enrolledCourses} onAddToCart={addToCart} onViewDetails={setSelectedCourseDetails} onTrial={setTrialModal} />}
      {page === 'courses' && <CatalogPage courses={courses} onAddToCart={addToCart} enrolledIds={enrolledCourses} onViewDetails={setSelectedCourseDetails} onTrial={setTrialModal} />}
      {page === 'login' && <LoginPage onLogin={setUserRole} setPage={setPage} addToast={addToast} />}
      {page === 'dashboard' && <StudentDashboard courses={courses} enrolledCourses={enrolledCourses} setPage={setPage} addToast={addToast} setActiveCourseId={setActiveCourseId} notes={notes} />}
      {page === 'classroom' && <ClassroomPage courses={courses} enrolledCourses={enrolledCourses} activeCourseId={activeCourseId} addToast={addToast} setPage={setPage} notes={notes} setNotes={setNotes} />}
      {page === 'quiz' && <ExamCenterPage addToast={addToast} setPage={setPage} />}
      {page === 'checkout' && <CheckoutPage cart={cart} coupons={coupons} onCheckout={checkout} addToast={addToast} />}
      {page === 'admin' && <AdminDashboard courses={courses} setCourses={setCourses} slides={slides} setSlides={setSlides} coupons={coupons} setCoupons={setCoupons} orders={orders} setOrders={setOrders} addToast={addToast} />}

      {/* Fallback mockup pages to align other options in the navbar */}
      {['exams', 'blog', 'support'].includes(page) && (
        <div style={{ paddingTop: '120px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: C.navy, fontWeight: 900 }}>ห้องบริการความรู้ชีววิทยาจำลอง</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: C.fontBody }}>
            ส่วนระบบนี้อยู่ระหว่างอัปเกรดเนื้อหาเพิ่มเติมเพื่อรอบรับการสอบ A-Level / สอวน. ในเทอมหน้า <br />
            คุณสามารถทดสอบบทเรียนจำลองและควิซประเมินผลได้จากหน้า **คอร์สเรียน** และ **Dashboard นักเรียน**
          </p>
          <button onClick={() => setPage('landing')} style={{ background: C.sky, color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', marginTop: '12px', cursor: 'pointer' }}>
            กลับหน้าหลัก
          </button>
        </div>
      )}

      {/* Guide Page */}
      {page === 'guide' && <GuidePage setPage={setPage} />}

      {/* Settings Page */}
      {page === 'settings' && <SettingsPage setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} addToast={addToast} userRole={userRole} />}

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={id => setCart(p => p.filter(x => x.id !== id))} setPage={setPage} />}

      <ToastContainer toasts={toasts} remove={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Global Trial modal */}
      <Modal isOpen={!!trialModal} onClose={() => setTrialModal(null)} title={`ตัวอย่างบทเรียนทดลองเรียน — ${trialModal?.title}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ aspectRatio: '16/9', background: 'black', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {trialModal?.imageUrl && <img src={trialModal.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />}
            <button style={{ position: 'relative', zIndex: 1, width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
              <Play size={24} fill={C.sky} color={C.sky} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: C.fontBody }}>ชมคลิปวิดีโอจำลองการเรียนจริงฟรี โดย INBIOLOGY Academy</p>
        </div>
      </Modal>

      {/* Global Course Detail Modal */}
      <Modal isOpen={!!selectedCourseDetails} onClose={() => setSelectedCourseDetails(null)} title="หน้ารายละเอียดหลักสูตรคอร์สเรียนชีวะ" wide>
        <CourseDetailView course={selectedCourseDetails} onAddToCart={addToCart} enrolled={enrolledCourses.includes(selectedCourseDetails?.id)} onClose={() => setSelectedCourseDetails(null)} onStartTrial={setTrialModal} />
      </Modal>
    </div>
  );
}
