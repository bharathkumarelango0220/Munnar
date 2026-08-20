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
  ShieldCheck
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
                  Install TripTools App 📱
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                100% Free • Offline Ready • Real-Time Sync
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
        <div className="relative z-10 p-6 space-y-5">
          
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

          {/* Direct 1-Click Install Button */}
          {deferredPrompt ? (
            <button
              type="button"
              onClick={() => {
                installPwaApp();
                setIsDownloadAppModalOpen(false);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/30 active:scale-98 transition-all"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Tap to Install App on Phone</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Install Directly to Your Home Screen:</span>
              </div>
              
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                  <p className="text-[11px] leading-relaxed">
                    Tap the <strong>3 vertical dots (⋮)</strong> at the top right of your browser.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                  <p className="text-[11px] leading-relaxed">
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ✨ Once installed, it appears directly in your phone's <strong>App Drawer & Home Screen</strong>, runs completely <strong>offline</strong> in mountain areas, and <strong>updates automatically</strong> whenever you connect to internet!
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
