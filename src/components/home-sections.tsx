"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CourseCard } from "@/components/course-card";
import type { Course } from "@/types/domain";

type Trial = { id: string; title: string; duration: string; course: string; imageUrl: string };
type Review = { name: string; school: string; score: string; text: string; avatar: string };
type Article = { title: string; date: string; views: string; readTime: string };
type Category = readonly [string, string];
type Comment = { id: number; avatar: string; bg: string; username: string; badge: boolean; time: string; text: string };

export function HomeSections({ courses, trials, reviews, articles, categories, comments }: { courses: Course[]; trials: readonly Trial[]; reviews: readonly Review[]; articles: readonly Article[]; categories: readonly Category[]; comments: readonly Comment[] }) {
  const [selected, setSelected] = useState<Course | null>(null);
  return <>
    <section className="home-section categories-section"><div className="section-heading centered"><div><span className="eyebrow">เลือกเส้นทางการเรียน</span><h2>หมวดหมู่เนื้อหาและบทเรียนชีวะ</h2><p>เจาะลึกทุกบทเรียนครอบคลุมตามเกณฑ์สอบใหม่ล่าสุด</p></div></div><div className="category-grid">{categories.map(([emoji, name]) => <Link href="/courses" className="category-card" key={name}><span>{emoji}</span><strong>{name}</strong></Link>)}</div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">แนะนำสำหรับคุณ</span><h2>คอร์สเรียนยอดนิยม</h2><p>คอร์สที่ช่วยวางพื้นฐานและเตรียมสอบอย่างเป็นระบบ</p></div><Link href="/courses" className="text-link">ดูคอร์สทั้งหมด ➜</Link></div><div className="course-grid featured-grid">{courses.slice(0, 4).map((course) => <CourseCard key={course.id} course={course} onDetails={setSelected} />)}</div></section>
    <section className="home-section trials-section"><div className="section-heading"><div><span className="eyebrow">ลองเรียนก่อนตัดสินใจ</span><h2>คลิปทดลองเรียนฟรี</h2><p>เปิดมุมมองใหม่ให้ชีวะเข้าใจง่ายขึ้น</p></div></div><div className="trial-grid">{trials.map((trial) => <article className="trial-card" key={trial.id}><div className="trial-image"><Image src={trial.imageUrl} alt="" width={160} height={145} /><span>{trial.duration}</span></div><div><small>{trial.course}</small><h3>{trial.title}</h3><button>▶ ทดลองเรียนฟรี</button></div></article>)}</div></section>
    <section className="home-section reviews-section"><div className="section-heading centered"><div><span className="eyebrow">เสียงจากนักเรียน</span><h2>เรียนแล้วเข้าใจจริง</h2></div></div><div className="review-grid">{reviews.map((review) => <article className="review-card" key={review.name}><Image src={review.avatar} alt={review.name} width={78} height={78} /><h3>{review.name}</h3><strong>{review.school}</strong><span>{review.score}</span><p>“{review.text}”</p></article>)}</div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">บทความชีววิทยา</span><h2>อ่านสั้นๆ ได้ความรู้</h2></div><Link href="/guide" className="text-link">ดูทั้งหมด ➜</Link></div><div className="article-grid">{articles.map((article) => <article className="article-card" key={article.title}><small>{article.date}</small><h3>{article.title}</h3><div><span>🔍 {article.views} ยอดอ่าน</span><span>⏳ {article.readTime}</span></div></article>)}</div></section>
    <section className="comments-section"><div className="comments-inner"><div className="section-heading"><div><span className="eyebrow">ชุมชน INBIOLOGY</span><h2>💬 การพูดคุยเรียลไทม์</h2><p>แชร์ประสบการณ์และเคล็ดลับการเรียนชีวะกับเพื่อนๆ</p></div><span className="comment-count">{comments.length} ความคิดเห็น</span></div><div className="comments-list">{comments.map((comment) => <article className="comment-item" key={comment.id}><span className="comment-avatar" style={{ backgroundColor: comment.bg }}>{comment.avatar}</span><div><strong>{comment.username} {comment.badge && <small>✓</small>} <time>{comment.time}</time></strong><p>{comment.text}</p></div></article>)}</div><div className="comment-input"><input placeholder="แสดงความคิดเห็นของคุณ..." aria-label="แสดงความคิดเห็น" /><button>ส่งความคิดเห็น</button></div></div></section>
    {selected && <div className="modal-overlay" onClick={() => setSelected(null)}><div className="course-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="ปิดรายละเอียด">✕</button><div className="modal-image"><span>{selected.Category}</span><div>{selected.hours} ชั่วโมงเรียน</div></div><span className="eyebrow">{selected.badge}</span><h2>{selected.title}</h2><p>{selected.description}</p><strong className="modal-price">฿{selected.price.toLocaleString("th-TH")}</strong></div></div>}
  </>;
}
