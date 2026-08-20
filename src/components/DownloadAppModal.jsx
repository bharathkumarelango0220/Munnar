import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Smartphone, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Download,
  ExternalLink,
  DownloadCloud
} from 'lucide-react';

export default function DownloadAppModal() {
  const { 
    isDownloadAppModalOpen, 
    setIsDownloadAppModalOpen, 
    deferredPrompt, 
    installPwaApp 
  } = useApp();

  if (!isDownloadAppModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 text-white border border-emerald-500/30 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="relative z-10 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white tracking-tight">
                  Get TripTools App 📱
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Android APK • 100% Offline • Auto Cloud Sync
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDownloadAppModalOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 space-y-4">
          
          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">100% Offline</strong>
                <span className="text-[10px] text-slate-400">Zero data needed</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">Auto-Cloud Sync</strong>
                <span className="text-[10px] text-slate-400">Live feature updates</span>
              </div>
            </div>
          </div>

          {/* Action 1: Download Compiled Android APK */}
          <a
            href="https://www.pwabuilder.com?url=https://munnartools.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 active:scale-98 transition-all"
          >
            <DownloadCloud className="w-5 h-5 stroke-[2.5]" />
            <span>Download Signed Android APK (.apk)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </a>

          {/* Action 2: Direct Install to Home Screen */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={() => {
                installPwaApp();
                setIsDownloadAppModalOpen(false);
              }}
              className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/15 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Or Tap for 1-Click Install to Phone</span>
            </button>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>How it works:</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              1. Tap <strong>Download Signed Android APK</strong> above $\rightarrow$ tap <strong>Package for Android</strong>.
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              2. Download and install the <strong>.apk</strong> on your Android phone.
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              3. The app runs <strong>100% offline</strong> and <strong>auto-syncs all future updates from the cloud</strong>!
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 bg-slate-950/60 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Crafted by <strong>Bharathkumar E</strong> (ApexAssure)
          </p>
        </div>

      </div>
    </div>
  );
}
