import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  Plus, 
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
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  Tag,
  Calculator,
  Check
} from 'lucide-react';

export default function ExpenseTracker() {
  const { 
    user,
    setIsAuthModalOpen,
    budgets, 
    expenses, 
    categoryDefinitions,
    categoryStats, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    isBudgetConfigured,
    resetAllData,
    setIsAddExpenseModalOpen, 
    openAddExpenseForCategory,
    deleteExpense, 
    setActiveTab 
  } = useApp();

  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const activeCategories = Object.values(categoryDefinitions || {});
  const hasCategories = isBudgetConfigured && activeCategories.length > 0;

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = selectedFilterCategory === 'all' || exp.category === selectedFilterCategory;
    const matchesSearch = 
      exp.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (exp.note && exp.note.toLowerCase().includes(searchFilter.toLowerCase())) ||
      exp.amount.toString().includes(searchFilter);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Tracker Top Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Trip Budget & Spending Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Expense & Budget Tracker 💰📊
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log expenses across your customized trip categories to monitor your live remaining balances.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('predictor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>{hasCategories ? 'Edit in Predictor' : 'Setup in Predictor'}</span>
          </button>

          {hasCategories && (
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* INITIAL ONBOARDING STATE: If no categories configured yet */}
      {!hasCategories ? (
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Calculator className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step 1: Setup Your Trip Categories
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              No Expense Categories Added Yet!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use our smart <strong>Cost Predictor</strong> to calculate your budget, add custom expenses (Campfire, Guide, Safari), delete what you don't need, and start tracking your trip!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('predictor')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              <span>Go to Cost Predictor & Add Categories 🚀</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Summary Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Trip Spending Overview ({activeCategories.length} Categories)
                </span>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl sm:text-4xl font-black text-white">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </h3>
                  <span className="text-sm font-semibold text-slate-400">
                    of ₹{totalBudget.toLocaleString('en-IN')} Budget
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-4 rounded-2xl border ${
                  totalRemaining < 0 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  <span className="text-[11px] font-medium block">
                    {totalRemaining < 0 ? 'Over Budget By' : 'Remaining Balance'}
                  </span>
                  <p className="text-xl font-black mt-0.5">
                    ₹{Math.abs(totalRemaining).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(totalPercentUsed, 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalPercentUsed > 100 
                      ? 'bg-rose-500' 
                      : totalPercentUsed > 85 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-400'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>{totalPercentUsed}% of total trip budget spent</span>
                <span>{expenses.length} total expenses logged</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CATEGORY CARDS GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Your Customized Categories ({activeCategories.length})
              </h3>
              <button
                onClick={() => setActiveTab('predictor')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                + Add / Remove Categories
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {activeCategories.map((cat) => {
                const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0, expenseCount: 0 };
                const isOver = stat.spent > stat.allocated && stat.allocated > 0;

                return (
                  <div
                    key={cat.id}
                    className={`p-4 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-3 ${
                      isOver ? 'border-rose-300 shadow-soft ring-1 ring-rose-300' : 'border-slate-200 shadow-soft hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{cat.name}</h4>
                          <span className="text-[10px] text-slate-400">{stat.expenseCount} logged</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openAddExpenseForCategory(cat.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title={`Add ${cat.name} expense`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-lg font-black text-slate-900">
                          ₹{stat.spent.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400">
                          of ₹{stat.allocated.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${Math.min(stat.percentUsed, 100)}%` }}
                          className={`h-full rounded-full transition-all ${
                            isOver ? 'bg-rose-500' : stat.percentUsed > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[11px] font-bold mt-1.5">
                        <span className={stat.remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                          {stat.remaining < 0 ? `-₹${Math.abs(stat.remaining)} over` : `₹${stat.remaining} left`}
                        </span>
                        <span className="text-slate-400">{stat.percentUsed}% used</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXPENSES LOG TABLE WITH SEARCH & FILTER */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Expense Ledger ({filteredExpenses.length})
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <select
                  value={selectedFilterCategory}
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  {activeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Report</span>
                </button>
              </div>
            </div>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs space-y-2">
                <p>No expenses recorded yet.</p>
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log your first trip expense</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => {
                  const cat = categoryDefinitions[exp.category] || { name: exp.category };
                  return (
                    <div key={exp.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                          {exp.paymentMode || 'UPI'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{exp.title}</h4>
                          <p className="text-[11px] text-slate-400">
                            {cat.name} • {exp.date} {exp.time ? `at ${exp.time}` : ''}
                            {exp.note ? ` • "${exp.note}"` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          ₹{Number(exp.amount).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reset Trip Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={resetAllData}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Categories & Expenses</span>
              </button>
            </div>

          </div>
        </>
      )}

    </section>
  );
}
