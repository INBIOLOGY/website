'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { C } from '@/src/app-data'



// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function StudentDashboard({ courses, enrolledCourses, setPage, addToast, setActiveCourseId, notes }) {
  const [activeTab, setActiveTab] = useState('courses'); // courses, notes, support
  const enrolled = courses.filter(c => enrolledCourses.includes(c.id));

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="student-dashboard-layout" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', gap: '24px' }}>
        {/* Left dashboard profile sidebar */}
        <aside style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: C.skyLight, color: C.sky, fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              👨‍🎓
            </div>
            <h3 style={{ fontWeight: 850, fontSize: '15px', color: C.navy, margin: '0 0 2px' }}>พี่วิทศรุต</h3>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>โรงเรียนสตรีวิทยา • ม.5</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'courses', label: '📚 คอร์สเรียนของฉัน' },
              { id: 'notes', label: '📝 สมุดบันทึกโน้ตย่อ' },
              { id: 'support', label: '📞 ศูนย์ช่วยเหลือ FAQ' }
            ].map(tb => (
              <button key={tb.id} onClick={() => setActiveTab(tb.id)} style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: '12px', fontWeight: 800, fontFamily: 'inherit',
                background: activeTab === tb.id ? '#EFF6FF' : 'transparent', color: activeTab === tb.id ? C.sky : '#4B5563'
              }}>
                {tb.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Dashboard panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: '0 0 4px' }}>คอร์สเรียนของคุณ</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>ลงทะเบียนเรียนแล้วทั้งหมด {enrolled.length} คอร์ส</p>
              </div>

              {enrolled.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center' }}>
                  <BookOpen size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontWeight: 800, color: C.navy, fontSize: '15px', margin: '0 0 6px' }}>ยังไม่มีคอร์สเรียนสะสม</h3>
                  <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '18px' }}>ไปดูคอร์สชีววิทยาที่น่าสนใจและเริ่มต้นเรียนรู้วันนี้</p>
                  <button onClick={() => setPage('courses')} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    เลือกซื้อคอร์สเรียนเลย
                  </button>
                </div>
              ) : (
                <div className="enrolled-courses-grid" style={{ gap: '16px' }}>
                  {enrolled.map(c => (
                    <div key={c.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '120px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                        <img src={c.imageUrl} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} alt="" />
                      </div>
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <h4 style={{ fontWeight: 800, color: C.navy, fontSize: '13px', margin: 0, lineHeight: 1.3 }}>{c.title}</h4>
                        {/* Progress Bar */}
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '4px' }}>
                            <span>ความก้าวหน้าการเรียน</span>
                            <span>60%</span>
                          </div>
                          <div style={{ width: '100%', background: '#F3F4F6', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: '60%', background: '#10B981', height: '100%' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                          <button onClick={() => { setActiveCourseId(c.id); setPage('classroom'); }} style={{ flex: 1, background: C.sky, color: 'white', fontWeight: 800, fontSize: '11px', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                            ▶ เริ่มบทเรียนต่อ
                          </button>
                          <button onClick={() => addToast('🏆 ดาวน์โหลดเกียรติบัตร (Certificate) สำเร็จ!', 'success')} style={{ flex: 1, background: '#EFF6FF', color: C.sky, fontWeight: 800, fontSize: '11px', padding: '8px', borderRadius: '8px', border: '1px solid #DBEAFE', cursor: 'pointer' }}>
                            🏆 รับ Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: 0 }}>📝 สมุดบันทึกโน้ตย่อส่วนตัว</h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>บันทึกโน้ตสำคัญจากทุกคอร์สที่คุณจดไว้จะแสดงในส่วนนี้เพื่อให้เข้าถึงทบทวนได้ง่าย</p>
              {notes.length === 0 ? (
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                  ยังไม่มีบันทึกโน้ตย่อในขณะนี้
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notes.map(nt => (
                    <div key={nt.id} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', fontSize: '12px', color: '#4B5563', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 850, color: C.navy, display: 'block', fontSize: '12px' }}>{nt.courseTitle}</span>
                      <span style={{ fontWeight: 800, color: C.sky, display: 'block', fontSize: '11px', marginBottom: '4px' }}>{nt.time}</span>
                      "{nt.text}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: 0 }}>📞 FAQ และศูนย์ช่วยเหลือ</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { q: 'จะติดต่อแอดมินหรือพี่ต้นได้อย่างไร?', a: 'สามารถสอบถามผ่านช่องทาง Line Official: @inbiologylogy หรือ Inbox เพจ Facebook: inbiologylogy ได้โดยตรง' },
                  { q: 'ดาวน์โหลดใบรับรอง Certificate อย่างไร?', a: 'เมื่อดูบทเรียนในคอร์สนั้นๆ ครบถ้วน 100% ระบบจะขึ้นปุ่มให้กดดาวน์โหลด PDF เกียรติบัตรทันทีบน Dashboard' }
                ].map((f, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                    <p style={{ fontWeight: 800, fontSize: '12px', color: '#374151', margin: '0 0 4px' }}>Q: {f.q}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: C.fontBody }}>A: {f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
