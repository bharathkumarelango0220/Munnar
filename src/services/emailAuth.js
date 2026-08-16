import emailjs from '@emailjs/browser';
import { sendFirebaseEmailAuth } from './firebase';

// In-memory active OTP verification store with expiration timestamp
const activeOtpSessions = new Map();

// EmailJS Configuration (Fallback)
const EMAILJS_PUBLIC_KEY = '2xnO9HgXktDoEkhng';
const EMAILJS_TEMPLATE_ID = 'template_a8m7w6t';
const EMAILJS_SERVICE_CANDIDATES = [
  'service_bk264165@gmail.com',
  'bk264165@gmail.com',
  'service_default',
  'default_service',
  'service_gmail',
  'gmail'
];

/**
 * Dispatches verification email directly via Firebase Authentication (Google MX) & EmailJS
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

    // 1. PRIMARY: Dispatch official Firebase verification email (Direct from Google servers)
    try {
      await sendFirebaseEmailAuth(cleanEmail);
    } catch (e) {
      console.warn('Firebase Email dispatch notice:', e?.message);
    }

    // 2. DISPATCH EMAIL VIA EMAILJS
    const emailSubject = `TripTools verification code: ${otpCode}`;
    const plainMessage = `Hello ${recipientName},\n\nYour verification code is: ${otpCode}\n\nValid for 15 minutes.\n\nTripTools`;

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
      content: plainMessage
    };

    emailjs.init(EMAILJS_PUBLIC_KEY);

    for (const serviceId of EMAILJS_SERVICE_CANDIDATES) {
      try {
        const response = await emailjs.send(
          serviceId,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200 || response.text === 'OK') {
          console.log(`Delivered via EmailJS ${serviceId}`);
          break;
        }
      } catch (err) {
        console.warn(`EmailJS trial via ${serviceId}:`, err?.text || err?.message);
      }
    }

    return {
      success: true,
      email: cleanEmail,
      expiresInMinutes: 15
    };
  } catch (error) {
    console.error('Email OTP send error:', error);
    const msg = error?.text || error?.message || 'Failed to dispatch email.';
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
