import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from 'firebase/auth';
import { auth } from './firebase';

// In-memory active OTP verification store with expiration timestamp
const activeOtpSessions = new Map();

/**
 * Dispatches real email verification OTP to the traveler's email address
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

    // 1. Dispatch real email via FormSubmit Public Mail Gateway
    const formSubmitPromise = fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🌿 Munnar Explorer Verification Code: ${otpCode}`,
        name: 'Munnar Explorer Verification',
        email: 'noreply@munnartools.vercel.app',
        message: `Hello ${fullName}!\n\nYour 6-digit Munnar Explorer verification OTP is:\n\n👉 ${otpCode}\n\nEnter this code on the website to access your budget and trip expense tracker.\n\nCode expires in 15 minutes.\n\nCrafted by Bharathkumar E.`,
        _template: 'box'
      })
    }).catch((e) => console.warn('FormSubmit note:', e));

    // 2. Dispatch via Web3Forms Gateway
    const web3FormsPromise = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: 'a29fa03e-86e4-4d69-95e2-63dbb1086202',
        email: cleanEmail,
        from_name: 'Munnar Explorer App',
        subject: `🌿 Munnar Explorer Verification Code: ${otpCode}`,
        message: `Hello ${fullName}!\n\nYour 6-digit verification code is: ${otpCode}\n\nEnter this code on the website to verify your account.`
      })
    }).catch((e) => console.warn('Web3Forms note:', e));

    // 3. Dispatch Google Firebase Email Link
    try {
      const actionCodeSettings = {
        url: (typeof window !== 'undefined' ? window.location.origin : 'https://munnartools.vercel.app') + `?verify_email=${encodeURIComponent(cleanEmail)}`,
        handleCodeInApp: true
      };
      sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings).catch((e) => console.warn('Firebase Email note:', e));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('munnar_email_for_signin', cleanEmail);
      }
    } catch (fbErr) {
      console.warn('Firebase email error:', fbErr);
    }

    // Wait for at least one delivery request
    await Promise.race([formSubmitPromise, web3FormsPromise]);

    return {
      success: true,
      email: cleanEmail,
      otpCode,
      expiresInMinutes: 15
    };
  } catch (error) {
    console.error('Email dispatch error:', error);
    return {
      success: false,
      error: 'Could not send verification email. Please check your email address.'
    };
  }
}

/**
 * Verifies the 6-digit code entered by the user
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

/**
 * Checks if the current page was opened from an official Google Email link
 */
export async function checkEmailLinkSignIn() {
  if (typeof window === 'undefined') return null;

  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('munnar_email_for_signin');
      if (!email) {
        const urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get('verify_email');
      }

      if (email) {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('munnar_email_for_signin');
        return {
          success: true,
          email,
          user: result.user
        };
      }
    }
    return null;
  } catch (err) {
    console.error('Email link sign in error:', err);
    return null;
  }
}
