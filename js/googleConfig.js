// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — GOOGLE SIGN-IN CONFIGURATION (Google Identity Services)
// ─────────────────────────────────────────────────────────────────────────────
//
// ✅ ไม่ต้องใช้ Firebase! ใช้ Google Identity Services โดยตรง (ฟรี 100%)
// ✅ เมื่อยังไม่ได้ใส่ Client ID ระบบจะทำงานใน Demo Mode อัตโนมัติ
//
// 📌 วิธีสมัคร Google Client ID (5 นาที ฟรี 100%):
// 1. ไปที่ https://console.cloud.google.com/
// 2. เลือกหรือสร้าง Project ใหม่ (ชื่อ เช่น "INBIOLOGY Academy")
// 3. เมนูซ้าย → APIs & Services → Credentials
// 4. กด "+ CREATE CREDENTIALS" → เลือก "OAuth client ID"
// 5. Application type: "Web application"
// 6. Authorized JavaScript origins — ใส่ทั้ง 2 บรรทัด:
//    - https://inbiology-official.vercel.app
//    - http://localhost:62144
// 7. Authorized redirect URIs — ไม่จำเป็นต้องใส่ (ไม่ได้ใช้ redirect)
// 8. กด CREATE → คัดลอก "Client ID" มาวางที่ googleClientId ด้านล่าง
//    (ตัวอย่างรูปแบบ: 123456789-abc...xyz.apps.googleusercontent.com)

window.GOOGLE_CONFIG = {
  googleClientId: '',   // ← วาง Client ID ของคุณที่นี่
  googleOneTap: true    // true = แสดง One Tap popup อัตโนมัติ, false = ปุ่มอย่างเดียว
};

window.isGoogleConfigured = function() {
  const cfg = window.GOOGLE_CONFIG;
  return Boolean(cfg && cfg.googleClientId && cfg.googleClientId.trim() !== '');
};
