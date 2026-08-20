import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Fuel, 
  Calculator, 
  Wallet, 
  BarChart3, 
  FileText, 
  Sparkles, 
  Plus, 
  Download, 
  Mountain,
  Users,
  ShieldCheck,
  TrendingDown,
  Clock,
  Car,
  FileSpreadsheet
} from 'lucide-react';

export default function HeroBanner() {
  const { 
    activeTab, 
    setIsAddExpenseModalOpen, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    categoryDefinitions
  } = useApp();

  // If on Overview Intro tab, Creator tab, or Expense Tracker tab, the components have their own complete hero
  if (activeTab === 'intro' || activeTab === 'creator' || activeTab === 'tracker') {
    return null;
  }

  const activeCategoryCount = Object.keys(categoryDefinitions || {}).length;

  // 1. FUEL CALCULATOR TAB BANNER
  if (activeTab === 'fuel') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-4 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Fuel className="w-3.5 h-3.5" />
              Mountain Fuel & Rental Calculator
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Hairpin Bends & Ghat Road Incline Physics
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              Mountain Mileage, Fuel & Rental Splitter ⛽🏍️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 leading-relaxed">
              Calculate exact petrol consumption for <strong>Single Vehicles</strong> or a <strong>Multi-Bike Group Ride</strong>. Includes hill climb fuel drop (-18%) and optional rental fees.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 sm:pt-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Hill Incline Adjustment</span>
              <strong className="text-emerald-300 font-black text-xs sm:text-sm leading-tight block mt-0.5">-18% Mountain Mileage</strong>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Group Rides</span>
              <strong className="text-white font-black text-xs sm:text-sm leading-tight block mt-0.5">Individual Rental Bike Fee</strong>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">Per-Person Split</span>
              <strong className="text-teal-300 font-black text-xs sm:text-sm leading-tight block mt-0.5">Open Passenger Stepper</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. COST PREDICTOR TAB BANNER
  if (activeTab === 'predictor') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-500/30 p-4 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Smart Budget Architect
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Predictive Cost Modeling & Customizer
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              All-in-One Total Trip Cost Predictor 🧮💰
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 leading-relaxed">
              Estimate your entire tour budget across <strong>Rooms, Food, Travel, Tickets, and Spices</strong>. Delete categories you don't need, or add your custom expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 sm:pt-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold block">⚙️ Custom Categories</span>
              <span className="text-[11px] text-slate-300">Add & delete any trip category</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-teal-400 font-bold block">🔢 Zero Default Control</span>
              <span className="text-[11px] text-slate-300">Set exact custom budgets</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-purple-400 font-bold block">⚡ Live Ledger Sync</span>
              <span className="text-[11px] text-slate-300">Syncs directly to Expense Tracker</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. BUDGET ANALYTICS & OVERSPENDING RADAR TAB BANNER
  if (activeTab === 'analytics') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-500/30 p-4 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              Budget Intelligence & Radar
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Overspending Anomalies & Health Ratings
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              Trip Budget Analytics & Spending Radar 📊🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 leading-relaxed">
              Visualize budget allocations vs real-time spending with category limit gauges, financial efficiency scores (A+ to C-), and instant overspending warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 sm:pt-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-teal-300 block font-bold">🏆 Health Grade Engine</strong>
              <span className="text-[11px] text-slate-300">A+ Master Saver to Warning alerts</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-emerald-300 block font-bold">📈 Category Gauges</strong>
              <span className="text-[11px] text-slate-300">Allocated vs Spent visual meters</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold">🚨 Anomaly Radar</strong>
              <span className="text-[11px] text-slate-300">Detects overbudget limits</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. REPORTS TAB BANNER
  if (activeTab === 'reports') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 p-4 sm:p-7 md:p-8 animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Financial Statement & Audit
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Export Official PDF & CSV Statements
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              Download Your Trip Expense Statement 📄📑
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 leading-relaxed">
              Export your complete trip audit report with itemized transactions, category budget versus actual comparisons, and verified digital signatures.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
