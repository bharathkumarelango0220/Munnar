import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Fuel, 
  Calculator, 
  Wallet, 
  FileSpreadsheet, 
  Code, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  User,
  HardDrive,
  FileText
} from 'lucide-react';

export default function Introduction() {
  const { 
    setActiveTab, 
    setIsNameModalOpen, 
    travelerName, 
    resetAllDataToZero
  } = useApp();
  
  const [resetFeedback, setResetFeedback] = useState(false);

  const handleResetClick = () => {
    const didReset = resetAllDataToZero();
    if (didReset) {
      setResetFeedback(true);
      setTimeout(() => setResetFeedback(false), 3500);
    }
  };

  const toolFeatures = [
    {
      id: 'fuel',
      title: 'Fuel & Rental Calculator',
      icon: Fuel,
      tag: 'Accurate Hill Physics',
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Calculate fuel consumption with mountain incline adjustments (-18% mileage on hairpin bends). Supports single vehicles or multi-bike convoys with individual rental bike fee tracking.',
      highlights: ['Ghat road slope adjustment', 'Multi-bike convoy calculations', 'Rental bike toggle & amount allocation', 'Open per-person expense split']
    },
    {
      id: 'predictor',
      title: 'Trip Cost Predictor',
      icon: Calculator,
      tag: 'Dynamic Budget Architect',
      color: 'from-teal-500 to-cyan-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'Estimate your complete tour budget across Rooms, Food, Travel, Tickets, and Spices. Add your own custom categories or delete unneeded ones with live sync across the site.',
      highlights: ['Custom category builder', 'Live 2-way deletion & addition sync', 'Fixed / Per-day / Per-person rates', 'Custom budget architect']
    },
    {
      id: 'tracker',
      title: 'Live Expense Tracker',
      icon: Wallet,
      tag: 'Real-Time Budget Ledger',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Log and monitor daily spending against your customized budgets with AI Bill & Receipt Vision Scanner, live remaining balance alerts, and payment filters.',
      highlights: ['AI Smart Receipt Vision Scanner 📸', 'Live remaining budget counters', 'Overspending warning alerts', 'Filter by cash / UPI / card']
    },
    {
      id: 'analytics',
      title: 'Budget Analytics & Radar',
      icon: BarChart3,
      tag: 'Trip Health Score (A+ to C-)',
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Visualize allocated budgets against real-time spending with category limit gauges, trip savings grades, payment mode splits, and instant overspending alert radars.',
      highlights: ['Financial health score (A+ to C-)', 'Allocated vs spent progress meters', 'Smart overspending anomaly alerts', 'Cash vs UPI payment splits']
    },
    {
      id: 'reports',
      title: 'PDF & CSV Financial Reports',
      icon: FileSpreadsheet,
      tag: 'Print-Ready Statements',
      color: 'from-purple-500 to-violet-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Generate and download official trip audit statements with itemized expense ledgers, budget vs. actual analytics, and verified digital signatures.',
      highlights: ['A4 PDF statement download', 'Excel / CSV spreadsheet export', 'Itemized receipt ledger', 'Digital Certificate of Authenticity']
    },
    {
      id: 'creator',
      title: 'Developer Portfolio',
      icon: Code,
      tag: 'Created by Bharathkumar E',
      color: 'from-slate-700 to-slate-900',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Engineered by Bharathkumar E (ApexAssure). Inquire for custom website development, SaaS web tools, and fullstack cloud integrations.',
      highlights: ['Full-stack software engineer', 'WhatsApp quick chat inquiry', 'Direct phone & email contact', 'Mobile-first web solutions']
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome to TripTools
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Smart Travel Utility Suite
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              The All-in-One Smart Travel Calculator & Expense Companion ✈️🎒
            </h1>
            <p className="text-xs sm:text-base text-slate-300 mt-2.5 sm:mt-3 leading-relaxed font-normal">
              <strong>TripTools</strong> is engineered to eliminate the friction of trip planning. Predict total tour budgets, calculate mountain fuel and rental charges, optimize driving routes, track live group spending, and export official PDF statements.
            </p>
          </div>

          {/* Quick Launch & Reset Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('fuel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
            >
              <Fuel className="w-4 h-4 shrink-0" />
              <span>Launch Fuel Calculator</span>
              <ArrowRight className="w-4 h-4 stroke-[3] shrink-0" />
            </button>

            <button
              onClick={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-white/15"
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>Open Cost Predictor</span>
            </button>

            <a
              href="/TripTools_User_Manual.pdf"
              download="TripTools_User_Manual.pdf"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              title="Download Comprehensive User Guide PDF"
            >
              <FileText className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>User Manual (PDF) 📖</span>
            </a>

            <button
              onClick={handleResetClick}
              className="px-4 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              title="Reset all values to 0"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Reset Values to 0</span>
            </button>
          </div>

          {resetFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>All trip values, categories, fuel rates, and expenses have been reset to 0!</span>
            </div>
          )}
        </div>
      </div>

      {/* CORE FEATURES GRID */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Engineered Travel Solutions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Choose a Tool to Get Started 🛠️
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every module starts at <strong>0</strong> by default. Enter your own values manually and they will stay saved on this device forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolFeatures.map((tool) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.id}
                onClick={() => {
                  setActiveTab(tool.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tool.badgeBg}`}>
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <ul className="space-y-1">
                    {tool.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW IT WORKS 4-STEP WORKFLOW */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Recommended Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            How to Master Your Trip Budget 🧭
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Follow this 4-step sequence to plan, budget, calculate, and audit your complete expedition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Plan Categories</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open <strong>Trip Cost Predictor</strong>, set your days & travelers, and add your custom expense categories with rates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Estimate Fuel</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use <strong>Fuel Calculator</strong> to compute mountain petrol costs, bike rentals, and passenger splits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Track Spending</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log daily receipts into <strong>Expense Tracker</strong> and monitor live remaining balances.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-sm text-white">Export Reports</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download your verified trip audit in <strong>PDF & CSV spreadsheet</strong> format in 1 click!
            </p>
          </div>
        </div>
      </div>

      {/* STORAGE & RESET MANAGEMENT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Permanent Device Storage & One-Click Reset
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every value you enter is <strong>automatically and permanently saved on this device</strong>. Even if you close, refresh, or reopen the browser, your last updated values will always be restored. Click <strong>Reset All Values to 0</strong> anytime to start a brand new tour from scratch!
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold pt-0.5">
              Current Traveler Profile: <span>{travelerName}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setIsNameModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <User className="w-3.5 h-3.5" />
            <span>Set Name</span>
          </button>

          <button
            onClick={handleResetClick}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            title="Reset all numbers and categories on this device to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>
        </div>
      </div>

    </div>
  );
}
