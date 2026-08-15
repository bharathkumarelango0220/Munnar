import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
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
  } catch (error) {
    console.error('Recaptcha setup error:', error);
    return null;
  }
}

/**
 * Dispatches real SMS OTP to the provided phone number (+91...)
 */
export async function sendFirebaseOtp(phoneNumber, containerId = 'recaptcha-container') {
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
  
  try {
    const verifier = setupRecaptcha(containerId);
    if (!verifier) {
      throw new Error('Unable to initialize reCAPTCHA security verifier. Please refresh the page.');
    }
    
    // Request Firebase to dispatch SMS OTP to the carrier network
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    
    return {
      success: true,
      confirmationResult,
      isRealSms: true
    };
  } catch (error) {
    console.error('Firebase Phone Auth Detailed Error:', error);
    
    let userFriendlyMsg = error.message;
    if (error.code === 'auth/operation-not-allowed') {
      userFriendlyMsg = 'Firebase is still activating Phone Auth for your project. Please verify Phone is Enabled in Firebase Console and that munnartools.vercel.app is added to Authorized Domains.';
    } else if (error.code === 'auth/unauthorized-domain') {
      userFriendlyMsg = 'Your domain is not authorized. Go to Firebase Console > Authentication > Settings > Authorized domains > Add munnartools.vercel.app.';
    } else if (error.code === 'auth/invalid-phone-number') {
      userFriendlyMsg = 'Invalid phone number format. Please enter a valid 10-digit mobile number (+91...).';
    } else if (error.code === 'auth/too-many-requests') {
      userFriendlyMsg = 'Too many SMS requests sent to this number. Please wait 1-2 minutes before retrying.';
    } else if (error.code === 'auth/captcha-check-failed') {
      userFriendlyMsg = 'reCAPTCHA check failed. Please disable ad-blockers and try again.';
    }

    return {
      success: false,
      error: userFriendlyMsg,
      errorCode: error.code
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
