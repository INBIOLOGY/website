import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="app-status-page">
      <h1>ไม่พบหน้าที่ต้องการ</h1>
      <Link href="/">กลับหน้าหลัก</Link>
    </main>
  )
}
