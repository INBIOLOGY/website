// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — Vercel Serverless Function: Google Sheets Auto-Sync Bridge
// ─────────────────────────────────────────────────────────────────────────────
// Forwards approved orders or batch order data to the Google Apps Script Webhook.
// Avoids browser CORS and follows Google Apps Script 302 redirects automatically.
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { webhookUrl, action, order, orders, testMessage } = req.body || {};

    if (!webhookUrl || typeof webhookUrl !== 'string' || !webhookUrl.startsWith('https://script.google.com/')) {
      return res.status(400).json({
        error: 'Invalid or missing Google Apps Script webhook URL. It must start with https://script.google.com/'
      });
    }

    const payload = {
      action: action || 'order_approved',
      order: order || null,
      orders: orders || null,
      testMessage: testMessage || null,
      timestamp: new Date().toISOString()
    };

    // Post to Google Apps Script (Node.js fetch follows 302 redirects automatically)
    const scriptResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await scriptResponse.text();
    let parsedResult = null;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      parsedResult = { raw: responseText };
    }

    return res.status(200).json({
      success: scriptResponse.ok,
      status: scriptResponse.status,
      result: parsedResult
    });
  } catch (err) {
    console.error('Google Sheets sync bridge error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to sync with Google Sheets'
    });
  }
}
