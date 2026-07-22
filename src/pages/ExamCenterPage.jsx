import { useState, useRef, useEffect } from 'react';
import { Award } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function ExamCenterPage({ addToast, setPage }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [seconds, setSeconds] = useState(120);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const questions = [
    { id: 1, q: '1. ออร์แกเนลล์ใดทำหน้าที่เป็นโรงไฟฟ้าหลักในการผลิต ATP ให้แก่เซลล์?', a: 'ไมโทคอนเดรีย', opts: ['คลอโรพลาสต์', 'ไมโทคอนเดรีย', 'กอลจิบอดี', 'ไลโซโซม'] },
    { id: 2, q: '2. กระบวนการใดพบการแบ่งนิวเคลียสแบบลดจำนวนโครโมโซมลงครึ่งหนึ่ง?', a: 'Meiosis', opts: ['Mitosis', 'Meiosis', 'Binary Fission', 'Budding'] },
    { id: 3, q: '3. ข้อใดคือคู่เบสที่ถูกต้องในโครงสร้างเกลียวคู่ของ DNA?', a: 'A คู่กับ T, G คู่กับ C', opts: ['A คู่กับ U, G คู่กับ C', 'A คู่กับ G, T คู่กับ C', 'A คู่กับ T, G คู่กับ C', 'A คู่กับ C, T คู่กับ G'] }
  ];

  useEffect(() => {
    if (!started || score !== null) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(t);
          submitExam();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, score]);

  const submitExam = () => {
    let pts = 0;
    questions.forEach(q => {
      if (answersRef.current[q.id] === q.a) pts++;
    });
    setScore(pts);
    addToast('🎉 ทำข้อสอบเสร็จเรียบร้อย! ประกาศผลคะแนนแล้ว', 'success');
  };

  const minutes = Math.floor(seconds / 60);
  const remSecs = seconds % 60;

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
        {!started ? (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
            <Award size={48} color={C.sky} style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontWeight: 900, color: C.navy, fontSize: '22px', margin: '0 0 8px' }}>Mock Exam: คลังข้อสอบจำลองชีววิทยา</h2>
            <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px', fontFamily: C.fontBody }}>
              ข้อสอบจำลองมีจำนวน 3 ข้อ เวลาในการทำสอบ 2:00 นาที <br />หลังทำสอบระบบจะประเมินคะแนนและจุดอ่อนให้ทันที
            </p>
            <button onClick={() => setStarted(true)} style={{ background: C.red, color: 'white', fontWeight: 800, fontSize: '14px', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: `0 6px 20px rgba(239,68,68,0.3)` }}>
              เริ่มทำข้อสอบเลย
            </button>
          </div>
        ) : score !== null ? (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Award size={48} color="#10B981" style={{ margin: '0 auto' }} />
            <h2 style={{ fontWeight: 900, color: C.navy, fontSize: '24px', margin: 0 }}>ประเมินผลคะแนนสอบ</h2>
            <div style={{ fontSize: '48px', fontWeight: 950, color: C.sky }}>{score} / 3 คะแนน</div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.6, fontFamily: C.fontBody }}>
              {score === 3 ? 'เยี่ยมยอดมาก! คุณมีจุดแข็งในเรื่องโครงสร้างเซลล์และพันธุศาสตร์' : 'ควรทบทวนเรื่องการแบ่งเซลล์และการจับคู่เบสเพิ่มเติมนะครับ'}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => { setStarted(false); setScore(null); setAnswers({}); setSeconds(120); }} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px', fontSize: '12px', fontWeight: 800, background: 'none', cursor: 'pointer' }}>
                ทำสอบใหม่อีกครั้ง
              </button>
              <button onClick={() => setPage('dashboard')} style={{ flex: 1, background: C.navy, color: 'white', borderRadius: '10px', padding: '12px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                กลับไปยัง Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', color: C.navy }}>แบบทดสอบชีววิทยาหลัก</span>
              <span style={{ background: '#FEF2F2', color: C.red, fontSize: '13px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px' }}>
                ⏱️ เวลาคงเหลือ {minutes}:{remSecs < 10 ? '0' + remSecs : remSecs}
              </span>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map(q => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontWeight: 800, fontSize: '13px', color: '#374151', margin: 0 }}>{q.q}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {q.opts.map(o => (
                      <button key={o} onClick={() => setAnswers(p => ({ ...p, [q.id]: o }))} style={{
                        padding: '10px', borderRadius: '8px', border: `1.5px solid ${answers[q.id] === o ? C.sky : '#E5E7EB'}`,
                        background: answers[q.id] === o ? '#EFF6FF' : 'white', fontSize: '12px', fontWeight: 700,
                        color: '#374151', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit'
                      }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={submitExam} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
              ส่งกระดาษคำตอบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
