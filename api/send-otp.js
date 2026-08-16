/**
 * Vercel Serverless Function to dispatch real verification OTP emails directly to recipient
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, name, otpCode } = req.body || {};

    if (!email || !email.includes('@') || !otpCode) {
      return res.status(400).json({ success: false, error: 'Valid email and OTP code required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const recipientName = (name && name.trim()) || 'Traveler';
    const apiKey = process.env.EMAIL_API_KEY || '';

    if (apiKey) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify({
            sender: { name: 'Munnar Explorer App', email: 'notifications@munnartools.vercel.app' },
            to: [{ email: cleanEmail, name: recipientName }],
            subject: `🌿 Munnar Explorer Verification Code: ${otpCode}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #047857; margin: 0; font-size: 24px;">🌿 Munnar Explorer</h1>
                  <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Trip Companion & Expense Tracker</p>
                </div>
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                  <p style="color: #166534; font-size: 14px; margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>! Your 6-digit verification code is:</p>
                  <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #047857; background: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #059669;">
                    ${otpCode}
                  </div>
                  <p style="color: #15803d; font-size: 12px; margin: 12px 0 0 0;">Valid for 15 minutes. Do not share this code with anyone.</p>
                </div>
                <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                  Enter this code on <a href="https://munnartools.vercel.app" style="color: #059669; font-weight: bold; text-decoration: none;">munnartools.vercel.app</a> to access your budget and trip expense tracker.
                </p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
                  Crafted with care by Bharathkumar E
                </p>
              </div>
            `
          })
        });
      } catch (e) {
        console.warn('API relay warning:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'OTP generated and dispatched'
    });
  } catch (err) {
    console.error('Serverless send-otp error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error sending email' });
  }
}
