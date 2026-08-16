import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Fuel, 
  Calculator, 
  Wallet, 
  Map, 
  FileSpreadsheet, 
  Code, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Users, 
  TrendingUp, 
  Smartphone, 
  Lock,
  Globe,
  Compass
} from 'lucide-react';

export default function Introduction() {
  const { setActiveTab, setIsAuthModalOpen, user } = useApp();

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
      highlights: ['Custom category builder', 'Live 2-way deletion & addition sync', 'Fixed / Per-day / Per-person rates', 'Backpacker / Family / Luxury presets']
    },
    {
      id: 'tracker',
      title: 'Live Expense Tracker',
      icon: Wallet,
      tag: 'Real-Time Budget Ledger',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Log and monitor daily spending against your customized budgets with live remaining balance alerts, category breakdown meters, and payment method filters.',
      highlights: ['Live remaining budget counters', 'Overspending warning alerts', 'Dynamic category binding', 'Filter by cash / UPI / card']
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
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              The All-in-One Smart Travel Calculator & Expense Companion ✈️🎒
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-normal">
              <strong>TripTools</strong> is engineered to eliminate the friction of trip planning. Predict total tour budgets, calculate mountain fuel and rental charges, optimize driving routes, track live group spending, and export official PDF statements.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('fuel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
            >
              <Fuel className="w-4 h-4" />
              <span>Launch Fuel Calculator</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/15"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Cost Predictor</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE FEATURES GRID */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Power Features</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore All 6 Powerful Tools Inside TripTools 🛠️⚡
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click on any tool card to launch and start using it instantly.
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
                className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-soft hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeBg}`}>
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                    {tool.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                    <span>Open {tool.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW TRIPTOOLS WORKS: 4 STEP WORKFLOW */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
              Frictionless Trip Workflow
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              How TripTools Powers Your Journey 🗺️💡
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            4 simple steps from start to finish
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Predict Budget</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open <strong>Cost Predictor</strong>, configure days & travelers, and customize expense categories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Estimate Fuel</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use <strong>Fuel Calculator</strong> to compute mountain petrol costs, bike rentals, and passenger splits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Track Spending</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Log daily receipts into <strong>Expense Tracker</strong> and monitor live remaining balances.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900">Export Reports</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download your verified trip audit in <strong>PDF & CSV spreadsheet</strong> format in 1 click!
            </p>
          </div>

        </div>
      </div>

      {/* STORAGE & PRIVACY ARCHITECTURE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              Zero Default Values & Ephemeral Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              All numbers default to <strong>0</strong> so you can enter your exact values manually. Unauthenticated guests store data only in temporary session storage (wiping clean when the browser closes). Log in with your email to persist your trip data across all your devices via Cloud Firestore!
            </p>
          </div>
        </div>

        {!user?.isVerified && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 shadow-md transition-all self-start md:self-auto"
          >
            🔒 Sign In to Sync Cloud Data
          </button>
        )}
      </div>

    </div>
  );
}
