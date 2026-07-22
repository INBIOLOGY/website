'use client'

import { BookOpen, Play, ChevronRight, Sparkles, Award, Brain } from 'lucide-react'
import { C } from '@/src/app-data'


// ───────────────────────────────────────────────────────────
export function HeroSection({ onStart, onView, courses }) {
  const stats = [
    { value: '50,000+', label: 'เรียนแล้วกว่า (คน)' },
    { value: `${courses.length > 5 ? courses.length : 10}+`, label: 'คอร์สคุณภาพ' },
    { value: '30+', label: 'ครูผู้สอน' },
    { value: 'Certificate', label: 'รับใบรับรองฟรี' },
  ];

  return (
    <section style={{
      paddingTop: '140px',
      paddingBottom: '80px',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0.7) 100%), url(/hero-bg.jpg) center center / cover no-repeat',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Wave decoration on top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: '10px', background: 'rgba(0,0,0,0.01)', pointerEvents: 'none' }} />

      {/* Floating Science/Learning Background Decorations */}
      <Brain size={48} style={{ position: 'absolute', top: '12%', left: '4%', color: 'rgba(255,255,255,0.2)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
      <Sparkles size={32} style={{ position: 'absolute', bottom: '22%', left: '42%', color: 'rgba(255,255,255,0.25)', animation: 'float 8s ease-in-out infinite 1s', pointerEvents: 'none' }} />
      <Award size={40} style={{ position: 'absolute', top: '16%', right: '8%', color: 'rgba(255,255,255,0.2)', animation: 'float 7s ease-in-out infinite 0.5s', pointerEvents: 'none' }} />
      <BookOpen size={36} style={{ position: 'absolute', bottom: '12%', right: '48%', color: 'rgba(255,255,255,0.2)', animation: 'float 9s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      <div className="hero-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', gap: '48px', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Left Info */}
        <div className="hero-left animate-fade-in-up" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '36px'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(40px,5.2vw,64px)',
              fontWeight: 950,
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.7)',
              lineHeight: 1.15,
              margin: 0
            }}>
              เรียนชีวะให้เข้าใจ
              <span style={{
                display: 'block',
                color: '#FDE047', // Beautiful golden yellow accent
                fontSize: 'clamp(36px,4.6vw,56px)',
                fontWeight: 950,
                marginTop: '8px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 0 30px rgba(253, 224, 71, 0.35)'
              }}>ไม่ใช่แค่จำ</span>
              <span style={{
                display: 'block',
                color: '#F3F4F6',
                fontSize: 'clamp(18px,2.5vw,26px)',
                fontWeight: 700,
                marginTop: '12px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)'
              }}>ติวเข้มออนไลน์แบบครบวงจรกับ พี่ต้น</span>
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={onStart} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.red, color: 'white', fontWeight: 800, fontSize: '15px', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: `0 8px 24px rgba(239,68,68,0.35)`, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseOver={e => { e.currentTarget.style.background = C.redDark; e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; }}
                onMouseOut={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.transform = 'none'; }}>
                <Play size={18} fill="white" /> เริ่มเรียนฟรี
              </button>
              <button onClick={onView} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.borderColor = '#FFFFFF'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.transform = 'none'; }}>
                ดูคอร์สทั้งหมด <ChevronRight size={18} />
              </button>
            </div>

            {/* Stats list - Transparent glassmorphic style */}
            <div className="stats-grid" style={{
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '20px',
              padding: '18px 16px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              marginTop: '12px'
            }}>
              {stats.map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 950, color: '#FFFFFF', fontSize: '22px', lineHeight: 1, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>{s.value}</div>
                  <div style={{ color: '#F3F4F6', fontSize: '10px', fontWeight: 800, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Instructor Card */}
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="animate-float" style={{ position: 'relative' }}>

            {/* Main Glass Card */}
            <div style={{
              width: '320px',
              borderRadius: '28px',
              position: 'relative',
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.8), 0 0 50px rgba(185,28,28,0.05)',
              overflow: 'hidden',
              padding: '28px 24px 24px',
            }}>
              {/* Ambient glow behind photo */}
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '220px', height: '220px', background: 'radial-gradient(circle,rgba(185,28,28,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

              {/* Photo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    border: '3px solid rgba(185,28,28,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden', background: '#1E3A8A', flexShrink: 0,
                  }}>
                    <img src="/instructor.jpg" alt="พี่ต้น — ผู้สอน INBIOLOGY" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  {/* Online status indicator */}
                  <span style={{
                    position: 'absolute', bottom: '6px', right: '6px',
                    width: '18px', height: '18px', background: '#10B981',
                    borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 0 8px rgba(16,185,129,0.4)'
                  }} />
                </div>

                {/* Name & Title */}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: C.textDark, fontWeight: 900, fontSize: '18px', letterSpacing: '-0.01em', margin: '0 0 4px' }}>พี่ต้น</p>
                  <p style={{ color: C.textMuted, fontSize: '11px', fontWeight: 600, margin: '0 0 8px' }}>นายพิสิษฐ์ สายตา</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#FEE2E2', color: C.red, fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(185,28,28,0.1)' }}>🔬 ชีววิทยา</span>
                    <span style={{ background: '#EFF6FF', color: C.sky, fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(30,58,138,0.1)' }}>🎓 เกียรตินิยมอันดับ 1</span>
                  </div>
                </div>

                {/* Credentials */}
                <div style={{ width: '100%', background: '#F9FAFB', borderRadius: '14px', padding: '12px 14px', border: '1px solid #E5E7EB' }}>
                  {[
                    { icon: '🎓', text: 'ป.ตรี คณะศึกษาศาสตร์ มหาวิทยาลัยนเรศวร' },
                    { icon: '🎓', text: 'ป.โท คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น' },
                    { icon: '📚', text: 'ประสบการณ์สอน 9 ปี' },
                    { icon: '🏫', text: 'วิทยากรพิเศษตามโรงเรียนต่างๆ' },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
                      <p style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: '13px' }}>⭐</span>)}
                  </div>
                  <span style={{ color: C.textDark, fontWeight: 900, fontSize: '14px' }}>4.98</span>
                  <span style={{ color: C.textMuted, fontSize: '10px' }}>(2,847 รีวิว)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Wave transition aligned securely to bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', lineHeight: 0, zIndex: 10 }}>
        <svg viewBox="0 0 1440 60" style={{ width: '100%', display: 'block' }}>
          <path fill={C.page} d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
