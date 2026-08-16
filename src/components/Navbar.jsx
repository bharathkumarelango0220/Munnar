import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Wallet, 
  Heart, 
  UserCheck, 
  LogIn, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Code,
  Plane,
  Fuel,
  Calculator,
  Map,
  FileSpreadsheet
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    setIsAuthModalOpen, 
    totalRemaining, 
    totalBudget, 
    setActiveTab, 
    activeTab 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Creator Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('intro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group text-left"
              title="TripTools Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                    Trip<span className="text-emerald-600">Tools</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Pro
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('creator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[11px] font-medium text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1 pl-2 border-l border-slate-200"
              title="View Developer Portfolio"
            >
              <span>By</span>
              <span className="text-emerald-700 font-bold underline decoration-emerald-300">Bharathkumar E</span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => {
                setActiveTab('intro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'intro'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚀 Overview
            </button>
            <button
              onClick={() => {
                setActiveTab('fuel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fuel'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⛽ Fuel Calculator
            </button>
            <button
              onClick={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'predictor'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧮 Cost Predictor
            </button>
            <button
              onClick={() => {
                setActiveTab('tracker');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💰 Expenses
            </button>
            <button
              onClick={() => {
                setActiveTab('route');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'route'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Route Optimizer
            </button>
            <button
              onClick={() => {
                setActiveTab('reports');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 PDF Report
            </button>
            <button
              onClick={() => {
                setActiveTab('creator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'creator'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              👨‍💻 Creator
            </button>
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Balance Pill */}
            <button
              onClick={() => {
                setActiveTab('tracker');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
              title="Remaining Trip Budget"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{totalRemaining.toLocaleString('en-IN')} Left</span>
            </button>

            {/* Creator Page Quick Button */}
            <button
              onClick={() => {
                setActiveTab('creator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'creator'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              title="Developer Profile & Contact"
            >
              <Code className="w-4 h-4" />
            </button>

            {/* User Profile / Auth Button */}
            {user && user.isVerified ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / OTP</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
