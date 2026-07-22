'use client'

import { useState } from 'react'
import { Star, Check, ShoppingCart, PlayCircle } from 'lucide-react'
import { C, formatPrice, pct } from '@/src/app-data'



// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
export function CourseCard({ course, onAddToCart, enrolled, onViewDetails, onTrial }) {
  const [hover, setHover] = useState(false);
  const disc = pct(course.originalPrice, course.price);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: 'white', borderRadius: '20px', border: '1px solid', borderColor: hover ? C.navy : '#E5E7EB', overflow: 'hidden',
      boxShadow: hover ? '0 20px 40px rgba(185,28,28,0.12), 0 4px 12px rgba(30,58,138,0.04)' : '0 4px 12px rgba(0,0,0,0.02)',
      transform: hover ? 'translateY(-6px)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '240px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px' }}>
        <img src={course.imageUrl} alt={course.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)', transition: 'transform 0.5s', transform: hover ? 'scale(1.04)' : 'scale(1)' }} />
        <span style={{ position: 'absolute', top: '12px', left: '12px', background: course.badgeBg, color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', zIndex: 2 }}>
          {course.badge}
        </span>
        <button onClick={() => onTrial(course)} style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30,58,138,0.82)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2 }}>
          <PlayCircle size={12} /> ทดลองเรียนฟรี
        </button>
      </div>

      {/* Body details */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: course.tagBg, color: course.tagColor }}>
            {course.tag}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF' }}>{course.Level}</span>
        </div>
        <h3 onClick={() => onViewDetails(course)} style={{ cursor: 'pointer', fontWeight: 850, color: C.navy, fontSize: '15px', lineHeight: 1.3, margin: 0, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onMouseOver={e => e.currentTarget.style.color = C.sky} onMouseOut={e => e.currentTarget.style.color = C.navy}>
          {course.title}
        </h3>
        <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, margin: 0 }}>ผู้สอน: {course.instructor}</p>

        {/* Rating and hours info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} fill="#FBBF24" color="#FBBF24" />
            <span style={{ fontWeight: 800, color: '#D97706' }}>{course.rating}</span>
            <span style={{ color: '#9CA3AF' }}>({course.reviewCount})</span>
          </div>
          <span style={{ color: C.sky, fontWeight: 700 }}>{course.hours} ชั่วโมงเรียน</span>
        </div>

        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.5, fontFamily: C.fontBody, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>

        {/* Bottom price and actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through', display: 'block' }}>฿{formatPrice(course.originalPrice)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: C.navy }}>฿{formatPrice(course.price)}</span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', background: C.red, padding: '2px 5px', borderRadius: '4px' }}>-{disc}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => onViewDetails(course)} style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: C.sky, border: 'none', cursor: 'pointer' }}>
              รายละเอียด
            </button>
            <button onClick={() => onAddToCart(course)} disabled={enrolled} style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: enrolled ? 'not-allowed' : 'pointer', border: 'none',
              background: enrolled ? '#D1FAE5' : C.red, color: enrolled ? '#065F46' : 'white'
            }}>
              {enrolled ? <><Check size={11} /> เรียนเลย</> : <><ShoppingCart size={11} /> ชำระเงิน</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
