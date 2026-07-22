import { useState, useEffect } from 'react';
import { Play, Download, Maximize, Minimize } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function ClassroomPage({ courses, enrolledCourses, activeCourseId, addToast, setPage, notes, setNotes }) {
  const enrolled = courses.filter(c => enrolledCourses.includes(c.id));
  const initialCourse = courses.find(c => c.id === activeCourseId) || enrolled[0] || courses[0];
  const [activeCourse, setActiveCourse] = useState(initialCourse);
  const [activeLesson, setActiveLesson] = useState(initialCourse?.lessons?.[0]);

  useEffect(() => {
    const target = courses.find(c => c.id === activeCourseId);
    if (target) {
      setActiveCourse(target);
      setActiveLesson(target.lessons?.[0]);
    }
  }, [activeCourseId, courses]);

  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tab, setTab] = useState('notes'); // notes, ask-instructor
  const [noteText, setNoteText] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'system', text: 'ส่งคำถามที่คุณสงสัยเกี่ยวกับบทเรียนนี้หา พี่ต้น (ผู้สอน) ได้โดยตรงที่นี่ พี่ต้นจะรีบตอบกลับคุณโดยเร็วที่สุดผ่านช่องทางแจ้งเตือนครับ ✉️' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes(p => [...p, {
      id: Date.now(),
      courseId: activeCourse?.id,
      courseTitle: activeCourse?.title || 'บทเรียน',
      time: activeLesson?.title || 'บทเรียน',
      text: noteText
    }]);
    setNoteText('');
    addToast('📝 บันทึกโน้ตย่อส่วนตัวเรียบร้อยแล้ว', 'success');
  };

  const handleAskInstructor = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatLog(p => [...p, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatLog(p => [...p, { role: 'system', text: '📨 ส่งคำถามถึงพี่ต้น (ผู้สอน) สำเร็จ! กำลังรอผู้สอนเข้ามาตอบคำถาม...' }]);
    }, 400);

    setTimeout(() => {
      let resp = 'ได้รับคำถามเรียบร้อยครับน้อง! ข้อนี้สามารถวิเคราะห์ตามทฤษฎีในคลิปที่แนะนำได้เลย หรือหากต้องการการอธิบายเพิ่มเติมแบบวิดีโอ ทักไลน์พี่ได้เลยครับ!';
      const txt = userMsg.toLowerCase();
      if (txt.includes('เซลล์') || txt.includes('cell')) {
        resp = 'สำหรับข้อนี้: เซลล์คือหน่วยย่อยโครงสร้างพื้นฐานที่เล็กที่สุดของสิ่งมีชีวิต โดยเซลล์ยูคาริโอตจะมีออร์แกเนลล์เด่นชัดที่มีเยื่อหุ้มครับ เช่น นิวเคลียส, ไมโทคอนเดรีย!';
      } else if (txt.includes('dna') || txt.includes('พันธุศาสตร์')) {
        resp = 'สำหรับคำถาม DNA: DNA เป็นโครงสร้างสายคู่บิดเกลียว (Double Helix) ประกอบด้วยน้ำตาลดีออกซีไรโบส หมู่ฟอสเฟต และเบส 4 ชนิด (A-T, C-G) ซึ่งทำหน้าที่ในการเก็บสารพันธุกรรมครับ';
      } else if (txt.includes('พลังงาน') || txt.includes('atp') || txt.includes('ไมโท')) {
        resp = 'สำหรับคำถามเรื่องพลังงานเซลล์: ATP จะถูกผลิตมากที่สุดที่ชั้นเยื่อหุ้มชั้นในของไมโทคอนเดรีย ผ่านกระบวนการถ่ายทอดอิเล็กตรอน (Electron Transport Chain) ครับ!';
      }
      setChatLog(p => [...p, { role: 'instructor', text: `พี่ต้น: ${resp}` }]);
    }, 2000);
  };

  if (enrolled.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: C.navy, fontWeight: 900 }}>คุณยังไม่ได้ซื้อคอร์สเรียนใดๆ</h2>
        <button onClick={() => setPage('courses')} style={{ background: C.sky, color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', marginTop: '10px', cursor: 'pointer' }}>เลือกซื้อคอร์สเรียน</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '80px' }}>
      <div className="classroom-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px', gap: '24px', alignItems: 'start' }}>
        {/* Left Sidebar Chapter List */}
        <aside style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ padding: '16px', background: C.navy, color: 'white' }}>
            <h3 style={{ fontWeight: 900, fontSize: '14px', margin: 0 }}>📚 บทเรียนทั้งหมด</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>{activeCourse?.title}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeCourse?.lessons.map((l, idx) => (
              <button key={l.id} onClick={() => setActiveLesson(l)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', border: 'none',
                borderBottom: '1px solid #F3F4F6', background: l.id === activeLesson?.id ? '#EFF6FF' : 'white', textAlign: 'left', fontFamily: 'inherit'
              }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: l.id === activeLesson?.id ? C.sky : '#F3F4F6', color: l.id === activeLesson?.id ? 'white' : '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: 0 }}>{l.title}</p>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{l.duration} นาที {idx < 2 ? '✅' : '⏳'}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Classroom Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Video Screen Component */}
          <div style={isFullscreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } : { background: 'black', borderRadius: '24px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: isFullscreen ? '80px' : '60px', height: isFullscreen ? '80px' : '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Play size={isFullscreen ? 36 : 24} color="white" fill="white" style={{ marginLeft: '4px', opacity: 0.9 }} />
              </div>
              <p style={{ color: 'white', fontSize: isFullscreen ? '22px' : '14px', fontWeight: 900, marginTop: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{activeLesson?.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: isFullscreen ? '14px' : '11px', marginTop: '4px' }}>ติวเข้มเนื้อหาชีววิทยาแบบครบวงจรกับพี่ต้น</p>
            </div>

            {/* Control bar */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '12px', zIndex: 10, flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Play size={16} fill="white" /></button>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 600 }}>0:00 / {activeLesson?.duration}:00</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Speed selector */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px', borderRadius: '6px' }}>
                  {[0.5, 1, 1.5, 2].map(sp => (
                    <button key={sp} onClick={() => setSpeed(sp)} style={{ background: speed === sp ? C.sky : 'transparent', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>
                      {sp}x
                    </button>
                  ))}
                </div>
                {/* Fullscreen Button */}
                <button onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: C.navy, border: 'none', borderRadius: '6px', padding: '5px 10px', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 800 }}>
                  {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />} {isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มจอ'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick study attachments sheet */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '14px', color: C.navy, margin: '0 0 4px' }}>{activeLesson?.title}</h4>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>ติวทบทวนบทเรียนพร้อมเอกสารดาวน์โหลดฉบับย่อ</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: C.sky, fontSize: '12px', fontWeight: 800, padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #DBEAFE' }}>
                <Download size={14} /> ดาวน์โหลด PDF สรุป
              </a>
              <button onClick={() => setPage('quiz')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.red, color: 'white', fontSize: '12px', fontWeight: 800, padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                📝 ทำควิซประเมินผล
              </button>
            </div>
          </div>

          {/* Interactive study toolbox tab system */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {[
                { id: 'notes', label: '📝 สมุดบันทึกโน้ตย่อ' },
                { id: 'ask-instructor', label: '🙋 ถามคำถามผู้สอน' },
              ].map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                  flex: 1, padding: '14px', border: 'none', background: tab === tb.id ? 'white' : 'transparent',
                  color: tab === tb.id ? C.navy : '#4B5563', fontWeight: 800, fontSize: '12px', cursor: 'pointer',
                  borderBottom: tab === tb.id ? `3px solid ${C.sky}` : 'none', fontFamily: 'inherit'
                }}>
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div style={{ padding: '20px' }}>
              {tab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="จดบันทึกประเด็นสำคัญระหว่างเรียนที่นี่..." rows={3} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', fontSize: '12px', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
                  <button onClick={addNote} style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', alignSelf: 'flex-end' }}>
                    บันทึกโน้ตย่อ
                  </button>
                  {notes.filter(nt => nt.courseId === activeCourse?.id).length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      {notes.filter(nt => nt.courseId === activeCourse?.id).map(nt => (
                        <div key={nt.id} style={{ background: '#F9FAFB', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                          <span style={{ fontWeight: 800, color: C.sky, display: 'block', marginBottom: '2px' }}>{nt.time}</span>
                          <p style={{ margin: 0, color: '#374151' }}>{nt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'ask-instructor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    {chatLog.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: c.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <span style={{
                          background: c.role === 'user' ? C.sky : c.role === 'system' ? '#FEF3C7' : '#E5E7EB',
                          color: c.role === 'user' ? 'white' : c.role === 'system' ? '#92400E' : '#111827',
                          padding: '8px 12px', borderRadius: '12px', fontSize: '12px', maxWidth: '75%', lineHeight: 1.4,
                          border: c.role === 'system' ? '1px solid #FCD34D' : 'none'
                        }}>
                          {c.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAskInstructor} style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" placeholder="พิมพ์คำถามที่ต้องการถามพี่ต้นตรงนี้..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
                    <button type="submit" style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                      ส่งคำถามหาผู้สอน
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
