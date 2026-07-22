'use client'

import { useState } from 'react'
import { BookOpen, Users, BarChart2, Video, Edit, Trash2, Image, Award, FileSpreadsheet } from 'lucide-react'
import { C, formatPrice } from '@/src/app-data'
import { Modal } from '@/src/ui/feedback/Modal'
import type { CSSProperties } from 'react'



// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function AdminDashboard({ courses, setCourses, slides, setSlides, coupons, setCoupons, orders, setOrders, addToast }) {
  const [tab, setTab] = useState('overview');
  const [courseModal, setCourseModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [courseForm, setCF] = useState({ title: '', price: '', originalPrice: '', imageUrl: '', tag: '', tagBg: '#EDE9FE', tagColor: '#5B21B6', badge: '', badgeBg: C.red, hours: '', validity: '', ebook: false, description: '', Level: 'ม.4' });

  const [slideModal, setSlideModal] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [slideForm, setSF] = useState({ title: '', desc: '', label: '', badgeText: '', bg1: '#EFF6FF', bg2: '#DBEAFE', imageUrl: '', actionText: '', actionType: 'bundle', targetCourseId: '' });

  const [selCourse, setSelCourse] = useState(courses[0]?.id || '');
  const [lessonForm, setLF] = useState({ title: '', duration: '', videoUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  // Coupon inputs
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'flat' });
  // Manual enrollment inputs
  const [manualStudent, setManualStudent] = useState({ name: '', courseId: courses[0]?.id || '' });

  const selC = courses.find(c => c.id === selCourse);

  const confirmDeleteCourse = (c) => {
    if (window.confirm(`คุณต้องการลบคอร์ส "${c.title}" ใช่หรือไม่?`)) {
      setCourses(p => p.filter(item => item.id !== c.id));
      addToast('🗑 ลบคอร์สเรียบร้อยแล้ว', 'info');
    }
  };

  const confirmDeleteSlide = (s) => {
    if (window.confirm(`คุณต้องการลบ Banner "${s.title}" ใช่หรือไม่?`)) {
      setSlides(p => p.filter(item => item.id !== s.id));
      addToast('🗑 ลบ Banner เรียบร้อยแล้ว', 'info');
    }
  };

  const confirmDeleteLesson = (l) => {
    if (window.confirm(`คุณต้องการลบบทเรียน "${l.title}" ใช่หรือไม่?`)) {
      setCourses(prev => prev.map(c => c.id === selCourse ? { ...c, lessons: c.lessons.filter(item => item.id !== l.id) } : c));
      addToast('🗑 ลบบทเรียนเรียบร้อยแล้ว', 'info');
    }
  };

  const tabs = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: <BarChart2 size={14} /> },
    { id: 'courses', label: 'จัดการคอร์สเรียน', icon: <BookOpen size={14} /> },
    { id: 'lessons', label: 'จัดการบทเรียน', icon: <Video size={14} /> },
    { id: 'orders', label: 'ออเดอร์ & การเงิน', icon: <FileSpreadsheet size={14} /> },
    { id: 'coupons', label: 'คูปอง & โปรโมชัน', icon: <Award size={14} /> },
    { id: 'banners', label: 'จัดการ Banner', icon: <Image size={14} /> },
    { id: 'students', label: 'นักเรียน', icon: <Users size={14} /> },
  ];

  const openAddCourse = () => { setCF({ title: '', price: '', originalPrice: '', imageUrl: '', tag: '', tagBg: '#EDE9FE', tagColor: '#5B21B6', badge: '', badgeBg: C.red, hours: '', validity: '', ebook: false, description: '', Level: 'ม.4' }); setEditCourse(null); setCourseModal(true); };
  const openEditCourse = (c) => { setCF({ title: c.title || '', price: String(c.price || ''), originalPrice: String(c.originalPrice || ''), imageUrl: c.imageUrl || '', tag: c.tag || '', tagBg: c.tagBg || '#EDE9FE', tagColor: c.tagColor || '#5B21B6', badge: c.badge || '', badgeBg: c.badgeBg || C.red, hours: String(c.hours || ''), validity: String(c.validity || ''), ebook: !!c.ebook, description: c.description || '', Level: c.Level || 'ม.4' }); setEditCourse(c); setCourseModal(true); };

  const saveCourse = () => {
    if (!courseForm.title || !courseForm.price) { addToast('กรุณากรอกชื่อและราคา', 'error'); return; }
    const d = { ...courseForm, price: +courseForm.price, originalPrice: +courseForm.originalPrice || +courseForm.price, hours: +courseForm.hours || 0, validity: +courseForm.validity || 180 };
    if (editCourse) { setCourses(p => p.map(c => c.id === editCourse.id ? { ...c, ...d } : c)); addToast('✅ อัปเดตคอร์สเรียบร้อย', 'success'); }
    else { setCourses(p => [...p, { id: 'c-' + Date.now(), ...d, lessons: [], rating: 5.0, reviewCount: 0 }]); addToast('✅ เพิ่มคอร์สใหม่เรียบร้อย', 'success'); }
    setCourseModal(false);
  };

  const openAddSlide = () => { setSF({ title: '', desc: '', label: '', badgeText: '', bg1: '#EFF6FF', bg2: '#DBEAFE', imageUrl: '', actionText: '', actionType: 'bundle', targetCourseId: courses[0]?.id || '' }); setEditSlide(null); setSlideModal(true); };
  const openEditSlide = (s) => { setSF({ title: s.title || '', desc: s.desc || '', label: s.label || '', badgeText: s.badgeText || '', bg1: s.bg1 || '#EFF6FF', bg2: s.bg2 || '#DBEAFE', imageUrl: s.imageUrl || '', actionText: s.actionText || '', actionType: s.actionType || 'bundle', targetCourseId: s.targetCourseId || courses[0]?.id || '' }); setEditSlide(s); setSlideModal(true); };

  const saveSlide = () => {
    if (!slideForm.title || !slideForm.actionText) { addToast('กรุณากรอกหัวข้อและปุ่ม', 'error'); return; }
    if (editSlide) { setSlides(p => p.map(s => s.id === editSlide.id ? { ...s, ...slideForm } : s)); addToast('✅ อัปเดต Banner สำเร็จ', 'success'); }
    else { setSlides(p => [...p, { id: 's-' + Date.now(), ...slideForm }]); addToast('✅ เพิ่ม Banner ใหม่สำเร็จ', 'success'); }
    setSlideModal(false);
  };

  const startUpload = () => {
    if (!lessonForm.title || !lessonForm.duration) { addToast('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }
    setUploading(true); setUploadPct(0);
    const iv = setInterval(() => {
      setUploadPct(p => {
        if (p >= 100) {
          clearInterval(iv);
          setUploading(false);
          setCourses(prev => prev.map(c => c.id === selCourse ? { ...c, lessons: [...c.lessons, { id: 'nl-' + Date.now(), title: lessonForm.title, duration: +lessonForm.duration, videoUrl: lessonForm.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4' }] } : c));
          setLF({ title: '', duration: '', videoUrl: '' });
          addToast('✅ เพิ่มบทเรียนเรียบร้อย', 'success');
          return 0;
        }
        return Math.min(p + Math.floor(Math.random() * 20 + 15), 100);
      });
    }, 250);
  };

  const approveOrder = (orderId) => {
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));
    addToast('✅ อนุมัติสลิปชำระเงินและสิทธิ์เข้าเรียนแล้ว', 'success');
  };

  const handleManualEnroll = (e) => {
    e.preventDefault();
    if (!manualStudent.name.trim()) { addToast('กรุณากรอกชื่อนักเรียน', 'error'); return; }
    const cSelected = courses.find(c => c.id === manualStudent.courseId);
    // Add fake order for history
    const mockOrder = {
      id: `ORD-${Date.now()}`,
      studentName: manualStudent.name,
      courseTitle: cSelected?.title || 'ชีววิทยา',
      price: cSelected?.price || 0,
      date: new Date().toLocaleDateString('th-TH'),
      status: 'approved',
      paymentMethod: 'Manual Enrollment'
    };
    setOrders(p => [mockOrder, ...p]);
    addToast(`🎓 ลงทะเบียนเรียน "${cSelected?.title}" ให้คุณ ${manualStudent.name} แล้ว`, 'success');
    setManualStudent(p => ({ ...p, name: '' }));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) { addToast('กรุณากรอกข้อมูลโค้ดและส่วนลด', 'error'); return; }
    const codeUpper = newCoupon.code.trim().toUpperCase();
    if (coupons.find(c => c.code.toUpperCase() === codeUpper)) { addToast('โค้ดนี้มีอยู่ในระบบแล้ว', 'error'); return; }
    setCoupons(p => [...p, { code: codeUpper, discount: +newCoupon.discount, type: newCoupon.type }]);
    addToast(`🎫 เพิ่มคูปองโค้ด "${codeUpper}" เรียบร้อยแล้ว`, 'success');
    setNewCoupon({ code: '', discount: '', type: 'flat' });
  };

  const deleteCoupon = (code) => {
    setCoupons(p => p.filter(c => c.code !== code));
    addToast('🗑 ลบคูปองส่วนลดเรียบร้อยแล้ว', 'info');
  };

  const inpStyle: CSSProperties = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px' };

  return (
    <div className="admin-container" style={{ background: C.page, paddingTop: '70px' }}>
      {/* Admin Sidebar */}
      <aside className="admin-sidebar" style={{ width: '220px', background: C.navy, position: 'fixed', top: '70px', left: 0, bottom: 0, display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <nav style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer', border: 'none', textAlign: 'left', transition: 'all 0.15s',
              background: tab === t.id ? C.sky : 'transparent', color: 'white'
            }}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Admin main content panel */}
      <main className="admin-main" style={{ flex: 1, marginLeft: '220px', padding: '24px', maxWidth: 'calc(100% - 220px)' }}>
        <div style={{ maxWidth: '950px' }}>
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: C.navy, margin: 0 }}>ภาพรวมระบบวิเคราะห์ข้อมูล</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {[
                  { label: 'คอร์สทั้งหมด', value: courses.length, unit: 'คอร์ส', bg: '#EFF6FF', color: C.sky },
                  { label: 'นักเรียนสะสม', value: '12,500 คน', unit: 'ลงทะเบียน', bg: '#FEF2F2', color: C.red },
                  { label: 'ยอดขายสะสม', value: `฿${formatPrice(orders.reduce((s, o) => s + o.price, 0) + 49500)}`, unit: 'บาท', bg: '#F0FDF4', color: '#10B981' },
                  { label: 'คูปองใช้งานอยู่', value: coupons.length, unit: 'โค้ดส่วนลด', bg: '#FFFBEB', color: '#D97706' }
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: '16px', padding: '16px', border: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 6px' }}>{s.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 950, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>{s.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการคอร์สเรียนชีวะ</h2>
                <button onClick={openAddCourse} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + เพิ่มคอร์สใหม่
                </button>
              </div>
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>{['วิชา', 'ระดับชั้น', 'ราคาพิเศษ', 'จัดการ'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.navy }}>{c.title}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.Level}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: C.red }}>฿{formatPrice(c.price)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" aria-label={`แก้ไขคอร์ส ${c.title}`} onClick={() => openEditCourse(c)} style={{ background: '#EFF6FF', border: 'none', padding: '6px', borderRadius: '6px', color: C.sky, cursor: 'pointer' }}><Edit size={12} /></button>
                            <button type="button" aria-label={`ลบคอร์ส ${c.title}`} onClick={() => confirmDeleteCourse(c)} style={{ background: '#FEF2F2', border: 'none', padding: '6px', borderRadius: '6px', color: C.red, cursor: 'pointer' }}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'lessons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการรายละเอียดบทเรียน</h2>
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>เลือกคอร์สเพื่อจัดระเบียบ</label>
                  <select value={selCourse} onChange={e => setSelCourse(e.target.value)} style={{ ...inpStyle, background: 'white' }}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                {selC?.lessons.map((l, idx) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB', padding: '10px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>บทที่ {idx + 1}: {l.title}</span>
                    <button onClick={() => confirmDeleteLesson(l)} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                ))}
                <div style={{ borderTop: '1.5px solid #F3F4F6', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '12px', color: C.navy, margin: 0 }}>+ เพิ่มคลิปบทเรียนใหม่</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <input type="text" placeholder="ชื่อบทเรียน" value={lessonForm.title} onChange={e => setLF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
                      <input type="number" placeholder="ความยาว (นาที)" value={lessonForm.duration} onChange={e => setLF(p => ({ ...p, duration: e.target.value }))} style={inpStyle} />
                    </div>
                    <input type="text" placeholder="URL ลิงก์วิดีโอ (เช่น https://example.com/video.mp4 หรือ YouTube)" value={lessonForm.videoUrl || ''} onChange={e => setLF(p => ({ ...p, videoUrl: e.target.value }))} style={inpStyle} />
                  </div>
                  <button onClick={startUpload} disabled={uploading} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    {uploading ? `กำลังอัปโหลดวิดีโอ (${uploadPct}%)` : 'ยืนยันอัปโหลดวิดีโอเข้าบทเรียน'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>ตรวจสอบสลิปและยืนยันคำสั่งซื้อ</h2>
              </div>

              {/* Table of Orders */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>
                      {['ออเดอร์', 'ชื่อนักเรียน', 'วิชา', 'ยอดเงิน', 'ช่องทาง', 'สถานะ', 'อนุมัติ'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700 }}>{o.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{o.studentName}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.navy }}>{o.courseTitle}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: C.red }}>฿{formatPrice(o.price)}</td>
                        <td style={{ padding: '12px 16px', color: '#6B7280' }}>{o.paymentMethod}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: o.status === 'approved' ? '#D1FAE5' : '#FEF2F2',
                            color: o.status === 'approved' ? '#065F46' : '#991B1B',
                            padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 850
                          }}>
                            {o.status === 'approved' ? 'ชำระเงินสำเร็จ' : 'รอตรวจสอบสลิป'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {o.status === 'pending' ? (
                            <button onClick={() => approveOrder(o.id)} style={{ background: C.sky, color: 'white', fontSize: '10px', fontWeight: 800, padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                              อนุมัติ
                            </button>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '11px' }}>อนุมัติแล้ว</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Manual enrollment form */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, color: C.navy, margin: '0 0 14px' }}>ลงทะเบียนเรียนให้นักเรียนแบบแมนนวล (Manual Roll)</h3>
                <form onSubmit={handleManualEnroll} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>ชื่อ-นามสกุล นักเรียน</label>
                    <input type="text" placeholder="ชื่อ นามสกุล นักเรียน" value={manualStudent.name} onChange={e => setManualStudent(p => ({ ...p, name: e.target.value }))} style={inpStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>เลือกคอร์สเรียน</label>
                    <select value={manualStudent.courseId} onChange={e => setManualStudent(p => ({ ...p, courseId: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    เพิ่มสิทธิ์เข้าเรียนทันที
                  </button>
                </form>
              </div>
            </div>
          )}

          {tab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการคูปองและโปรโมชันส่วนลด</h2>

              {/* Create new coupon */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, color: C.navy, margin: '0 0 14px' }}>+ สร้างโค้ดคูปองส่วนลดใหม่</h3>
                <form onSubmit={handleAddCoupon} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>โค้ดส่วนลด (เช่น NEWBIO200)</label>
                    <input type="text" placeholder="เช่น SUMMERSALE" value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value }))} style={inpStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>ประเภทส่วนลด</label>
                    <select value={newCoupon.type} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                      <option value="flat">ลดระบุจำนวนบาท (฿)</option>
                      <option value="percent">ลดระบุเปอร์เซ็นต์ (%)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>มูลค่าส่วนลด</label>
                    <input type="number" placeholder="เช่น 200" value={newCoupon.discount} onChange={e => setNewCoupon(p => ({ ...p, discount: e.target.value }))} style={inpStyle} />
                  </div>
                  <button type="submit" style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    + บันทึกเพิ่มคูปอง
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>
                      {['โค้ดส่วนลด', 'ประเภท', 'มูลค่า', 'การจัดการ'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.code} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 850, color: C.navy }}>{c.code}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.type === 'percent' ? 'ลดเป็นเปอร์เซ็นต์ (%)' : 'ลดมูลค่าคงที่ (฿)'}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 900, color: '#10B981' }}>
                          {c.type === 'percent' ? `${c.discount}%` : `฿${formatPrice(c.discount)}`}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => deleteCoupon(c.code)} style={{ background: '#FEF2F2', border: 'none', padding: '6px 10px', borderRadius: '6px', color: C.red, cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                            ลบโค้ด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการ Banner และ Flash Sale</h2>
                <button onClick={openAddSlide} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + เพิ่ม Banner ใหม่
                </button>
              </div>
              {slides.map(s => (
                <div key={s.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ background: C.skyLight, color: C.sky, fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>{s.label}</span>
                    <h4 style={{ fontWeight: 800, color: C.navy, fontSize: '13px', margin: '6px 0 2px' }}>{s.title}</h4>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{s.desc}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEditSlide(s)} style={{ background: '#EFF6FF', color: C.sky, border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                      แก้ไข
                    </button>
                    <button onClick={() => confirmDeleteSlide(s)} style={{ background: '#FEF2F2', color: C.red, border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal isOpen={courseModal} onClose={() => setCourseModal(false)} title={editCourse ? 'แก้ไขคอร์สเรียน' : 'เพิ่มคอร์สใหม่'} wide>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle} htmlFor="course-title">ชื่อคอร์ส</label>
                <input id="course-title" type="text" value={courseForm.title} onChange={e => setCF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px' }}>
                <div>
                  <label style={labelStyle} htmlFor="course-price">ราคาขาย</label>
                  <input id="course-price" type="number" min="0" value={courseForm.price} onChange={e => setCF(p => ({ ...p, price: e.target.value }))} style={inpStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="course-original-price">ราคาเต็ม</label>
                  <input id="course-original-price" type="number" min="0" value={courseForm.originalPrice} onChange={e => setCF(p => ({ ...p, originalPrice: e.target.value }))} style={inpStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="course-level">ระดับชั้น</label>
                  <input id="course-level" type="text" value={courseForm.Level} onChange={e => setCF(p => ({ ...p, Level: e.target.value }))} style={inpStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="course-image">URL รูปปก</label>
                <input id="course-image" type="url" value={courseForm.imageUrl} onChange={e => setCF(p => ({ ...p, imageUrl: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="course-description">รายละเอียด</label>
                <textarea id="course-description" rows={4} value={courseForm.description} onChange={e => setCF(p => ({ ...p, description: e.target.value }))} style={{ ...inpStyle, resize: 'vertical' }} />
              </div>
              <button type="button" onClick={saveCourse} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                บันทึกข้อมูลคอร์ส
              </button>
            </div>
          </Modal>

          {/* Modal Slide / Banner Edit */}
          <Modal isOpen={slideModal} onClose={() => setSlideModal(false)} title={editSlide ? 'แก้ไข Banner' : 'เพิ่ม Banner ใหม่'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>หัวข้อ Banner (Title)</label>
                <input type="text" placeholder="เช่น Flash Sale ลดพิเศษ 50%" value={slideForm.title} onChange={e => setSF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>รายละเอียด (Description)</label>
                <input type="text" placeholder="เช่น เฉพาะ 100 ท่านแรกเท่านั้น" value={slideForm.desc} onChange={e => setSF(p => ({ ...p, desc: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>ป้ายกำกับ (Label)</label>
                <input type="text" placeholder="เช่น 🔥 FLASH SALE" value={slideForm.label} onChange={e => setSF(p => ({ ...p, label: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>ข้อความปุ่ม Action</label>
                <input type="text" placeholder="เช่น สมัครเลย" value={slideForm.actionText} onChange={e => setSF(p => ({ ...p, actionText: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>คอร์สที่เชื่อมโยง</label>
                <select value={slideForm.targetCourseId} onChange={e => setSF(p => ({ ...p, targetCourseId: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <button onClick={saveSlide} style={{ marginTop: '10px', width: '100%', background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                บันทึกข้อมูล Banner
              </button>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}
