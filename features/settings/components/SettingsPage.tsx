'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { C } from '@/src/app-data'



// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function SettingsPage({ setPage, darkMode, setDarkMode, lang, setLang, addToast, userRole }) {
  const [fontSize, setFontSize] = useState('medium');
  const [toastNotif, setToastNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [courseReminder, setCourseReminder] = useState(true);
  const [examAlert, setExamAlert] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState('1');
  const [autoPlay, setAutoPlay] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  useEffect(() => {
    setFontSize(localStorage.getItem('inbiology_fontsize') || 'medium');
    setVideoSpeed(localStorage.getItem('inbiology_videospeed') || '1');
    setSettingsHydrated(true);
  }, []);

  // Apply font size to root
  useEffect(() => {
    const sizes: Record<string, string> = { small: '13px', medium: '15px', large: '17px' };
    document.documentElement.style.setProperty('--app-font-size', sizes[fontSize] || '15px');
    if (settingsHydrated) localStorage.setItem('inbiology_fontsize', fontSize);
  }, [fontSize, settingsHydrated]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) document.documentElement.classList.add('high-contrast');
    else document.documentElement.classList.remove('high-contrast');
  }, [highContrast]);

  const sectionStyle = { background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', marginBottom: '16px' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F3F4F6' };
  const lastRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0' };
  const labelStyle = { fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 };
  const subStyle = { fontSize: '11px', color: '#9CA3AF', marginTop: '3px', fontFamily: C.fontBody, margin: 0 };

  const Toggle = ({ on, onToggle, color }) => (
    <button onClick={onToggle} style={{
      display: 'inline-flex', alignItems: 'center', background: on ? (color || C.navy) : '#D1D5DB',
      borderRadius: '999px', width: '44px', height: '24px', padding: '3px',
      border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
    }}>
      <span style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
    </button>
  );

  const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 900, color: C.navy, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '3px 0 0', fontFamily: C.fontBody }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '100px', paddingBottom: '60px', background: C.page }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => setPage('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
            onMouseOver={e => e.currentTarget.style.color = '#374151'}
            onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
            <ChevronLeft size={15} /> กลับหน้าหลัก
          </button>
          <h1 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: '0 0 4px' }}>⚙️ การตั้งค่า</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, fontFamily: C.fontBody }}>ปรับแต่งประสบการณ์การเรียนรู้ของคุณ</p>
        </div>

        {/* ── 1. การแสดงผล ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🎨 การแสดงผลหน้าจอ" sub="ปรับธีม, ขนาดตัวอักษร และความสบายของสายตา" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>🌙 โหมดมืด (Dark Mode)</p><p style={subStyle}>เปลี่ยนพื้นหลังเป็นสีเข้มเพื่อถนอมสายตาในที่มืด</p></div>
            <Toggle on={darkMode} onToggle={() => { const n = !darkMode; setDarkMode(n); addToast(n ? '🌙 เปิดโหมดมืดแล้ว' : '☀️ เปิดโหมดสว่างแล้ว', 'info'); }} color={C.sky} />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>📏 ขนาดตัวอักษร</p><p style={subStyle}>ปรับขนาดตัวอักษรทั่วทั้งระบบ (ปัจจุบัน: {fontSize === 'small' ? 'เล็ก' : fontSize === 'medium' ? 'กลาง' : 'ใหญ่'})</p></div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[['small', 'S', 'เล็ก'], ['medium', 'M', 'กลาง'], ['large', 'L', 'ใหญ่']].map(([s, lbl, th]) => (
                <button key={s} onClick={() => { setFontSize(s); addToast(`📝 เปลี่ยนขนาดตัวอักษรเป็น "${th}" แล้ว`, 'info'); }}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: `1.5px solid ${fontSize === s ? C.navy : '#E5E7EB'}`, background: fontSize === s ? C.navy : 'white', color: fontSize === s ? 'white' : '#374151', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🔔 Toast การแจ้งเตือนในแอป</p><p style={subStyle}>แสดงข้อความ popup เมื่อมีการดำเนินการ</p></div>
            <Toggle on={toastNotif} onToggle={() => setToastNotif(n => !n)} color={C.navy} />
          </div>
        </div>

        {/* ── 2. ห้องเรียนและวิดีโอ ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🎬 ห้องเรียนและการเล่นวิดีโอ" sub="ตั้งค่าประสบการณ์เรียนออนไลน์" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>▶ ความเร็วเล่นวิดีโอ (ค่าเริ่มต้น)</p><p style={subStyle}>กำหนดความเร็วเริ่มต้นสำหรับทุกวิดีโอ</p></div>
            <select value={videoSpeed} onChange={e => { setVideoSpeed(e.target.value); if (settingsHydrated) localStorage.setItem('inbiology_videospeed', e.target.value); addToast(`▶ ตั้งความเร็ววิดีโอเป็น ${e.target.value}x แล้ว`, 'info'); }} style={{ fontSize: '12px', fontWeight: 800, border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', background: 'white', color: '#374151' }}>
              {['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'].map(s => (
                <option key={s} value={s}>{s}x</option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>⏭ เล่นบทเรียนถัดไปอัตโนมัติ</p><p style={subStyle}>เล่นบทเรียนถัดไปหลังวิดีโอจบโดยอัตโนมัติ</p></div>
            <Toggle on={autoPlay} onToggle={() => { setAutoPlay(n => !n); addToast(autoPlay ? '⏸ ปิดการเล่นต่อเนื่องแล้ว' : '⏭ เปิดการเล่นต่อเนื่องแล้ว', 'info'); }} color={C.navy} />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>📐 แถบซ้าย-ขวา (Sidebar)</p><p style={subStyle}>แสดงแถบรายการบทเรียนด้านซ้ายในห้องเรียน</p></div>
            <Toggle on={showSidebar} onToggle={() => { setShowSidebar(n => !n); addToast(showSidebar ? '📐 ซ่อนแถบรายการบทเรียนแล้ว' : '📐 แสดงแถบรายการบทเรียนแล้ว', 'info'); }} color={C.navy} />
          </div>
        </div>

        {/* ── 3. การแจ้งเตือน ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🔔 การแจ้งเตือน" sub="เลือกประเภทการแจ้งเตือนที่คุณต้องการรับ" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>📧 แจ้งเตือนทางอีเมล</p><p style={subStyle}>รับข่าวสาร คอร์สใหม่ และโปรโมชั่นทางอีเมล</p></div>
            <Toggle on={emailNotif} onToggle={() => { setEmailNotif(n => !n); addToast(emailNotif ? '📧 ปิดการแจ้งเตือนอีเมล' : '📧 เปิดการแจ้งเตือนอีเมลแล้ว', 'info'); }} color="#10B981" />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>📱 Push Notification</p><p style={subStyle}>รับการแจ้งเตือนแบบ push บนอุปกรณ์</p></div>
            <Toggle on={pushNotif} onToggle={() => { setPushNotif(n => !n); addToast(pushNotif ? '📱 ปิด Push Notification' : '📱 เปิด Push Notification แล้ว', 'info'); }} color="#8B5CF6" />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>⏰ เตือนความจำการเรียน</p><p style={subStyle}>แจ้งเตือนให้กลับมาเรียนเมื่อไม่ได้เรียนนาน</p></div>
            <Toggle on={courseReminder} onToggle={() => { setCourseReminder(n => !n); addToast(courseReminder ? '⏰ ปิดการเตือนความจำการเรียน' : '⏰ เปิดการเตือนความจำการเรียนแล้ว', 'info'); }} color={C.navy} />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🏆 แจ้งเตือนก่อนวันสอบ</p><p style={subStyle}>ส่งข้อความเตือนก่อนวันสอบจริง 7 วัน</p></div>
            <Toggle on={examAlert} onToggle={() => { setExamAlert(n => !n); addToast(examAlert ? '🏆 ปิดการแจ้งเตือนวันสอบ' : '🏆 เปิดการแจ้งเตือนวันสอบแล้ว', 'info'); }} color={C.red} />
          </div>
        </div>

        {/* ── 4. ภาษา ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🌐 ภาษา (Language)" sub="เลือกภาษาที่ใช้แสดงผลในระบบ" />
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['TH', '🇹🇭', 'ภาษาไทย'], ['EN', '🇺🇸', 'English']].map(([code, flag, label]) => (
              <button key={code} onClick={() => { setLang(code); addToast(code === 'EN' ? '🌐 Switched to English' : '🌐 เปลี่ยนเป็นภาษาไทย', 'info'); }} style={{
                flex: 1, padding: '14px 12px', borderRadius: '14px', border: `2px solid ${lang === code ? C.navy : '#E5E7EB'}`,
                background: lang === code ? C.navy : 'white', color: lang === code ? 'white' : '#374151',
                fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>{flag}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. การเข้าถึง ── */}
        <div style={sectionStyle}>
          <SectionHeader title="♿ การเข้าถึง (Accessibility)" sub="ตัวเลือกสำหรับการเข้าถึงที่ดียิ่งขึ้น" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>🎭 ลด Animation (Reduced Motion)</p><p style={subStyle}>ปิดหรือลดการเคลื่อนไหวของ UI เพื่อลดอาการเวียนหัว</p></div>
            <Toggle on={reducedMotion} onToggle={() => { setReducedMotion(n => !n); addToast(reducedMotion ? '🎭 เปิดอนิเมชันกลับแล้ว' : '🎭 ปิดอนิเมชัน Reduced Motion แล้ว', 'info'); }} color="#6B7280" />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🔆 ความเปรียบต่างสูง (High Contrast)</p><p style={subStyle}>เพิ่มความเปรียบต่างสีตัวอักษรให้อ่านง่ายยิ่งขึ้น</p></div>
            <Toggle on={highContrast} onToggle={() => { setHighContrast(n => !n); addToast(highContrast ? '🔆 ปิด High Contrast แล้ว' : '🔆 เปิด High Contrast แล้ว', 'info'); }} color="#374151" />
          </div>
        </div>

        {/* ── 6. บัญชี ── */}
        {userRole !== 'guest' ? (
          <div style={sectionStyle}>
            <SectionHeader title="👤 บัญชีและความปลอดภัย" sub="จัดการข้อมูลส่วนตัว รหัสผ่าน และความเป็นส่วนตัว" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'แก้ไขข้อมูลโปรไฟล์', icon: '✏️', sub: 'ชื่อ, โรงเรียน, รูปโปรไฟล์' },
                { label: 'เปลี่ยนรหัสผ่าน', icon: '🔑', sub: 'อัปเดตรหัสผ่านเพื่อความปลอดภัย' },
                { label: 'ดาวน์โหลดโน้ตทั้งหมด', icon: '📥', sub: 'บันทึกโน้ตเรียนทุกวิชาเป็นไฟล์ PDF' },
                { label: 'นโยบายความเป็นส่วนตัว', icon: '🔒', sub: 'ข้อมูลที่เราเก็บรวบรวมและวิธีการใช้งาน' },
                { label: 'แจ้งปัญหาการใช้งาน', icon: '🐛', sub: 'ส่งรายงานบั๊กหรือข้อเสนอแนะ' },
              ].map(b => (
                <button key={b.label} onClick={() => addToast(`${b.icon} ${b.label} — กำลังพัฒนา`, 'info')} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                  border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FAFAFA', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s'
                }}
                  onMouseOver={e => e.currentTarget.style.background = '#EFF6FF'}
                  onMouseOut={e => e.currentTarget.style.background = '#FAFAFA'}>
                  <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{b.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>{b.label}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, fontFamily: C.fontBody }}>{b.sub}</p>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...sectionStyle, textAlign: 'center', padding: '32px' }}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: C.navy, margin: '0 0 8px' }}>👤 ยังไม่ได้เข้าสู่ระบบ</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', fontFamily: C.fontBody }}>เข้าสู่ระบบเพื่อเข้าถึงการตั้งค่าบัญชีและข้อมูลส่วนตัว</p>
            <button onClick={() => setPage('login')} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
              เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          </div>
        )}

        {/* ── About ── */}
        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <SectionHeader title="ℹ️ เกี่ยวกับ INBIOLOGY Academy" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4B5563' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>เวอร์ชัน</span><span style={{ color: '#9CA3AF' }}>INBIOLOGY Academy v2.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>พัฒนาโดย</span><span style={{ color: '#9CA3AF' }}>พี่ต้น (INBIOLOGY Team)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>อัปเดตล่าสุด</span><span style={{ color: '#9CA3AF' }}>กรกฎาคม 2026</span>
            </div>
            {[
              { label: 'เงื่อนไขการใช้งาน', icon: '📋' },
              { label: 'นโยบายความเป็นส่วนตัว', icon: '🔒' },
              { label: 'Open Source Licenses', icon: '⚖️' },
            ].map(b => (
              <button key={b.label} onClick={() => addToast(`${b.icon} ${b.label} — กำลังพัฒนา`, 'info')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '13px', fontWeight: 700, color: '#374151', textAlign: 'left',
                borderBottom: '1px solid #F3F4F6'
              }}
                onMouseOver={e => e.currentTarget.style.color = C.sky}
                onMouseOut={e => e.currentTarget.style.color = '#374151'}>
                <span>{b.icon}</span>{b.label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#D1D5DB', marginTop: '20px' }}>INBIOLOGY Academy v2.0 • © 2026 by พี่ต้น • All rights reserved.</p>
      </div>
    </div>
  );
}
