"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import type { Course } from "@/types/domain";

export function CoursesView({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("ทั้งหมด");
  const [selected, setSelected] = useState<Course | null>(null);
  const filtered = useMemo(() => courses.filter((course) => `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase()) && (level === "ทั้งหมด" || course.Level === level)), [courses, level, query]);
  return <><section className="catalog-shell"><aside className="catalog-sidebar"><div className="sidebar-title">🔍 ค้นหาบทเรียน</div><label className="sidebar-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="พิมพ์ชื่อคอร์สหรือคีย์เวิร์ด..." /></label><div className="sidebar-title level-title">ระดับชั้นเรียน</div><div className="level-options">{["ทั้งหมด", "ม.4", "ม.5", "ม.6", "ติวสอบ"].map((item) => <label key={item}><input type="radio" name="level" checked={level === item} onChange={() => setLevel(item)} />{item === "ทั้งหมด" ? "ทุกระดับชั้น" : item === "ติวสอบ" ? "ติวสอบ (A-Level / สอวน.)" : item}</label>)}</div></aside><div className="catalog-main"><div className="catalog-toolbar"><div><h2>คอร์สเรียนชีววิทยา</h2><p>พบคอร์สเรียนชีววิทยา {filtered.length} คอร์ส</p></div><select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="กรองระดับชั้น"><option>ทั้งหมด</option><option>ม.4</option><option>ม.5</option><option>ม.6</option><option>ติวสอบ</option></select></div>{filtered.length === 0 ? <div className="empty-panel">ไม่พบคอร์สที่ตรงกับการค้นหา</div> : <div className="course-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} onDetails={setSelected} />)}</div>}</div></section>{selected && <div className="modal-overlay" onClick={() => setSelected(null)}><div className="course-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="ปิดรายละเอียด">✕</button><div className="modal-image"><span>{selected.Category}</span><div>{selected.hours} ชั่วโมงเรียน</div></div><span className="eyebrow">{selected.badge}</span><h2>{selected.title}</h2><p>{selected.description}</p><strong className="modal-price">฿{selected.price.toLocaleString("th-TH")}</strong></div></div>}</>;
}
