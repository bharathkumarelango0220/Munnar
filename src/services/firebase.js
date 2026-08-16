import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';

// Connected to your Firebase Project: Munnar Tools
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCp1Ij0XvwckZV9KVqPqfZysEVEC5ZxRz8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "munnar-tools.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "munnar-tools",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "munnar-tools.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "711023873700",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:711023873700:web:cfabf896a9fae49ba9a031"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

/**
 * 100% Free 1-Click Google Sign-In with Zero Spam & Instant Cloud Sync
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    return {
      success: true,
      user: {
        name: u.displayName || u.email.split('@')[0],
        email: u.email,
        photoURL: u.photoURL,
        isVerified: true
      }
    };
  } catch (error) {
    console.error('Google Sign In error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google'
    };
  }
}

/**
 * Initializes a clean reCAPTCHA instance for Firebase Phone Auth
 */
export function setupRecaptcha(containerId = 'recaptcha-container') {
  if (typeof window === 'undefined') return null;

  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('reCAPTCHA container element not found in DOM');
      return null;
    }

    // Reset previous verifier instance
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn('Recaptcha clear warning:', e);
      }
      window.recaptchaVerifier = null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA token expired');
      }
    });

    return window.recaptchaVerifier;
  } catch (err) {
    console.error('reCAPTCHA initialization error:', err);
    return null;
  }
}

/**
 * Sends a real 6-digit SMS OTP to any phone number worldwide
 */
export async function sendPhoneOtp(phoneNumber) {
  try {
    const appVerifier = setupRecaptcha('recaptcha-container');
    if (!appVerifier) {
      throw new Error('Could not initialize security verifier. Please refresh page.');
    }

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;

    return {
      success: true,
      message: '6-digit SMS OTP sent to your phone!'
    };
  } catch (error) {
    console.error('Phone OTP send error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS OTP. Please check the phone number.'
    };
  }
}

/**
 * Verifies the 6-digit SMS OTP code entered by user
 */
export async function verifyPhoneOtp(otpCode) {
  if (!window.confirmationResult) {
    return {
      success: false,
      error: 'OTP session expired. Please request a new code.'
    };
  }

  try {
    const result = await window.confirmationResult.confirm(otpCode);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('SMS OTP verification error:', error);
    return {
      success: false,
      error: 'Incorrect SMS OTP code. Please check your phone message and retry.'
    };
  }
}

/**
 * Saves user trip data (budgets, expenses, wishlist) to Cloud Firestore
 */
export async function saveUserTripToCloud(userKey, tripData) {
  if (!userKey) return false;
  const sanitizedId = userKey.replace(/[^a-zA-Z0-9]/g, '_');
  
  try {
    const userDocRef = doc(db, 'munnar_travelers', sanitizedId);
    await setDoc(userDocRef, {
      ...tripData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Cloud sync note:', error.message);
    return false;
  }
}

/**
 * Fetches user trip data from Cloud Firestore when logging in from any device
 */
export async function loadUserTripFromCloud(userKey) {
  if (!userKey) return null;
  const sanitizedId = userKey.replace(/[^a-zA-Z0-9]/g, '_');

  try {
    const userDocRef = doc(db, 'munnar_travelers', sanitizedId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn('Cloud load note:', error.message);
    return null;
  }
}
