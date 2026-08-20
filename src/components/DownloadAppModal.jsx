import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  HardDrive,
  Sparkles,
  ExternalLink,
  HelpCircle,
  DownloadCloud,
  ChevronRight,
  Menu
} from 'lucide-react';

export default function DownloadAppModal() {
  const { 
    isDownloadAppModalOpen, 
    setIsDownloadAppModalOpen, 
    deferredPrompt, 
    installPwaApp 
  } = useApp();

  const [activeTab, setActiveTab] = useState('instant'); // 'instant' | 'apk'

  if (!isDownloadAppModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
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
                  Get TripTools App 📱
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Install on Android • 100% Free • Auto Cloud Sync
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

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'instant'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Tap Install (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Generate APK File</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Key Capabilities Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <WifiOff className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">100% Offline</strong>
                <span className="text-[10px] text-slate-400">No internet needed</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="block text-white font-bold text-[11px]">Auto Feature Sync</strong>
                <span className="text-[10px] text-slate-400">Live background updates</span>
              </div>
            </div>
          </div>

          {/* TAB 1: INSTANT 1-TAP INSTALL (PWA - 0 Parse Error) */}
          {activeTab === 'instant' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* If browser supports direct prompt */}
              {deferredPrompt ? (
                <button
                  type="button"
                  onClick={() => {
                    installPwaApp();
                    setIsDownloadAppModalOpen(false);
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all"
                >
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  <span>Install TripTools Directly to Phone</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant Install in 2 Taps (Zero Error):</span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                      <p className="text-[11px] leading-relaxed">
                        Tap the <strong>3 vertical dots (⋮)</strong> at the top-right corner of Chrome / your mobile browser.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                      <p className="text-[11px] leading-relaxed">
                        Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-emerald-400 font-medium pt-1">
                    ✨ That's it! It installs as a real standalone app with app icon, runs 100% offline, and auto-updates with new features!
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: COMPILED BINARY APK BUILDER */}
          {activeTab === 'apk' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <DownloadCloud className="w-4 h-4 text-teal-400" />
                  <span>Build Signed APK Package:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  To get a compiled, signed binary <strong>`.apk`</strong> file that installs cleanly without Android parsing errors, you can generate it in 1 minute using <strong>PWABuilder</strong>:
                </p>

                <a
                  href="https://www.pwabuilder.com?url=https://munnartools.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <span>Open PWABuilder & Download APK</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>

                <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                  <p>1. Open PWABuilder link above</p>
                  <p>2. Click <strong>Package for Android</strong></p>
                  <p>3. Download the signed <strong>`.apk`</strong> file directly!</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 bg-slate-950/60 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Crafted by <strong>Bharathkumar E</strong> (ApexAssure) • Munnar Tour Companion
          </p>
        </div>

      </div>
    </div>
  );
}
