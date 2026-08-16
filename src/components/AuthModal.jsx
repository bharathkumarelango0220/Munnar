import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  MapPin,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, loginUser, logoutUser } = useApp();

  const [step, setStep] = useState('details'); // 'details' | 'success'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    tripName: user?.tripName || 'Munnar Expedition 2026'
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleInstantLogin = async (e) => {
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
      // Save verified user profile & sync to Google Cloud Firestore
      await loginUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        tripName: formData.tripName || 'Munnar Expedition 2026'
      });

      setStep('success');
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setStep('details');
      }, 1200);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to save profile. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
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
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              100% Free Traveler Sync
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {user && user.isVerified ? 'Traveler Profile' : 'Traveler Verification'}
          </h2>
          <p className="text-emerald-100/90 text-xs mt-0.5">
            {user && user.isVerified 
              ? 'Manage your trip profile & cloud synchronized account' 
              : 'Enter your name and email for instant access and cloud backup'}
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
                      Verified & Cloud Synced Across Devices
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
            /* Step 1: Collect Name & Email (Instant 1-Click Verification) */
            <form onSubmit={handleInstantLogin} className="space-y-3.5">
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
                  Email Address
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
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>Verify & Access Trip Tracker 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  ☁️ Automatically syncs budgets & expenses to Google Cloud across your devices
                </p>
              </div>
            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Successfully!</h3>
              <p className="text-xs text-slate-500">Welcome to Munnar Travel Companion, {formData.name}!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
