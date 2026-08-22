import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  X, 
  Smartphone, 
  Mountain, 
  ShieldCheck, 
  WifiOff, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [offlineCached, setOfflineCached] = useState(false);

  useEffect(() => {
    // Check if running as standalone installed PWA
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    setIsStandalone(checkStandalone);

    // Check if dismissed before in this session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
    if (dismissed) setIsDismissed(true);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check Service Worker registration & cache status
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setOfflineCached(true);
    }

    // Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic(20);
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    triggerHaptic(10);
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || isDismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <>
      {/* Floating 1-Tap Mobile Install Banner */}
      <div className="fixed bottom-[68px] sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-slideUp">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black tracking-tight text-white truncate">Install TripTools App</h4>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/30 shrink-0">
                  Offline Ready
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                1-Tap access in Munnar Ghats with 0 network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1"
            >
              <span>Install</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Add to Home Screen Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  Tap the <b className="text-emerald-600 dark:text-emerald-400">Share Icon</b> <Share2 className="w-3.5 h-3.5 inline mx-0.5" /> in Safari's bottom toolbar.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  Scroll down and tap <b className="text-emerald-600 dark:text-emerald-400">"Add to Home Screen"</b>.
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Full offline mountain mode will work automatically after adding!</span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-black hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
