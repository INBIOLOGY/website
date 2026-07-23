"use client";
import { useState } from "react";

export function ClassroomView() {
  const course = { title: "คอร์สเรียนของฉัน" };
  const lessonOptions = [{ id: "lesson-1", title: "บทนำชีววิทยาและเคมีพื้นฐาน", duration: 28 }, { id: "lesson-2", title: "โครงสร้างและหน้าที่ของเซลล์", duration: 35 }, { id: "lesson-3", title: "การลำเลียงสารผ่านเซลล์", duration: 31 }];
  const [lesson, setLesson] = useState(lessonOptions[0]);
  const [tab, setTab] = useState("notes");
  return <main className="classroom-page"><div className="classroom-heading"><span className="eyebrow">MY ENROLLED COURSES</span><h1>ห้องเรียนออนไลน์</h1><p>เรียนรู้ตามจังหวะของคุณ พร้อมเครื่องมือช่วยจำครบครัน</p></div><div className="classroom-grid"><aside className="lesson-sidebar"><div className="lesson-header"><h2>บทเรียนทั้งหมด</h2><p>{course.title}</p></div>{lessonOptions.map((item, index) => <button key={item.id} className={lesson.id === item.id ? "selected" : ""} onClick={() => setLesson(item)}><span>{index + 1}</span><div><strong>{item.title}</strong><small>{item.duration} นาที</small></div></button>)}</aside><section className="lesson-content"><div className="video-placeholder"><div className="play-circle">▶</div><p>{lesson.title}</p><small>Video preview · {lesson.duration} นาที</small></div><div className="study-tools"><nav><button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>📝 จดโน้ต</button><button className={tab === "ask" ? "active" : ""} onClick={() => setTab("ask")}>💬 ถามผู้สอน</button></nav><div className="tool-panel">{tab === "notes" ? <textarea placeholder="จดสิ่งที่ได้เรียนรู้จากบทนี้..." rows={4} /> : <><p>มีคำถามเกี่ยวกับบทเรียนนี้ไหม?</p><textarea placeholder="พิมพ์คำถามของคุณ..." rows={4} /></>}<button className="primary-button">{tab === "notes" ? "บันทึกโน้ต" : "ส่งคำถาม"}</button></div></div></section></div></main>;
}
