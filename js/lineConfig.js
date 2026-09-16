// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — LINE LOGIN CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
//
// ถ้ายังไม่ได้ใส่ Channel ID ระบบจะทำงานใน Demo Mode อัตโนมัติ
// เว็บไซต์จะยังคงใช้งานได้ 100% โดยปุ่ม LINE จะแสดง dialog แนะนำการตั้งค่า
//
// 📌 วิธีเปิดใช้งาน LINE Login จริง (ฟรี 100%):
// 1. ไปที่ https://developers.line.biz/ → Login ด้วยบัญชี LINE ของคุณ
// 2. กด "Create a new provider" → ตั้งชื่อ เช่น "INBIOLOGY Academy"
// 3. กด "Create a new channel" → เลือก "LINE Login"
// 4. Channel name: "INBIOLOGY Academy", Channel type: Web app
// 5. คัดลอก "Channel ID" (ตัวเลข 10 หลัก) มาวางด้านล่าง
// 6. ที่เมนู "LINE Login" tab: ใส่ Callback URL ดังนี้:
//    - สำหรับ Production: https://inbiology-official.vercel.app/line-callback.html
//    - สำหรับ Local Dev: http://localhost:62144/line-callback.html
//    (สามารถใส่ได้หลาย URL แยกด้วยบรรทัดใหม่)
// 7. กด Publish channel
// 8. วาง Channel ID ที่ lineChannelId ด้านล่าง

window.LINE_CONFIG = {
  lineChannelId: '',          // ใส่ Channel ID ที่นี่ เช่น '2006789012'
  lineCallbackUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:62144/line-callback.html'
    : 'https://inbiology-official.vercel.app/line-callback.html',
  lineScope: 'profile openid email'
};

window.isLineConfigured = function() {
  const cfg = window.LINE_CONFIG;
  return Boolean(cfg && cfg.lineChannelId && cfg.lineChannelId.trim() !== '');
};
