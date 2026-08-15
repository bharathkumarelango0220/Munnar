import React, { useState } from 'react';
import { useApp, CATEGORY_DEFINITIONS } from '../context/AppContext';
import { 
  Wallet, 
  Plus, 
  Settings, 
  Trash2, 
  Download, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  CreditCard, 
  Calendar, 
  FileSpreadsheet, 
  IndianRupee,
  Bike,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Ticket,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  Check
} from 'lucide-react';

const ICON_MAP = {
  Bike,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Ticket,
  ShieldAlert
};

export default function ExpenseTracker() {
  const { 
    budgets, 
    expenses, 
    categoryStats, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    isBudgetConfigured,
    updateBudgets,
    loadExampleTemplate,
    resetAllData,
    setIsAddExpenseModalOpen, 
    setIsSetBudgetModalOpen, 
    openAddExpenseForCategory,
    deleteExpense, 
    setActiveTab 
  } = useApp();

  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Quick inline inputs state if user wants to set budget directly on-page
  const [inlineBudgets, setInlineBudgets] = useState({
    bike: budgets.bike || '',
    food: budgets.food || '',
    snacks: budgets.snacks || '',
    rooms: budgets.rooms || '',
    tickets: budgets.tickets || '',
    unexpected: budgets.unexpected || ''
  });

  const handleSaveInlineBudgets = (e) => {
    e.preventDefault();
    updateBudgets(inlineBudgets);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = selectedFilterCategory === 'all' || exp.category === selectedFilterCategory;
    const matchesSearch = 
      exp.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (exp.note && exp.note.toLowerCase().includes(searchFilter.toLowerCase())) ||
      exp.amount.toString().includes(searchFilter);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="space-y-6">
      
      {/* Tracker Top Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Munnar Trip Budget & Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            6-Category Dynamic Expense Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set your custom budget for each category, then record expenses to track your remaining balance in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSetBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <Sliders className="w-4 h-4 text-slate-500" />
            <span>{isBudgetConfigured ? 'Adjust Budgets' : 'Set Budgets'}</span>
          </button>

          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* STEP 1: If user hasn't set their budget yet, show prominent setup wizard banner */}
      {!isBudgetConfigured && (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-5 sm:p-7 border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Step 1: Set Your Custom Trip Budget
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-2">
                Fix Your Budgets For Each Category First
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter how much money you want to allocate for <strong>Bike, Food, Snacks, Rooms, Entry Tickets & Unexpected Expenses</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadExampleTemplate}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 text-xs font-bold transition-colors"
                title="Load sample numbers (₹15,000 for Bike, etc.)"
              >
                ✨ Load Example Demo
              </button>

              <button
                onClick={() => setIsSetBudgetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition-all"
              >
                Open Budget Setup Modal →
              </button>
            </div>
          </div>

          {/* Quick Direct Inputs */}
          <form onSubmit={handleSaveInlineBudgets} className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {Object.values(CATEGORY_DEFINITIONS).map((cat) => {
                const IconComponent = ICON_MAP[cat.icon] || Sparkles;
                return (
                  <div key={cat.id} className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-1.5 mb-1.5 text-emerald-300">
                      <IconComponent className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">{cat.name}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={inlineBudgets[cat.id]}
                        onChange={(e) => setInlineBudgets({ ...inlineBudgets, [cat.id]: e.target.value })}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-all"
              >
                Save My Budgets & Start Tracking →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global Budget Overview Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Trip Overview</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                spent of ₹{totalBudget.toLocaleString('en-IN')} planned
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Remaining Balance</span>
              <span className={`text-xl sm:text-2xl font-black ${totalRemaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{totalRemaining.toLocaleString('en-IN')}
              </span>
            </div>
            
            <button
              onClick={() => setActiveTab('reports')}
              className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="View & Download PDF Expense Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">Trip Budget Consumed</span>
            <span className={totalPercentUsed > 100 ? 'text-rose-600' : totalPercentUsed > 80 ? 'text-amber-600' : 'text-emerald-700'}>
              {totalPercentUsed}% Used
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalPercentUsed > 100 
                  ? 'bg-rose-500' 
                  : totalPercentUsed > 80 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${Math.min(totalPercentUsed, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 6 Category Dynamic Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            6 Category Allocations & Real-Time Balance
          </h3>
          <button
            onClick={() => setIsSetBudgetModalOpen(true)}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            ✏️ Edit Category Budgets
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {Object.values(CATEGORY_DEFINITIONS).map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            const stat = categoryStats[cat.id] || {
              allocated: 0,
              spent: 0,
              remaining: 0,
              percentUsed: 0,
              expenseCount: 0,
              isConfigured: false,
              isExceeded: false,
              isClose: false
            };

            return (
              <div
                key={cat.id}
                className={`group bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between shadow-soft hover:shadow-md ${
                  stat.isExceeded
                    ? 'border-rose-200 ring-1 ring-rose-300/50 bg-rose-50/20'
                    : stat.isClose
                    ? 'border-amber-200 ring-1 ring-amber-300/50'
                    : !stat.isConfigured
                    ? 'border-dashed border-slate-300 bg-slate-50/50'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{cat.name}</h4>
                        <p className="text-[10px] text-slate-700 font-medium line-clamp-1">{cat.subtitle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openAddExpenseForCategory(cat.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                      title={`Log expense for ${cat.name}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add ₹</span>
                    </button>
                  </div>

                  {/* Numbers Breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 my-2.5 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Budget</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                        ₹{stat.allocated.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Spent</span>
                      <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                        ₹{stat.spent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Remaining</span>
                      <span className={`text-xs sm:text-sm font-black ${stat.remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        ₹{stat.remaining.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Category Progress Bar */}
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>{stat.expenseCount} {stat.expenseCount === 1 ? 'transaction' : 'transactions'}</span>
                      <span className={stat.isExceeded ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {stat.allocated > 0 ? `${stat.percentUsed}%` : 'Not set'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stat.isExceeded
                            ? 'bg-rose-500'
                            : stat.isClose
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(stat.percentUsed, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Status Notice if Exceeded or Not Configured */}
                {stat.isExceeded && (
                  <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span>Exceeded budget by ₹{Math.abs(stat.remaining).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {!stat.isConfigured && (
                  <button
                    onClick={() => setIsSetBudgetModalOpen(true)}
                    className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline w-full"
                  >
                    <span>+ Set {cat.name} Budget</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Transactions Ledger Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        
        {/* Ledger Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Itemized Expenses History
            </h3>
            <p className="text-xs text-slate-500">
              {expenses.length > 0
                ? `Total ${expenses.length} records logged for this Munnar trip`
                : 'No expenses recorded yet. Tap "+ Add Expense" to start logging!'}
            </p>
          </div>

          {/* Search & Reset */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {expenses.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all trip expenses and budgets to start fresh?')) {
                    resetAllData();
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Reset trip data for a new trip"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        {expenses.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedFilterCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories ({expenses.length})
            </button>

            {Object.values(CATEGORY_DEFINITIONS).map((cat) => {
              const count = expenses.filter((e) => e.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                    selectedFilterCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No expenses logged yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you spend even ₹1 (on Bike fuel, Food, Tea snacks, Rooms, or Tickets), log it here to track your budget reduction.
            </p>
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log First Expense (₹1+)</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExpenses.map((item) => {
              const catDef = CATEGORY_DEFINITIONS[item.category] || { name: item.category, color: 'slate' };
              const IconComp = ICON_MAP[catDef.icon] || Sparkles;

              return (
                <div
                  key={item.id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                      <IconComp className="w-4 h-4 text-emerald-700" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 hidden sm:inline">
                          {catDef.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 mt-0.5">
                        <span>{item.date} • {item.time}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{item.paymentMode}</span>
                        {item.note && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 truncate max-w-[120px] sm:max-w-[200px] italic">"{item.note}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        -₹{item.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-700 font-medium sm:hidden">{catDef.name}</span>
                    </div>

                    <button
                      onClick={() => deleteExpense(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </section>
  );
}
