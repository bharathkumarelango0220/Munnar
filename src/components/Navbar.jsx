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
  LogIn,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    setIsAuthModalOpen, 
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
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
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-900">
                    Trip<span className="text-emerald-600">Tools</span>
                  </span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 font-semibold tracking-tight mt-0.5">
                  by Bharathkumar E
                </span>
              </div>
            </button>
          </div>

          {/* DESKTOP NAVIGATION CAPSULE */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner">
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
                      ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS: THEME TOGGLE, BALANCE & AUTH */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Balance Pill */}
            <button
              onClick={() => {
                setActiveTab('tracker');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all"
              title="Remaining Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{totalRemaining.toLocaleString('en-IN')} Left</span>
            </button>

            {/* DARK / LIGHT MODE SWITCH BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-all flex items-center justify-center active:scale-95 shadow-xs"
              title={theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* User Auth Pill Button */}
            {user && user.isVerified ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
