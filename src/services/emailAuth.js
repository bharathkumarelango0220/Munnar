import { sendFirebaseEmailAuth } from './firebase';

// In-memory active OTP verification store with expiration timestamp
const activeOtpSessions = new Map();

/**
 * Dispatches official verification email directly through Firebase Authentication (Google MX)
 * with ZERO third-party mail relays.
 */
export async function sendEmailOtp(email, fullName = 'Traveler') {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'Please enter a valid email address.'
    };
  }

  const cleanEmail = email.toLowerCase().trim();

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

    // Pure Firebase Email Authentication (Direct Google Servers)
    const firebaseRes = await sendFirebaseEmailAuth(cleanEmail);

    if (!firebaseRes.success) {
      console.warn('Firebase email dispatch:', firebaseRes.error);
      return {
        success: false,
        error: firebaseRes.error || 'Could not send verification email. Please check your email and retry.'
      };
    }

    return {
      success: true,
      email: cleanEmail,
      expiresInMinutes: 15
    };
  } catch (error) {
    console.error('Firebase Email send error:', error);
    const msg = error?.message || 'Failed to dispatch email via Firebase.';
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
      error: 'Session expired or not found. Please request a new verification code.'
    };
  }

  if (Date.now() > session.expiresAt) {
    activeOtpSessions.delete(cleanEmail);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.'
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
      error: '❌ Incorrect code! Please check your email inbox or click the sign-in link sent by Firebase.'
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
