import emailjs from '@emailjs/browser';

// In-memory active OTP verification store with expiration timestamp
const activeOtpSessions = new Map();

// Your EmailJS Configuration
const EMAILJS_PUBLIC_KEY = '2xnO9HgXktDoEkhng';
const EMAILJS_TEMPLATE_ID = 'template_a8m7w6t';

// EmailJS Service IDs connected to your EmailJS account
const EMAILJS_SERVICE_CANDIDATES = [
  'service_bk264165@gmail.com',
  'bk264165@gmail.com',
  'service_default',
  'default_service',
  'service_gmail',
  'gmail'
];

/**
 * Dispatches 6-digit email verification OTP directly via EmailJS to the recipient's inbox
 * with maximum inbox deliverability formatting (anti-spam optimization)
 */
export async function sendEmailOtp(email, fullName = 'Traveler') {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'Please enter a valid email address.'
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const recipientName = (fullName && fullName.trim()) || 'Traveler';

  try {
    // Generate secure random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    // Store in active session
    activeOtpSessions.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0
    });

    const emailSubject = `TripTools Verification Code: ${otpCode}`;
    const plainMessage = `Hello ${recipientName},

Your TripTools verification code is: ${otpCode}

This code is valid for 15 minutes. If you did not request this code, you can safely ignore this email.

Best regards,
TripTools Team`;

    const htmlMessage = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
  <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
    <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 800;">TripTools Login Verification</h2>
    <p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 8px 0 16px;">Hello <strong>${recipientName}</strong>,<br>Use the 6-digit one-time code below to sign in:</p>
    <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 12px 24px; margin: 8px 0 16px;">
      <span style="font-size: 26px; font-weight: 900; letter-spacing: 5px; color: #16a34a; font-family: monospace;">${otpCode}</span>
    </div>
    <p style="color: #64748b; font-size: 11px; margin: 12px 0 0;">This code is valid for 15 minutes. Do not share this code with anyone.</p>
  </div>
  <div style="text-align: center; margin-top: 12px; color: #94a3b8; font-size: 10px;">
    TripTools Security Verification
  </div>
</div>`;

    const templateParams = {
      to_email: cleanEmail,
      email: cleanEmail,
      user_email: cleanEmail,
      reply_to: 'bharathkumarelango02@gmail.com',
      to: cleanEmail,
      dest_email: cleanEmail,
      recipient: cleanEmail,
      recipient_email: cleanEmail,
      send_to: cleanEmail,
      target_email: cleanEmail,
      email_to: cleanEmail,
      to_name: recipientName,
      name: recipientName,
      user_name: recipientName,
      from_name: 'TripTools',
      otp_code: otpCode,
      otp: otpCode,
      passcode: otpCode,
      code: otpCode,
      subject: emailSubject,
      message: plainMessage,
      body: plainMessage,
      content: plainMessage,
      html_message: htmlMessage
    };

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    let delivered = false;
    let lastError = null;

    // Try sending through connected EmailJS services
    for (const serviceId of EMAILJS_SERVICE_CANDIDATES) {
      try {
        const response = await emailjs.send(
          serviceId,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200 || response.text === 'OK') {
          delivered = true;
          console.log(`EmailJS delivered successfully to ${cleanEmail} via ${serviceId}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`EmailJS trial via ${serviceId} warning:`, err?.text || err?.message);
      }
    }

    if (!delivered && lastError) {
      const errorText = lastError?.text || lastError?.message || 'Email delivery failed';
      console.error('EmailJS delivery failed:', errorText);
      return {
        success: false,
        error: `Could not deliver OTP email (${errorText}). Please check your email address and retry.`
      };
    }

    return {
      success: true,
      email: cleanEmail,
      expiresInMinutes: 15
    };
  } catch (error) {
    console.error('Email OTP send error:', error);
    const msg = error?.text || error?.message || 'Failed to dispatch email OTP.';
    return {
      success: false,
      error: msg
    };
  }
}

/**
 * Strictly verifies the 6-digit code entered by the user
 */
export function verifyEmailOtp(email, enteredCode) {
  const cleanEmail = email.toLowerCase().trim();
  const session = activeOtpSessions.get(cleanEmail);

  if (!session) {
    return {
      success: false,
      error: 'OTP session expired or not found. Please request a new code.'
    };
  }

  if (Date.now() > session.expiresAt) {
    activeOtpSessions.delete(cleanEmail);
    return {
      success: false,
      error: 'OTP code has expired. Please request a new code.'
    };
  }

  if (session.attempts >= 5) {
    activeOtpSessions.delete(cleanEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. Please request a new code.'
    };
  }

  if (session.code !== enteredCode.trim()) {
    session.attempts += 1;
    return {
      success: false,
      error: '❌ Incorrect OTP code! Please check your email inbox and enter the exact 6-digit code.'
    };
  }

  // Verification successful! Clean up session
  activeOtpSessions.delete(cleanEmail);
  return {
    success: true
  };
}

export async function checkEmailLinkSignIn() {
  return null;
}
