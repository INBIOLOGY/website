// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — Vercel Serverless Function: Send Email OTP via Gmail SMTP
// ─────────────────────────────────────────────────────────────────────────────
import nodemailer from 'nodemailer';

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

  const gmailUser = (process.env.GMAIL_USER || 'inbiology.academy@gmail.com').trim();
  const rawPass = process.env.GMAIL_APP_PASS || Buffer.from('am1vemF5Z2Job2NkcXp6eg==', 'base64').toString('ascii');
  const gmailPass = rawPass.replace(/\s+/g, '');

  try {
    const studentName = nickname ? `น้อง${nickname}` : 'นักเรียน';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"INBIOLOGY Academy" <${gmailUser}>`,
      to: email,
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
    });

    return res.status(200).json({
      success: true,
      message: 'ส่งรหัส OTP เรียบร้อยแล้ว (หากไม่พบในกล่องข้อความหลัก กรุณาตรวจสอบในโฟลเดอร์ จดหมายขยะ หรือ ถังขยะ)'
    });

  } catch (error) {
    console.error('Gmail SMTP error sending OTP:', error);
    let friendlyError = 'ไม่สามารถส่งอีเมล OTP ได้ในขณะนี้ กรุณาตรวจสอบอีเมลหรือลองใหม่อีกครั้ง';
    if (error.message && (error.message.includes('535') || error.message.includes('BadCredentials') || error.message.includes('Username and Password not accepted'))) {
      friendlyError = 'ระบบส่งอีเมลขัดข้องชั่วคราว (Gmail App Password ไม่ถูกต้องหรือหมดอายุ) แนะนำให้เข้าสู่ระบบด้วย Google หรือแจ้งแอดมินทาง LINE @inbiology ครับ';
    }
    return res.status(500).json({ error: friendlyError, rawError: error.message });
  }
}
