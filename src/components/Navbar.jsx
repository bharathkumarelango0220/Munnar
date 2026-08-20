import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plane, 
  Fuel, 
  Calculator, 
  Wallet, 
  BarChart3, 
  FileText, 
  User, 
  Sun, 
  Moon,
  Sparkles,
  Edit3
} from 'lucide-react';

export default function Navbar() {
  const { 
    travelerName, 
    setIsNameModalOpen, 
    totalRemaining, 
    setActiveTab, 
    activeTab,
    theme,
    toggleTheme
  } = useApp();

  const navLinks = [
    { id: 'intro', label: 'Overview', icon: Plane },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'predictor', label: 'Predictor', icon: Calculator },
    { id: 'tracker', label: 'Expenses', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'creator', label: 'Creator', icon: User }
  ];

  const firstLetter = (travelerName && travelerName.trim().charAt(0).toUpperCase()) || 'T';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-850 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('intro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left"
              title="TripTools Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Plane className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    Trip<span className="text-emerald-600 dark:text-emerald-400">Tools</span>
                  </span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold tracking-tight mt-0.5">
                  by Bharathkumar E
                </span>
              </div>
            </button>
          </div>

          {/* DESKTOP NAVIGATION CAPSULE */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-slate-900/5 dark:ring-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.5]' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS: THEME TOGGLE, BALANCE & TRAVELER PROFILE */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Balance Pill */}
            <button
              onClick={() => {
                setActiveTab('tracker');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold transition-all shadow-xs"
              title="Remaining Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>₹{totalRemaining.toLocaleString('en-IN')} Left</span>
            </button>

            {/* DARK / LIGHT MODE SWITCH BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center active:scale-95 shadow-xs"
              title={theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Traveler Profile Name Pill */}
            <button
              onClick={() => setIsNameModalOpen(true)}
              className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 group border border-slate-800 dark:border-slate-700"
              title="Click to change Traveler Name for Reports"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                {firstLetter}
              </div>
              <span className="max-w-[85px] sm:max-w-[110px] truncate">{travelerName}</span>
              <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
