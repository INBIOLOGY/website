// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — FIREBASE CLOUD CONFIGURATION & SETUP GUIDE
// ─────────────────────────────────────────────────────────────────────────────
//
// หากยังไม่ได้ใส่ค่าจริง ระบบจะทำงานในโหมด Graceful Fallback (Mock Engine ในเบราว์เซอร์) อัตโนมัติ
// เว็บไซต์จะยังคงทดสอบและใช้งานได้ 100% โดยไม่มีข้อผิดพลาด
//
// 📌 วิธีเปิดใช้งานระบบคลาวด์จริง (ฟรี 100%):
// 1. ไปที่ https://console.firebase.google.com/
// 2. ล็อกอินด้วยบัญชี Google แล้วกด "Add project" (ตั้งชื่อเช่น inbiology-academy)
// 3. ในหน้า Project Overview กดไอคอนเว็บ </ > เพื่อลงทะเบียน Web App
// 4. คัดลอกค่า firebaseConfig มาวางแทนที่เครื่องหมายคำพูดว่างเปล่าด้านล่างนี้:
// 5. ที่เมนู Authentication > Sign-in method: กดเปิดใช้งาน "Email/Password" และ "Google"
// 6. ที่เมนู Firestore Database: กด "Create database" เลือก Start in test mode หรือ production mode

window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Helper ตรวจสอบว่าใส่ Config พร้อมใช้งานบนคลาวด์จริงแล้วหรือไม่
window.isFirebaseConfigured = function() {
  const cfg = window.FIREBASE_CONFIG;
  return Boolean(cfg && cfg.apiKey && cfg.apiKey.trim() !== "" && cfg.projectId && cfg.projectId.trim() !== "");
};
