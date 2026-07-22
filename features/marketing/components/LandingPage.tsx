'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, TrendingUp } from 'lucide-react'
import { C, FREE_TRIALS, CATEGORIES, REVIEWS, ARTICLES } from '@/src/app-data'
import { Modal } from '@/src/ui/feedback/Modal'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { PromoCarousel } from '@/features/marketing/components/PromoCarousel'
import { CourseCard } from '@/features/catalog/components/CourseCard'



// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function LandingPage({ courses, slides, addToast, setPage, enrolledIds, onAddToCart, onViewDetails, onTrial }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, username: '@blvckharrt', hasBadge: true, text: 'ลง IG เรียบร้อย', time: '2 เดือนที่แล้ว', likes: 510, avatar: 'B', color: '#ff5722' },
    { id: 2, username: '@chertamp_st', hasBadge: false, text: 'เพลงช่วยจำของพี่ต้นปั่นจริงครับ แต่ช่วยชีวิตตอนเข้าห้องสอบสุดๆ 😂', time: '1 สัปดาห์ที่แล้ว', likes: 42, avatar: 'C', color: '#e91e63' },
    { id: 3, username: '@pp_patty', hasBadge: false, text: 'ชีวะที่เคยคิดว่ายาก พอลงเรียนกับพี่ต้นแล้วเข้าใจขึ้นเยอะเลยค่ะ ไม่ต้องท่องฝืนๆ อีกต่อไป', time: '3 วันที่แล้ว', likes: 19, avatar: 'P', color: '#9c27b0' },
    { id: 4, username: '@keng_vet', hasBadge: true, text: 'สอวน. ค่าย 1 เจอกันครับ! คอร์ส 100 ข้อ ละเอียดและเฉลยตรงประเด็นดีมาก', time: '5 ชั่วโมงที่แล้ว', likes: 8, avatar: 'K', color: '#3f51b5' }
  ]);

  // Simulated live comment updates
  useEffect(() => {
    const mockFeed = [
      { username: '@nong_ploy', text: 'คอร์ส 99 บาท ราคาดีแต่เนื้อหาจัดเต็มสุดๆ คุ้มเกินราคาไปไกลมากกก 💖', avatar: 'P', color: '#009688' },
      { username: '@nutcha_st', text: 'เรียนสนุกมากกกก ไม่เคยเรียนชีวะแล้วหัวเราะหนักขนาดนี้มาก่อนเลย 5555', avatar: 'N', color: '#4caf50' },
      { username: '@boss_biology', text: 'เนื้อหา A-Level ชีวะปีนี้เน้นวิเคราะห์เยอะมาก ใครยังไม่แม่นแนะนำคอร์สพี่ต้นเลยครับ 👍', avatar: 'B', color: '#ff9800' },
      { username: '@mint_study', text: 'แอดมินตอบคำถามและช่วยเหลือดีมากค่ะ แนะนำช่องทางการจ่ายเงินละเอียดดีมาก', avatar: 'M', color: '#795548' },
      { username: '@ton_fanclub', text: 'อยากได้คอร์สสรุปพันธุศาสตร์เพิ่มจังเลยครับพี่ต้น ยิ่งเรียนยิ่งมันส์!', avatar: 'T', color: '#607d8b' }
    ];

    let feedIndex = 0;
    const interval = setInterval(() => {
      if (feedIndex < mockFeed.length) {
        const comment = mockFeed[feedIndex];
        setComments(prev => [
          {
            id: Date.now(),
            username: comment.username,
            hasBadge: Math.random() > 0.6,
            text: comment.text,
            time: 'เมื่อครู่',
            likes: Math.floor(Math.random() * 5),
            avatar: comment.avatar,
            color: comment.color
          },
          ...prev
        ]);
        feedIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments(prev => [
      {
        id: Date.now(),
        username: '@witsarut.st',
        hasBadge: false,
        text: commentInput,
        time: 'เมื่อครู่',
        likes: 0,
        avatar: 'W',
        color: '#b91c1c'
      },
      ...prev
    ]);
    setCommentInput('');
    addToast('💬 แสดงความคิดเห็นเรียบร้อยแล้ว', 'success');
  };

  return (
    <div style={{ background: C.page, minHeight: '100vh' }}>
      <HeroSection courses={courses} onStart={() => {
        const el = document.getElementById('trial');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else setPage('courses');
      }} onView={() => setPage('courses')} />
      <PromoCarousel slides={slides} courses={courses} onAddToCart={onAddToCart} enrolledIds={enrolledIds} addToast={addToast} onViewDetails={onViewDetails} setPage={setPage} />

      {/* Biology Categories Section */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>🧬 หมวดหมู่เนื้อหาและบทเรียนชีวะ</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontFamily: C.fontBody }}>เจาะลึกบทเรียนครอบคลุมทุกระบบชีววิทยาตามเกณฑ์สอบใหม่ล่าสุด</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} onClick={() => setPage('courses')} style={{
                background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px',
                textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                transition: 'all 0.25s'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(185,28,28,0.08)'; e.currentTarget.style.borderColor = C.navy; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.01)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>{cat.emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: 850, color: C.navy }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Courses Grid */}
      <section style={{ padding: '40px 24px', background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <p style={{ color: C.sky, fontSize: '16px', fontWeight: 850, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color={C.red} /> คอร์สเรียนแนะนำสูงสุด</p>
              <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>คอร์สเรียนชีววิทยาพรีเมียมโดย พี่ต้น</h2>
            </div>
            <button onClick={() => setPage('courses')} style={{
              display: 'flex', alignItems: 'center', gap: '6px', color: C.red, fontSize: '15px', fontWeight: 850,
              cursor: 'pointer', background: 'white', border: `2px solid ${C.red}`, padding: '8px 18px', borderRadius: '999px',
              transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(239,68,68,0.1)'
            }}
              onMouseOver={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = C.red; }}>
              ดูคอร์สทั้งหมด <ChevronRight size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
            {courses.slice(0, 4).map(c => (
              <CourseCard key={c.id} course={c} enrolled={enrolledIds.includes(c.id)} onAddToCart={onAddToCart} onViewDetails={onViewDetails} onTrial={onTrial} />
            ))}
          </div>
        </div>
      </section>

      {/* Trial free lessons */}
      <section id="trial" style={{ padding: '50px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ color: C.red, fontSize: '12px', fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase' }}>▶ Free Video Preview</p>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>คลังวิดีโอและบทเรียนทดลองเรียนฟรี</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {FREE_TRIALS.map(ft => (
              <div key={ft.id} onClick={() => onTrial(ft)} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', transition: 'all 0.25s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}>
                <div style={{ position: 'relative', overflow: 'hidden', height: '180px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                  <img src={ft.imageUrl} alt={ft.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 10px rgba(15,23,42,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', backdropFilter: 'blur(4px)', zIndex: 2 }}>{ft.duration}</div>
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: C.sky, display: 'block', marginBottom: '4px' }}>{ft.course}</span>
                  <h4 style={{ fontWeight: 850, color: C.navy, fontSize: '13px', margin: 0, lineHeight: 1.4 }}>{ft.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Articles */}
      <section style={{ padding: '50px 24px', background: 'white', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>📖 คลังความรู้และสรุปบทความชีวะ</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontFamily: C.fontBody }}>สรุปทริคจำชีววิทยา บทวิเคราะห์แล็บ และข่าวสารวิชาการชีววิทยาที่ห้ามพลาด</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {ARTICLES.map(art => (
              <div key={art.id} onClick={() => setPage('blog')} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', cursor: 'pointer' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: C.sky, display: 'block', marginBottom: '6px' }}>{art.date}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 850, color: C.navy, margin: '0 0 10px', lineHeight: 1.4 }}>{art.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>
                  <span>🔍 {art.views} ยอดอ่าน</span>
                  <span>⏳ ใช้เวลาอ่าน {art.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews from students */}
      <section style={{ padding: '60px 24px', background: C.page, borderTop: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', marginBottom: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 950, color: C.navy, margin: 0 }}>
              ⭐ รีวิวและความประทับใจของน้องๆ รุ่นพี่
            </h2>
            <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '6px', fontFamily: C.fontBody }}>ความรู้สึกจากน้องๆ ที่ร่วมเรียนและประสบความสำเร็จกับพี่ต้น</p>
          </div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {REVIEWS.concat(REVIEWS).concat(REVIEWS).map((r, i) => (
              <div
                key={i}
                className="review-card-container review-card-container-wide"
                onClick={() => setSelectedReview(r)}
                style={{ cursor: 'pointer' }}
              >
                {/* Tan Image Backdrop like Image 1 */}
                <div className="student-image-box">
                  <img src={r.avatar} alt={r.name} loading="lazy" style={{ objectPosition: r.imagePosition || "center top" }} />
                </div>

                {/* Name, School and got into details */}
                <div style={{ textAlign: 'center', marginTop: '14px', width: '100%' }}>
                  <h3 className="review-student-name">
                    {r.name}
                  </h3>
                  <p className="review-school">
                    {r.school}
                  </p>
                  <p className="review-score">
                    {r.score}
                  </p>
                </div>

                {/* Quote review */}
                <p className="review-text-quote" style={{ fontFamily: C.fontBody }}>
                  "{r.text}"
                </p>

                {/* Click pill button */}
                <button
                  className="review-click-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReview(r);
                  }}
                >
                  อ่านต่อ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Review details modal popup */}
        {selectedReview && (
          <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} title={`รีวิวจาก ${selectedReview.name}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', padding: '10px 0' }}>
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#DEC8B3',
                border: '3px solid #B91C1C',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <img src={selectedReview.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: selectedReview.imagePosition || 'center top' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#B91C1C', margin: '0 0 4px', fontSize: '18px', fontWeight: 900 }}>{selectedReview.name}</h3>
                <p style={{ color: '#1E3A8A', fontWeight: 800, fontSize: '13px', margin: '4px 0' }}>{selectedReview.school}</p>
                <span style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: '11px', fontWeight: 850, padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(185,28,28,0.1)', display: 'inline-block', marginTop: '6px' }}>
                  {selectedReview.score}
                </span>
              </div>
              <div style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '20px',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <p style={{ color: '#374151', fontSize: '13.5px', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', fontFamily: C.fontBody }}>
                  "{selectedReview.text}"
                </p>
              </div>
              <div style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#6B7280', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📚 คอร์สเรียน:</span>
                <span style={{ color: '#1E3A8A' }}>{selectedReview.course}</span>
              </div>
            </div>
          </Modal>
        )}
      </section>

      {/* YouTube Style Comments Section */}
      <section style={{ padding: '60px 24px', background: '#0F0F0F', borderTop: '1px solid #1F1F1F', borderBottom: '1px solid #1F1F1F' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #272727', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              💬 การพูดคุยเรียลไทม์ ({comments.length} ความคิดเห็น)
            </h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }}></span> Live Chatting
            </span>
          </div>

          {/* Comment Input Form */}
          <form onSubmit={handlePostComment} className="youtube-input-area" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div className="youtube-avatar" style={{ background: '#b91c1c' }}>W</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="เพิ่มความคิดเห็นสาธารณะ..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="youtube-input"
              />
              {commentInput.trim() && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={() => setCommentInput('')} style={{ background: 'none', border: 'none', color: '#aaaaaa', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px', borderRadius: '18px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>ยกเลิก</button>
                  <button type="submit" className="youtube-comment-btn">แสดงความคิดเห็น</button>
                </div>
              )}
            </div>
          </form>

          {/* Comments Feed List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(commentsExpanded ? comments : comments.slice(0, 3)).map((comment) => (
              <div key={comment.id} className="youtube-comment-item">
                <div className="youtube-avatar" style={{ background: comment.color || '#303030' }}>
                  {comment.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="youtube-username">
                    {comment.username}
                    {comment.hasBadge && (
                      <span className="youtube-username-badge" title="ผู้ใช้ที่ยืนยันแล้ว">✓</span>
                    )}
                    <span className="youtube-time">{comment.time}</span>
                  </div>
                  <p className="youtube-text">{comment.text}</p>
                  <div className="youtube-actions">
                    <button className="youtube-action-btn">
                      <span>👍</span> {comment.likes}
                    </button>
                    <button className="youtube-action-btn">
                      <span>👎</span>
                    </button>
                    <button className="youtube-action-btn" style={{ fontWeight: 'bold' }}>ตอบกลับ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length > 3 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setCommentsExpanded(!commentsExpanded)}
                style={{
                  background: 'none',
                  border: '1px solid #303030',
                  color: '#FFFFFF',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1F1F1F'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {commentsExpanded ? 'ย่อความคิดเห็น' : `ดูความคิดเห็นทั้งหมด (${comments.length} รายการ)`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section like Image 3 but only IG, TikTok, Line */}
      <section style={{ padding: '70px 24px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#111827', margin: 0, fontFamily: C.fontHeading }}>
              ช่องทาง<span style={{ color: '#EC4899', background: 'linear-gradient(to right, #EC4899, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>การติดตาม</span>
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#1E3A8A', marginTop: '8px', letterSpacing: '0.1em' }}>CONNECT WITH US</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Instagram Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Instagram Gradient Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 32 32" style={{ width: '64px', height: '64px' }}>
                  <defs>
                    <radialGradient id="ig-grad-32" cx="30%" cy="107%" r="130%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="32" height="32" rx="7" fill="url(#ig-grad-32)" />
                  <g transform="translate(4, 4)">
                    <rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="18" cy="6" r="1.5" fill="white" />
                  </g>
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://www.instagram.com/inbiology_/" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(220,39,67,0.25)', textAlign: 'center' }}>
                @INBIOLOGY_
              </a>
            </div>

            {/* Line Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Line Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/social_line.png" alt="LINE Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 850, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://line.me/ti/p/@inbiology" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: '#06C755', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(6,199,85,0.25)', textAlign: 'center' }}>
                @INBIOLOGY
              </a>
            </div>

            {/* TikTok Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* TikTok Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#010101' }}>
                  <img src="/social_tiktok.png" alt="TikTok Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.57)' }} />
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 850, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://www.tiktok.com/@tonnarabbit?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: '#010101', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(1,1,1,0.25)', textAlign: 'center' }}>
                @ครูต้นInbiology
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B1329', padding: '48px 24px 24px', color: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <img src="/logo.png" alt="INBIOLOGY Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.2))' }} />
                <span style={{ fontWeight: 900, fontSize: '22px' }}>INBIOLOGY</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.6, margin: 0, fontFamily: C.fontBody }}>
                แพลตฟอร์มติวชีววิทยาออนไลน์อันดับ 1 สำหรับน้องๆ ม.ปลาย และเตรียมตัวสอบเข้ามหาวิทยาลัย สอนโดยพี่ต้น เกียรตินิยมอันดับ 1
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>ช่องทางติดต่อเรา</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}>✉️ inbiology.academy@gmail.com</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}> Line ID: @inbiology</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>นโยบายและสิทธิ์</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}>เงื่อนไขการใช้งานระบบ</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>นโยบายความเป็นส่วนตัว</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>© 2026 INBIOLOGY Academy (by พี่ต้น). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
