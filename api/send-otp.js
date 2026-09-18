// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — Vercel Serverless Function: Send Email OTP
// ─────────────────────────────────────────────────────────────────────────────
// This function sends a 6-digit verification code to the student's email
// using the Resend API (https://resend.com - Free 3,000 emails/month).
//
// 📌 วิธีตั้งค่า Environment Variable บน Vercel:
// 1. ไปที่ https://resend.com → สร้าง API Key (ได้สตริง เช่น re_123456789)
// 2. ไปที่ https://vercel.com → เลือกโปรเจกต์ของคุณ
// 3. Settings → Environment Variables → Add:
//    - Key: RESEND_API_KEY
//    - Value: (API Key จาก Resend)
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Setup CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otpCode, nickname } = req.body || {};

  if (!email || !otpCode) {
    return res.status(400).json({ error: 'Missing email or otpCode parameter' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  // Fallback if not configured in Vercel yet
  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not configured. Running in simulated demo mode.');
    return res.status(200).json({
      success: true,
      mode: 'demo',
      message: 'จำลองการส่งรหัส OTP สำเร็จ (ยังไม่ได้ตั้งค่า RESEND_API_KEY บน Vercel)',
      otpCode: otpCode
    });
  }

  try {
    const studentName = nickname ? `น้อง${nickname}` : 'นักเรียน';
    
    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'INBIOLOGY Academy <onboarding@resend.dev>', // หรือใช้โดเมนที่คุณยืนยันใน Resend เช่น noreply@inbiology.com
        to: [email],
        subject: `[INBIOLOGY] รหัสยืนยันการสมัครสมาชิกของคุณคือ ${otpCode}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #0F172A; }
              .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; }
              .header-bar { height: 6px; background: linear-gradient(90deg, #B91C1C 0%, #EF4444 50%, #1E3A8A 100%); }
              .content { padding: 36px 32px; text-align: center; }
              .logo { height: 48px; margin-bottom: 16px; }
              .title { font-size: 22px; font-weight: bold; color: #0F172A; margin: 0 0 8px; }
              .desc { font-size: 14px; color: #64748B; margin: 0 0 24px; line-height: 1.6; }
              .otp-box { background: #EFF6FF; border: 2px dashed #3B82F6; border-radius: 14px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px; }
              .otp-code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1E3A8A; margin: 0; }
              .warning { font-size: 12px; color: #DC2626; background: #FEF2F2; padding: 10px; border-radius: 8px; margin-bottom: 24px; }
              .footer { font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 16px; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header-bar"></div>
              <div class="content">
                <h1 class="title">ยืนยันอีเมลสมัครสมาชิก</h1>
                <p class="desc">สวัสดีครับ <strong>${studentName}</strong> ยินดีต้อนรับสู่ INBIOLOGY Academy เพื่อความปลอดภัยของบัญชี กรุณานำรหัส OTP ด้านล่างนี้ไปกรอกในหน้าเว็บไซต์:</p>
                
                <div class="otp-box">
                  <div class="otp-code">${otpCode}</div>
                </div>
                
                <div class="warning">
                  ⚠️ รหัสนี้มีอายุการใช้งาน <strong>5 นาที</strong> และใช้ได้เพียงครั้งเดียว ห้ามเปิดเผยรหัสนี้แก่ผู้อื่น
                </div>
                
                <div class="footer">
                  หากคุณไม่ได้ทำรายการนี้ สามารถเพิกเฉยต่ออีเมลฉบับนี้ได้<br>
                  © 2026 INBIOLOGY Academy by พี่ต้น. All rights reserved.
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email via Resend' });
    }

    return res.status(200).json({
      success: true,
      message: 'ส่งรหัส OTP ไปยังอีเมลเรียบร้อยแล้ว',
      id: data.id
    });

  } catch (error) {
    console.error('Server error sending OTP:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
