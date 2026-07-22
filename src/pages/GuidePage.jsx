import { ChevronLeft } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function GuidePage({ setPage }) {
  const sections = [
    {
      icon: '🏠', title: 'หน้าแรก (Landing Page)',
      desc: 'หน้าแรกของ INBIOLOGY แสดงคอร์สแนะนำ, ตัวอย่างบทเรียนฟรี, บทความ, และรีวิวจากนักเรียน กดปุ่ม "เริ่มเรียนฟรี" เพื่อเลื่อนไปยังส่วนวิดีโอทดลองเรียนได้เลย',
      steps: ['กดปุ่ม "เริ่มเรียนฟรี" → เลื่อนดูวิดีโอตัวอย่างบทเรียนฟรี', 'กดปุ่ม "ดูคอร์สทั้งหมด" → ไปยังหน้าคอร์สเรียน', 'คลิกที่บัตรคอร์สเพื่อดูรายละเอียดคอร์สนั้น']
    },
    {
      icon: '📚', title: 'คอร์สเรียน',
      desc: 'คลังคอร์สชีววิทยาทั้งหมด มีตัวกรอง ค้นหาคอร์สได้ตามระดับ/หัวข้อ',
      steps: ['กดที่บัตรคอร์ส → ดูรายละเอียดเนื้อหาบทเรียน', 'กดปุ่ม "เพิ่มลงตะกร้า" → ไปกดชำระเงินในไอคอนตะกร้า (มุมขวาบน)', 'กดปุ่ม "ทดลองเรียนฟรี" → ดูวิดีโอตัวอย่างของคอร์สนั้น']
    },
    {
      icon: '🎓', title: 'ห้องเรียนจำลอง (Classroom)',
      desc: 'เรียนบทเรียนพร้อมวิดีโอ, จดบันทึกโน้ตย่อ, ถาม AI Biologist, และดูสรุป 3D Model',
      steps: ['เลือกบทเรียนจากแถบซ้าย → วิดีโอจะเปลี่ยนอัตโนมัติ', 'กดแท็บ "📝 โน้ตย่อ" → พิมพ์จดโน้ตแล้วกด บันทึกโน้ตย่อ', 'กดแท็บ "AI Biologist" → ถามคำถามชีวะได้เลย', 'โน้ตที่จดจะซิงค์ไปยัง Dashboard → แท็บ "สมุดบันทึก"']
    },
    {
      icon: '🏆', title: 'คลังข้อสอบ (Exam Center)',
      desc: 'ทำข้อสอบจำลองชีววิทยา A-Level พร้อมระบบนับเวลา 2 นาที',
      steps: ['กดปุ่ม "เริ่มทำข้อสอบ" → ระบบนับถอยหลัง 120 วินาที', 'เลือกคำตอบจากตัวเลือก ABCD → กดส่งเมื่อครบ', 'ระบบจะแสดงคะแนนและเฉลยคำตอบที่ถูกต้อง']
    },
    {
      icon: '👤', title: 'แดชบอร์ดนักเรียน',
      desc: 'ดูความก้าวหน้า, โน้ตย่อสะสม, และศูนย์ช่วยเหลือส่วนตัว',
      steps: ['แท็บ "คอร์สเรียนของฉัน" → ดูคอร์สที่ซื้อและความก้าวหน้า', 'แท็บ "สมุดบันทึกโน้ตย่อ" → ดูโน้ตที่จดจากห้องเรียน', 'แท็บ "ศูนย์ช่วยเหลือ FAQ" → คำถามที่พบบ่อยและช่องทางติดต่อ']
    },
    {
      icon: '🛒', title: 'ตะกร้าและชำระเงิน',
      desc: 'เพิ่มคอร์สลงตะกร้าและชำระผ่านระบบ PromptPay',
      steps: ['กดไอคอน 🛒 บนแถบบน → เปิด Drawer ตะกร้า', 'พิมพ์โค้ดคูปองแล้วกด ใช้คูปอง (ตัวอย่าง: INBIOLOGY100)', 'กดปุ่ม ดำเนินการชำระเงิน → กดยืนยันการชำระ']
    },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '100px', paddingBottom: '60px', background: C.page }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setPage('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
            onMouseOver={e => e.currentTarget.style.color = '#374151'}
            onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
            <ChevronLeft size={15} /> กลับหน้าหลัก
          </button>
          <h1 style={{ fontSize: '30px', fontWeight: 950, color: C.navy, margin: '0 0 8px', lineHeight: 1.1 }}>📖 คู่มือการใช้งาน INBIOLOGY</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0, fontFamily: C.fontBody }}>เรียนรู้วิธีใช้ระบบ INBIOLOGY Academy อย่างมืออาชีพตั้งแต่ต้น</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: C.navy, margin: 0 }}>{s.title}</h2>
              </div>
              <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 12px', fontFamily: C.fontBody, lineHeight: 1.7 }}>{s.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {s.steps.map((step, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: C.navy, color: 'white', fontSize: '10px', fontWeight: 900, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{j + 1}</span>
                    <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.6, fontFamily: C.fontBody }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.sky})`, borderRadius: '20px', padding: '28px', textAlign: 'center', color: 'white', marginTop: '24px' }}>
          <h3 style={{ fontWeight: 900, fontSize: '16px', margin: '0 0 8px' }}>🤝 ยังมีข้อสงสัยเพิ่มเติม?</h3>
          <p style={{ fontSize: '13px', margin: '0 0 16px', opacity: 0.8, fontFamily: C.fontBody }}>ติดต่อพี่ต้นได้โดยตรงผ่านช่องทางด้านล่าง</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ l: 'LINE: @inbiologylogy', c: '#10B981' }, { l: 'Facebook: /inbiologylogy', c: '#3B82F6' }].map(b => (
              <span key={b.l} style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>{b.l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
