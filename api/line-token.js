// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — Vercel Serverless Function: LINE Token Exchange
// ─────────────────────────────────────────────────────────────────────────────
// This function keeps the LINE Channel Secret secure on the server side.
// Client-side code sends the authorization code here, and we exchange it
// for tokens with LINE's API, then return only the safe user data.
//
// 📌 วิธีตั้งค่า Environment Variables ใน Vercel:
// 1. ไปที่ https://vercel.com/ → เลือก project inbiology-official
// 2. Settings → Environment Variables → Add:
//    - LINE_CHANNEL_ID    = (Channel ID จาก LINE Developers)
//    - LINE_CHANNEL_SECRET = (Channel Secret จาก LINE Developers)
// 3. Redeploy โปรเจกต์

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://inbiology-official.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirectUri } = req.body || {};

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'invalid_request', error_description: 'Missing code or redirectUri' });
  }

  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelId || !channelSecret) {
    return res.status(503).json({ error: 'not_configured', error_description: 'LINE credentials not set in environment' });
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      return res.status(400).json({
        error: tokenData.error || 'token_exchange_failed',
        error_description: tokenData.error_description || 'Failed to exchange code for tokens'
      });
    }

    // Optionally verify the ID token (recommended in production)
    // For now, return the tokens to the client to decode
    return res.status(200).json({
      access_token: tokenData.access_token,
      id_token: tokenData.id_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope
    });

  } catch (err) {
    console.error('LINE token exchange error:', err);
    return res.status(500).json({ error: 'server_error', error_description: err.message });
  }
}
