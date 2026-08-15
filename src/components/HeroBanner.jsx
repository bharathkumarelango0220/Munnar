import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Wallet, 
  MapPin, 
  Sparkles, 
  Download, 
  Share2, 
  Heart,
  Navigation,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

export default function HeroBanner() {
  const { 
    setActiveTab, 
    setIsAddExpenseModalOpen, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    user 
  } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white shadow-2xl mb-8 border border-emerald-800/40">
      
      {/* Ambient background glow & pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)] pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative p-5 sm:p-8 md:p-10 z-10">
        
        {/* Top Badges: Creator & Free Gift */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crafted with ❤️ by <strong className="text-white font-bold">Bharathkumar E</strong></span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            100% Free Munnar Travel Companion
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3">
            Explore Munnar & Track Trip Expenses in Real-Time
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-normal">
            Discover 16+ iconic tourist spots with instant <span className="text-emerald-300 font-semibold">1-Tap Google Maps Navigation</span>. 
            Set budgets for <span className="text-white font-semibold">Bike, Food, Rooms, Tickets & more</span>, track every single Rupee spent, and download professional PDF reports!
          </p>
        </div>

        {/* Quick Live Budget Dashboard Card (Inside Hero) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 my-6 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <div className="p-2 sm:p-2.5">
            <span className="text-[11px] font-medium text-emerald-200/80 block">Trip Budget</span>
            <span className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2 sm:p-2.5">
            <span className="text-[11px] font-medium text-emerald-200/80 block">Total Spent</span>
            <span className="text-base sm:text-xl font-extrabold text-amber-300 tracking-tight">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2 sm:p-2.5">
            <span className="text-[11px] font-medium text-emerald-200/80 block">Remaining</span>
            <span className={`text-base sm:text-xl font-extrabold tracking-tight ${totalRemaining < 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
              ₹{totalRemaining.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2 sm:p-2.5">
            <span className="text-[11px] font-medium text-emerald-200/80 block">Budget Used</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-extrabold text-teal-200">
                {totalPercentUsed}%
              </span>
              <span className="text-[10px] text-slate-300">({totalBudget > 0 ? (totalSpent / totalBudget > 0.8 ? '⚠️ High' : '✅ Healthy') : '0%'})</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('places')}
            className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Explore All Places</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tracker');
              setIsAddExpenseModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-sm border border-white/20 active:scale-95 transition-all"
          >
            <Wallet className="w-4 h-4 text-emerald-300" />
            <span>+ Log ₹ Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-teal-900/60 hover:bg-teal-800/80 text-teal-200 font-semibold text-xs sm:text-sm border border-teal-700/50 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-teal-300" />
            <span>Download PDF Report</span>
          </button>
        </div>

      </div>

    </div>
  );
}
