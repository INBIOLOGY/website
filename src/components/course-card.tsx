"use client";

import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import type { Course } from "@/types/domain";

export function CourseCard({ course, onDetails }: { course: Course; onDetails: (course: Course) => void }) {
  const { addItem, items } = useCart();
  const enrolled = course.id === "bio-intensive-1";
  const inCart = items.some((item) => item.id === course.id);
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  return <article className="course-card"><div className="course-thumbnail"><Image src={course.imageUrl} alt={course.title} width={180} height={155} className="course-cover" /><span className="course-badge" style={{ backgroundColor: course.badgeBg }}>{course.badge}</span><span className="course-duration">{course.hours} ชั่วโมงเรียน</span></div><div className="course-body"><div className="course-meta"><span style={{ backgroundColor: course.tagBg, color: course.tagColor }}>{course.tag}</span><small>{course.Level}</small></div><button className="course-title" onClick={() => onDetails(course)}>{course.title}</button><p className="course-instructor">ผู้สอน: {course.instructor}</p><div className="course-rating"><span>⭐ {course.rating} <em>({course.reviewCount})</em></span><strong>{course.hours} ชั่วโมงเรียน</strong></div><p className="course-description">{course.description}</p><div className="course-footer"><div><del>฿{course.originalPrice.toLocaleString("th-TH")}</del><div className="sale-price">฿{course.price.toLocaleString("th-TH")} <b>-{discount}%</b></div></div><div className="course-actions"><button onClick={() => onDetails(course)}>รายละเอียด</button><button className="buy-button" onClick={() => addItem(course)} disabled={enrolled || inCart}>{enrolled ? "✓ เรียนเลย" : inCart ? "เพิ่มแล้ว" : "🛒 ชำระเงิน"}</button></div></div></div></article>;
}
