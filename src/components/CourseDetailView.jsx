import { Play, Clock, Shield, FileText, Award } from 'lucide-react';
import { C } from '../constants/theme.js';
import { formatPrice, pct } from '../utils/formatters.js';

export default function CourseDetailView({ course, onAddToCart, enrolled, onClose, onStartTrial }) {
  if (!course) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="course-detail-grid" style={{ gap: '24px', alignItems: 'start' }}>
        {/* Left Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '320px', background: '#0F172A', borderRadius: '16px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <img src={course.imageUrl} loading="lazy" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', opacity: 0.9 }} alt="" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.25)' }}>
              <button onClick={() => onStartTrial(course)} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.35)', zIndex: 2 }}>
                <Play size={24} fill={C.sky} color={C.sky} style={{ marginLeft: '4px' }} />
              </button>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 800, background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '999px', zIndex: 2 }}>▶ ดูตัวอย่างคอร์สเรียน</span>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: C.navy, margin: '0 0 8px' }}>{course.title}</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6, fontFamily: C.fontBody }}>{course.description}</p>
          </div>
          {/* Syllabus */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '13px', color: C.navy, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>📚 เนื้อหาและหลักสูตรการสอน</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F9FAFB', padding: '16px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
              {course.lessons?.map((l, idx) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx === course.lessons.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>บทที่ {idx + 1}: {l.title}</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{l.duration} นาที</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right purchase card */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>ราคาปกติ ฿{formatPrice(course.originalPrice)}</span>
            <span style={{ background: C.red, color: 'white', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>-{pct(course.originalPrice, course.price)}% OFF</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 950, color: C.navy, lineHeight: 1 }}>฿{formatPrice(course.price)}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#4B5563', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color={C.sky} /> <span>เรียนจุใจ {course.hours} ชั่วโมงเต็ม</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14} color={C.sky} /> <span>เข้าเรียนออนไลน์ได้นาน {course.validity} วัน</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={14} color={C.sky} /> <span>รับไฟล์เอกสาร e-Book PDF ฟรี</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={14} color={C.sky} /> <span>ได้รับใบรับรอง (Certificate) หลังจบคอร์ส</span></div>
          </div>

          <button onClick={() => { onAddToCart(course); onClose(); }} disabled={enrolled} style={{
            width: '100%', background: enrolled ? '#D1FAE5' : C.sky, color: enrolled ? '#065F46' : 'white',
            fontWeight: 800, fontSize: '14px', padding: '14px', borderRadius: '12px', cursor: enrolled ? 'not-allowed' : 'pointer', border: 'none'
          }}>
            {enrolled ? '✓ คุณเป็นเจ้าของคอร์สนี้แล้ว' : '🛒 ซื้อคอร์สเรียนนี้เลย'}
          </button>
        </div>
      </div>
    </div>
  );
}
