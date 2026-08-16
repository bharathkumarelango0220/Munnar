import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Wallet, 
  MapPin, 
  Sparkles, 
  Download, 
  Heart,
  Navigation,
  CheckCircle2,
  Mountain,
  Fuel,
  Calculator,
  Layers,
  FileSpreadsheet,
  Code,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function HeroBanner() {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddExpenseModalOpen, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    categoryDefinitions
  } = useApp();

  const activeCategoryCount = Object.keys(categoryDefinitions || {}).length;

  // 1. PLACES TAB BANNER
  if (activeTab === 'places') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              16+ Iconic Munnar Attractions
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Verified Timings, Entry Fees & Google Maps GPS
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Explore Munnar's Top Peaks, Waterfalls & Tea Estates 🌿🏔️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              From the <strong>World's Highest Tea Estate at Kolukkumalai (7,900 ft)</strong> to the <strong>Nilgiri Tahr at Eravikulam</strong>, browse curated spots with 1-Tap driving navigation.
            </p>
          </div>

          {/* Quick Highlight Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🌄</span>
              <div>
                <strong className="block text-white font-bold">Kolukkumalai</strong>
                <span className="text-[10px] text-slate-400">Cloud Sunrise</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🐐</span>
              <div>
                <strong className="block text-white font-bold">Eravikulam</strong>
                <span className="text-[10px] text-slate-400">Nilgiri Tahr</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🌊</span>
              <div>
                <strong className="block text-white font-bold">Mattupetty</strong>
                <span className="text-[10px] text-slate-400">Speed Boating</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">☕</span>
              <div>
                <strong className="block text-white font-bold">KDHP Museum</strong>
                <span className="text-[10px] text-slate-400">Tea Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FUEL CALCULATOR TAB BANNER
  if (activeTab === 'fuel') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Fuel className="w-3.5 h-3.5" />
              Ghat Road Fuel & Rental Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Hairpin Bends & Mountain Incline Physics
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Mountain Mileage, Fuel & Rental Splitter ⛽🏍️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Calculate exact petrol consumption for <strong>Single Vehicles</strong> or a <strong>Multi-Bike Group Ride</strong>. Includes hill climb fuel drop (-18%) and optional rental fees.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Hill Incline Adjustment</span>
              <strong className="text-emerald-300 font-black text-sm">-18% Mountain Mileage</strong>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Group Rides</span>
              <strong className="text-white font-black text-sm">Individual Bike Rented Option</strong>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">Per-Person Split</span>
              <strong className="text-teal-300 font-black text-sm">Open Passenger Stepper</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. COST PREDICTOR TAB BANNER
  if (activeTab === 'predictor') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Smart Budget Architect
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Predictive Cost Modeling & Category Customizer
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              All-in-One Total Trip Cost Predictor 🧮💰
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Estimate your entire Munnar tour budget across <strong>Rooms, Food, Travel, Tickets, and Spices</strong>. Delete categories you don't need, or add your custom expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold block">🎒 Backpacker Style</span>
              <span className="text-[11px] text-slate-300">Homestays & bike petrol</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-teal-400 font-bold block">🚗 Comfort Family</span>
              <span className="text-[11px] text-slate-300">3-Star hotels & cabs</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-purple-400 font-bold block">👑 Luxury VIP</span>
              <span className="text-[11px] text-slate-300">5-Star hilltop tea villas</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. EXPENSE TRACKER TAB BANNER
  if (activeTab === 'tracker') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5" />
                Live Spending Ledger
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {activeCategoryCount > 0 ? `${activeCategoryCount} Active Categories` : 'Setup in Predictor'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Live Quick Metrics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="p-2">
              <span className="text-[11px] font-medium text-emerald-200/80 block">Trip Budget</span>
              <span className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                ₹{totalBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-medium text-emerald-200/80 block">Total Spent</span>
              <span className="text-base sm:text-xl font-extrabold text-amber-300 tracking-tight">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-medium text-emerald-200/80 block">Remaining</span>
              <span className={`text-base sm:text-xl font-extrabold tracking-tight ${totalRemaining < 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
                ₹{totalRemaining.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-medium text-emerald-200/80 block">Budget Used</span>
              <span className="text-base sm:text-xl font-extrabold text-teal-200 tracking-tight">
                {totalPercentUsed}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. ROUTE OPTIMIZER TAB BANNER
  if (activeTab === 'route') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5" />
              Smart Route Optimizer
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Zero Backtracking Heuristic Engine
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Shortest Mountain Route Sequence & GPS 🗺️⚡
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Select the places you want to visit. Our algorithm sequences them into the <strong>shortest single-direction mountain driving loop</strong> so you never waste fuel on hairpin turns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-teal-300 block font-bold">1-Direction Sequence</strong>
              <span className="text-[11px] text-slate-400">Zero backtracking loops</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-emerald-300 block font-bold">Multi-Stop Google Maps</strong>
              <span className="text-[11px] text-slate-400">1-Tap GPS turn-by-turn</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold">Time Optimization</strong>
              <span className="text-[11px] text-slate-400">Beat mountain fog & buses</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. REPORTS TAB BANNER
  if (activeTab === 'reports') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Financial Statement & Audit
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Export Official PDF & CSV Statements
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Download Your Munnar Trip Expense Statement 📄📑
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Export your complete trip audit report with itemized transactions, category budget versus actual comparisons, and verified digital signatures.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 7. CREATOR TAB BANNER
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-5 sm:p-7 md:p-8 animate-fadeIn">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <Code className="w-3.5 h-3.5" />
            Software Engineer Portfolio
          </span>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Designed & Developed by Bharathkumar E 👨‍💻✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Full-Stack Software Engineer & UI/UX Designer. Discover more production-grade web applications at <strong>ApexAssure</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
