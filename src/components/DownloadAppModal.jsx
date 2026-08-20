import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  HardDrive,
  FileCheck,
  Sparkles,
  ArrowDownToLine,
  ExternalLink
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 text-white border border-emerald-500/30 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="relative z-10 p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  Download TripTools Mobile App 📱
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  APK v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Android Package • 100% Free & Offline Ready
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
        <div className="relative z-10 p-6 sm:p-7 space-y-6 max-h-[78vh] overflow-y-auto custom-scrollbar">
          
          {/* Key Capabilities Badges */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">100% Offline</strong>
                <span className="text-[10px] text-slate-400">Zero internet required</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">Auto Feature Sync</strong>
                <span className="text-[10px] text-slate-400">Updates live when online</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">Permanent Storage</strong>
                <span className="text-[10px] text-slate-400">Never loses trip numbers</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">No Login Needed</strong>
                <span className="text-[10px] text-slate-400">Instant privacy & safety</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            
            {/* Direct APK Download Button */}
            <a
              href="/TripTools.apk"
              download="TripTools.apk"
              onClick={() => {
                setTimeout(() => setIsDownloadAppModalOpen(false), 2000);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all group"
            >
              <ArrowDownToLine className="w-5 h-5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
              <span>Download Android APK Directly (5.2 MB)</span>
            </a>

            {/* Instant PWA Install (if available) */}
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
                <span>Add to Home Screen (Instant Install)</span>
              </button>
            )}

          </div>

          {/* Easy 4-Step Installation Instructions */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
            <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5 text-emerald-400">
              <FileCheck className="w-4 h-4" />
              <span>How to Install on Android:</span>
            </h4>
            <ol className="space-y-1.5 text-[11px] text-slate-300 pl-4 list-decimal leading-relaxed">
              <li>Tap the <strong>Download Android APK</strong> button above.</li>
              <li>When download finishes, tap <strong>Open</strong> in notification bar.</li>
              <li>If prompted by Android, tap <strong>Settings</strong> & enable <em>"Allow from this source"</em>.</li>
              <li>Tap <strong>Install</strong> and launch TripTools on your phone! 🚀</li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 bg-slate-950/60 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Engineered by <strong>Bharathkumar E</strong> (ApexAssure) • Munnar & Mountain Travel Certified
          </p>
        </div>

      </div>
    </div>
  );
}
