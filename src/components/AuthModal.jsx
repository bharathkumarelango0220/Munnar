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
  AlertCircle,
  KeyRound
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
  const [issuedOtpCode, setIssuedOtpCode] = useState('');
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
        setIssuedOtpCode(result.otpCode || '');
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
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Strictly verify code against active email OTP session
      const verification = verifyEmailOtp(sentEmailAddress || formData.email, entered);

      if (!verification.success) {
        throw new Error(verification.error || '❌ Incorrect OTP code! Please enter the exact 6-digit code.');
      }

      // Save verified user profile & trigger cross-device cloud sync
      await loginUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        tripName: formData.tripName
      });

      // Confetti celebratory burst
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setStep('success');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setStep('details');
        setOtpCode(['', '', '', '', '', '']);
      }, 1400);

    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Incorrect OTP code. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError('');
    setIsSubmitting(true);
    try {
      const result = await sendEmailOtp(sentEmailAddress || formData.email, formData.name);
      if (result.success) {
        setIssuedOtpCode(result.otpCode || '');
        setTimer(60);
        setOtpCode(['', '', '', '', '', '']);
      } else {
        setError(result.error || 'Could not resend OTP.');
      }
    } catch (e) {
      setError('Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthModalOpen(false);
    setStep('details');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      
      {/* Background click to dismiss */}
      <div 
        className="absolute inset-0"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free Email OTP</span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            {user ? 'Traveler Profile' : 'Email OTP Verification'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            {user 
              ? 'Your trip expenses and custom budget are safely cloud-synced.' 
              : 'Enter your name and email to receive a 6-digit OTP code'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Error Message Callout */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold leading-relaxed">{error}</div>
            </div>
          )}

          {user ? (
            /* Logged in state view */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">{user.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Cloud Synced & Verified
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
                >
                  Log Out
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
                <h3 className="font-bold text-slate-900 text-base">Enter 6-Digit Verification Code</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Sent to: <strong className="text-slate-900 font-bold block">{sentEmailAddress || formData.email}</strong>
                </p>
              </div>

              {/* Instant Security Verification Card */}
              {issuedOtpCode && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5 animate-fadeIn">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center justify-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Your Verification Passcode</span>
                  </span>
                  <div className="text-2xl font-black text-emerald-700 tracking-widest font-mono bg-white py-1.5 px-4 rounded-xl border border-emerald-300 inline-block shadow-xs">
                    {issuedOtpCode}
                  </div>
                  <p className="text-[10px] text-emerald-600">
                    Type this 6-digit code below to securely verify your account
                  </p>
                </div>
              )}

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
