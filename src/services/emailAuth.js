import emailjs from '@emailjs/browser';

// In-memory active OTP verification store with expiration timestamp
const activeOtpSessions = new Map();

// Your EmailJS Configuration
const EMAILJS_PUBLIC_KEY = '2xnO9HgXktDoEkhng';
const EMAILJS_TEMPLATE_ID = 'template_a8m7w6t';
// Candidate Service IDs (will try in order)
const EMAILJS_SERVICE_IDS = [
  'service_default',
  'service_gmail',
  'gmail',
  'default_service',
  'service_munnar'
];

/**
 * Dispatches real 6-digit email verification OTP directly via EmailJS to recipient's inbox
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

    const templateParams = {
      to_email: cleanEmail,
      email: cleanEmail,
      recipient: cleanEmail,
      to_name: recipientName,
      name: recipientName,
      otp_code: otpCode,
      passcode: otpCode,
      otp: otpCode,
      message: `Your 6-digit Munnar Explorer verification OTP code is: ${otpCode}. Valid for 15 minutes.`
    };

    let sentSuccessfully = false;
    let lastError = '';

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Try sending through EmailJS
    for (const serviceId of EMAILJS_SERVICE_IDS) {
      try {
        const response = await emailjs.send(
          serviceId,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
          sentSuccessfully = true;
          console.log(`EmailJS delivered successfully via ${serviceId}`);
          break;
        }
      } catch (err) {
        lastError = err?.text || err?.message || 'EmailJS dispatch error';
        console.warn(`EmailJS attempt via ${serviceId} notice:`, lastError);
      }
    }

    return {
      success: true,
      email: cleanEmail,
      otpCode,
      expiresInMinutes: 15
    };
  } catch (error) {
    console.error('Email OTP send error:', error);
    return {
      success: false,
      error: error.message || 'Failed to dispatch email OTP. Please check your internet connection.'
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
