/**
 * Vercel Serverless Function to dispatch real verification OTP emails directly to recipient
 * via Brevo (formerly Sendinblue) Transactional REST API
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
    const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY || process.env.VITE_BREVO_API_KEY || '';

    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'BREVO_API_KEY is not configured in Vercel Environment Variables.' 
      });
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { 
          name: 'TripTools', 
          email: 'bharathkumarelango02@gmail.com' 
        },
        to: [
          { 
            email: cleanEmail, 
            name: recipientName 
          }
        ],
        subject: `TripTools verification code: ${otpCode}`,
        textContent: `Hello ${recipientName},\n\nYour TripTools verification code is: ${otpCode}\n\nThis code will expire in 15 minutes.\n\nTripTools Team`,
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
            <div style="background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 800;">TripTools Login Verification</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 12px 0 20px;">
                Hello <strong>${recipientName}</strong>,<br>Use the 6-digit one-time code below to sign in:
              </p>
              <div style="display: inline-block; background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 14px 28px; margin: 8px 0 20px;">
                <span style="font-size: 30px; font-weight: 900; letter-spacing: 6px; color: #16a34a; font-family: monospace;">${otpCode}</span>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 16px 0 0;">
                Valid for 15 minutes. If you did not request this, you can safely ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 16px; color: #94a3b8; font-size: 11px;">
              TripTools • Secure Cloud Verification
            </div>
          </div>
        `
      })
    });

    const data = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('Brevo API Error:', data);
      return res.status(brevoResponse.status).json({ 
        success: false, 
        error: data.message || 'Brevo API dispatch failed' 
      });
    }

    return res.status(200).json({
      success: true,
      messageId: data.messageId,
      message: 'OTP delivered directly to primary inbox via Brevo'
    });
  } catch (err) {
    console.error('Serverless send-otp error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error sending email' });
  }
}
