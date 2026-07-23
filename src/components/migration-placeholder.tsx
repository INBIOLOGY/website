import Link from "next/link";

export function MigrationPlaceholder({ title, route }: { title: string; route: string }) {
  return <main className="placeholder-page"><span className="eyebrow">UI MIGRATION IN PROGRESS</span><h1>{title}</h1><p>โครงหน้าและ shared shell พร้อมแล้ว ส่วนรายละเอียด UI ของ route นี้จะย้ายต่อโดยใช้ mock data เดิม</p><Link href="/courses" className="primary-button">กลับไปดูคอร์สเรียน</Link><small>Route: {route}</small></main>;
}
