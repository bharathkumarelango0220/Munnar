import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmailOtp, verifyEmailOtp } from '../services/emailAuth';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, loginUser, logoutUser } = useApp();

  const [step, setStep] = useState('details'); // 'details' | 'otp' | 'success'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    tripName: user?.tripName || 'Trip Expedition 2026'
  });
  
  // 6-digit Real Email OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentEmailAddress, setSentEmailAddress] = useState('');

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  // Send real 6-digit OTP code to the entered email address
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await sendEmailOtp(formData.email.trim(), formData.name.trim());
      
      if (result.success) {
        setSentEmailAddress(formData.email.trim());
        setError('');
        setStep('otp');
        setTimer(60);
        setOtpCode(['', '', '', '', '', '']);
      } else {
        setError(result.error || 'Failed to send OTP code to email. Please check your email address.');
      }
    } catch (err) {
      console.error('Email OTP send error:', err);
      setError('Failed to send OTP. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    setError('');
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const entered = otpCode.join('');
    
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit OTP code sent to your email');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Strictly verify code against active email OTP session
      const verification = verifyEmailOtp(sentEmailAddress || formData.email, entered);

      if (!verification.success) {
        throw new Error(verification.error || '❌ Incorrect OTP code! Please check your email inbox and enter the exact 6-digit code.');
      }

      // Save verified user profile & trigger cross-device cloud sync
      await loginUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        tripName: formData.tripName
      });

      setStep('success');

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setStep('details');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Incorrect OTP code. Please check your email and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError('');
    setTimer(60);
    setOtpCode(['', '', '', '', '', '']);

    const result = await sendEmailOtp(formData.email.trim(), formData.name.trim());
    if (!result.success) {
      setError(result.error || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-5 sm:p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3 text-emerald-300" />
              100% Free Email OTP
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {user && user.isVerified ? 'Traveler Profile' : 'Email OTP Verification'}
          </h2>
          <p className="text-emerald-100/90 text-xs mt-0.5">
            {user && user.isVerified 
              ? 'Manage your trip profile & verified account' 
              : 'Enter your name and email to receive a 6-digit OTP code in your inbox'}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* If already logged in, show current profile card */}
          {user && user.isVerified && step === 'details' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/30">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Email Verified & Cloud Synced
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-700">Trip Name:</span>
                  <span className="font-semibold text-slate-800">{user.tripName || 'Munnar Tour'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Author & Developer:</span>
                  <span className="font-bold text-emerald-700">Bharathkumar E</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setStep('details');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                >
                  Log Out / Switch
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : step === 'details' ? (
            /* Step 1: Collect Name & Email */
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (To Receive 6-Digit OTP)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP to {formData.email}...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send 6-Digit OTP to Email ✉️</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : step === 'otp' ? (
            /* Step 2: 6-Digit Real Email OTP Input */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Check Your Email Inbox</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  We sent a 6-digit OTP code to: <strong className="text-slate-900 font-bold block">{sentEmailAddress || formData.email}</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  ✉️ Please check your Gmail / Email inbox (or Spam folder) and enter the 6-digit code.
                </p>
              </div>

              {/* 6 Digit inputs */}
              <div className="flex justify-center gap-2 my-3">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`email-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 sm:w-11 h-12 sm:h-13 text-center text-lg font-extrabold rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleResendOtp}
                  className={`font-bold ${timer > 0 ? 'text-slate-400' : 'text-emerald-600 hover:underline'}`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend Email OTP'}
                </button>
              </div>



              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Email OTP & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 3: Success Screen */
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Email Verified Successfully!</h3>
              <p className="text-xs text-slate-500">Welcome to TripTools, {formData.name}!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
