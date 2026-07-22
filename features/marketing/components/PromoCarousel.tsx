'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Info } from 'lucide-react'
import { C } from '@/src/app-data'



// ─────────────────────────────────────────────────────────────────────────────
// PROMO CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
export function PromoCarousel({ slides, courses, onAddToCart, enrolledIds, addToast, onViewDetails, setPage }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!slides?.length) return;
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [slides?.length]);
  if (!slides?.length) return null;
  const s = slides[active];

  const handleAction = () => {
    if (s.actionType === 'bundle') {
      const toAdd = courses.filter(c => !enrolledIds.includes(c.id));
      if (!toAdd.length) { addToast('คุณลงทะเบียนครบทุกคอร์สแล้ว', 'info'); return; }
      toAdd.forEach(c => onAddToCart(c));
      addToast(`🛒 เพิ่ม ${toAdd.length} คอร์สลงตะกร้าพร้อมส่วนลดเซ็ตคู่แล้ว`, 'success');
    } else if (s.actionType === 'course') {
      const c = courses.find(x => x.id === s.targetCourseId);
      if (!c) { addToast('ไม่พบคอร์สเรียนนี้', 'error'); return; }
      onAddToCart(c);
    } else {
      document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = () => {
    if (s.targetCourseId) {
      const c = courses.find(x => x.id === s.targetCourseId);
      if (c) {
        onViewDetails(c);
      } else {
        setPage('courses');
      }
    } else {
      setPage('courses');
    }
  };

  return (
    <section style={{ padding: '40px 24px', background: C.page }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(135deg, ${s.bg1} 0%, ${s.bg2} 100%)`,
          borderRadius: '24px', padding: '32px 40px', display: 'flex', alignItems: 'center',
          gap: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)',
          position: 'relative', overflow: 'hidden', flexWrap: 'wrap'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ flex: 1, minWidth: '300px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 850, color: '#374151', background: 'rgba(255,255,255,0.92)', padding: '7px 18px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{s.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 850, color: C.red, background: 'rgba(255,255,255,0.92)', padding: '7px 18px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{s.badgeText}</span>
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 950, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>{s.title}</h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: '0 0 24px', fontFamily: C.fontBody }}>{s.desc}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={handleAction} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: C.navy, color: 'white', fontWeight: 800, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: `0 4px 12px rgba(185,28,28,0.25)` }}
                onMouseOver={e => e.currentTarget.style.background = C.sky}
                onMouseOut={e => e.currentTarget.style.background = C.navy}>
                {s.actionText} <ArrowRight size={16} />
              </button>
              <button onClick={handleViewDetails} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.85)', border: '1.5px solid #D1D5DB', color: '#374151', fontWeight: 800, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}>
                <Info size={16} /> ดูรายละเอียด
              </button>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <div style={{ width: '220px', height: '140px', borderRadius: '16px', background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.navy, border: '1px solid #E5E7EB' }}>
              <Zap size={32} color={C.red} />
              <span style={{ fontSize: '12px', fontWeight: 800, marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>FLASH SALE INBIOLOGY</span>
            </div>
          </div>
        </div>
        {/* Carousel indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ height: '8px', borderRadius: '999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', background: i === active ? C.sky : '#D1D5DB', width: i === active ? '36px' : '8px' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
