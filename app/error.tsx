'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="app-status-page" role="alert">
      <h1>ระบบเกิดข้อผิดพลาด</h1>
      <p>กรุณาลองใหม่อีกครั้ง</p>
      <button type="button" onClick={reset}>ลองใหม่</button>
    </main>
  )
}
