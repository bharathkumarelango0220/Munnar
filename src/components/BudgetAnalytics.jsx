import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Wallet, 
  Calculator, 
  Layers, 
  Award, 
  DollarSign, 
  Percent, 
  CreditCard, 
  Banknote, 
  SmartphoneNfc,
  Info
} from 'lucide-react';

export default function BudgetAnalytics() {
  const { 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed, 
    categoryDefinitions, 
    budgets, 
    expenses,
    setActiveTab,
    setIsAddExpenseModalOpen
  } = useApp();

  const activeCategories = Object.values(categoryDefinitions || {});

  // Category-wise analytics
  const categoryAnalytics = useMemo(() => {
    return activeCategories.map((cat) => {
      const allocated = Number(budgets[cat.id]) || 0;
      const spent = expenses
        .filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const remaining = allocated - spent;
      const percentUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : spent > 0 ? 100 : 0;

      let status = 'safe'; // 'safe' | 'warning' | 'danger'
      if (spent > allocated && allocated > 0) {
        status = 'danger';
      } else if (percentUsed >= 80) {
        status = 'warning';
      }

      return {
        ...cat,
        allocated,
        spent,
        remaining,
        percentUsed,
        status
      };
    });
  }, [activeCategories, budgets, expenses]);

  // High alert categories (Overbudget or >= 80% used)
  const overBudgetCategories = categoryAnalytics.filter((c) => c.status === 'danger');
  const warningCategories = categoryAnalytics.filter((c) => c.status === 'warning');
  const safeCategories = categoryAnalytics.filter((c) => c.status === 'safe' && c.allocated > 0);

  // Payment mode split
  const paymentBreakdown = useMemo(() => {
    const counts = { UPI: 0, Cash: 0, Card: 0 };
    expenses.forEach((e) => {
      const mode = e.paymentMode || 'Cash';
      counts[mode] = (counts[mode] || 0) + (Number(e.amount) || 0);
    });
    return counts;
  }, [expenses]);

  // Largest single expense transaction
  const largestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  }, [expenses]);

  // Trip Health Grade Calculation
  const tripGrade = useMemo(() => {
    if (totalBudget === 0 && totalSpent === 0) {
      return { grade: 'A+', label: 'Ready to Plan', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'No expenses recorded yet. You are completely within control!' };
    }
    if (totalSpent === 0) {
      return { grade: 'A+', label: '100% Budget Intact', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Your full allocated trip budget is preserved!' };
    }
    if (totalBudget === 0) {
      return { grade: 'B', label: 'Unbudgeted Spend', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: 'Expenses recorded without target budgets. Set budgets in Cost Predictor!' };
    }

    const ratio = totalSpent / totalBudget;
    if (ratio <= 0.6) {
      return { grade: 'A+', label: 'Master Saver', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: `Used only ${totalPercentUsed}% of total budget. Excellent financial control!` };
    } else if (ratio <= 0.85) {
      return { grade: 'A', label: 'On Track', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200', desc: `Used ${totalPercentUsed}% of total budget. Healthy spending pace.` };
    } else if (ratio <= 1.0) {
      return { grade: 'B', label: 'Near Limit', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: `Used ${totalPercentUsed}% of total budget. Caution on upcoming expenses!` };
    } else {
      return { grade: 'C-', label: 'Overbudget', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', desc: `Overspent by ₹${Math.abs(totalRemaining).toLocaleString('en-IN')}. Review alerts below!` };
    }
  }, [totalBudget, totalSpent, totalRemaining, totalPercentUsed]);

  // If no categories configured at all
  if (activeCategories.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-soft max-w-2xl mx-auto space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            No Budget Categories Configured Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Configure your custom categories & allocate budgets in the <strong>Cost Predictor</strong> to unlock visual spending charts, health scores, and overspending radars!
          </p>
        </div>
        <button
          onClick={() => {
            setActiveTab('predictor');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
        >
          <Calculator className="w-4 h-4" />
          <span>🚀 Go to Cost Predictor & Add Categories</span>
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Budget Intelligence & Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Budget Analytics & Overspending Radar 📊🎯
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visual budget vs actual analysis, spending health ratings, category limits, and anomaly radar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>+ Log Expense</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TRIP FINANCIAL HEALTH GRADE & KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Trip Grade Card */}
        <div className={`p-6 rounded-3xl border ${tripGrade.bg} flex flex-col justify-between space-y-4 shadow-soft`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Trip Health Score
            </span>
            <Award className={`w-5 h-5 ${tripGrade.color}`} />
          </div>

          <div className="flex items-baseline gap-3">
            <span className={`text-5xl sm:text-6xl font-black tracking-tight ${tripGrade.color}`}>
              {tripGrade.grade}
            </span>
            <div>
              <span className={`text-base font-black block ${tripGrade.color}`}>
                {tripGrade.label}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Financial Efficiency</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
            {tripGrade.desc}
          </p>
        </div>

        {/* Budget vs Spent Summary Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Budget vs. Actual
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
              {totalPercentUsed}% Used
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Allocated Budget:</span>
              <strong className="text-lg font-black text-slate-900">
                ₹{totalBudget.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Total Spent:</span>
              <strong className="text-lg font-black text-amber-600">
                ₹{totalSpent.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Net Remaining:</span>
              <strong className={`text-lg font-black ${totalRemaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                ₹{totalRemaining.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                totalPercentUsed > 100 ? 'bg-rose-500' : totalPercentUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, totalPercentUsed)}%` }}
            ></div>
          </div>
        </div>

        {/* Transaction Highlights Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Expense Insights
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Transactions Logged:</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {expenses.length} {expenses.length === 1 ? 'Receipt' : 'Receipts'}
              </p>
            </div>

            {largestExpense ? (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Highest Single Expense:</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {largestExpense.title}
                </p>
                <span className="text-xs font-black text-rose-600">
                  ₹{Number(largestExpense.amount).toLocaleString('en-IN')} ({largestExpense.date})
                </span>
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No transactions logged yet.</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Payment Modes:</span>
            <span className="font-bold text-slate-700">
              UPI ₹{paymentBreakdown.UPI.toLocaleString('en-IN')} | Cash ₹{paymentBreakdown.Cash.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 2: OVERSPENDING RADAR & ALERTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Smart Overspending Radar & Budget Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Real-time category status monitor
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {overBudgetCategories.length} Exceeded • {warningCategories.length} Near Limit
          </span>
        </div>

        {/* Alert Banners */}
        {overBudgetCategories.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Overbudget Alert in {overBudgetCategories.length} Category!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {overBudgetCategories.map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-xl bg-white border border-rose-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{cat.name}</span>
                    <span className="text-rose-600 font-black">+{cat.percentUsed}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spent ₹{cat.spent.toLocaleString('en-IN')} of ₹{cat.allocated.toLocaleString('en-IN')} (Over by ₹{Math.abs(cat.remaining).toLocaleString('en-IN')})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {warningCategories.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Warning: {warningCategories.length} Category reaching 80%+ limit</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {warningCategories.map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{cat.name}</span>
                    <span className="text-amber-600 font-black">{cat.percentUsed}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Only ₹{cat.remaining.toLocaleString('en-IN')} remaining before exceeding budget.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {overBudgetCategories.length === 0 && warningCategories.length === 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All categories are within healthy spending limits. No budget anomalies detected!
            </span>
          </div>
        )}
      </div>

      {/* SECTION 3: VISUAL CATEGORY BUDGET VS ACTUAL PROGRESS BARS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Category-by-Category Spending Breakdown 📈
            </h3>
            <p className="text-xs text-slate-500">
              Compare allocated funds vs real-time money spent for every custom category
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('predictor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Adjust Allocations in Predictor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryAnalytics.map((cat) => (
            <div 
              key={cat.id} 
              className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeBg}`}>
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                    cat.status === 'danger' 
                      ? 'bg-rose-100 text-rose-700' 
                      : cat.status === 'warning' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {cat.percentUsed}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Spent:</span>
                  <strong className="text-sm font-black text-slate-900">
                    ₹{cat.spent.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="text-center">
                  <span className="text-slate-400 text-[11px] block">Budget:</span>
                  <strong className="text-sm font-black text-slate-700">
                    ₹{cat.allocated.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Balance:</span>
                  <strong className={`text-sm font-black ${cat.remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {cat.remaining < 0 ? `-₹${Math.abs(cat.remaining).toLocaleString('en-IN')}` : `₹${cat.remaining.toLocaleString('en-IN')}`}
                  </strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.status === 'danger' 
                      ? 'bg-rose-500' 
                      : cat.status === 'warning' 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, cat.percentUsed)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: PAYMENT METHOD SPLIT (UPI vs Cash vs Card) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Payment Channel Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <SmartphoneNfc className="w-4 h-4 text-emerald-600" />
              <span>UPI / Online / GPay</span>
            </div>
            <p className="text-xl font-black text-slate-900">
              ₹{paymentBreakdown.UPI.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">
              {totalSpent > 0 ? Math.round((paymentBreakdown.UPI / totalSpent) * 100) : 0}% of total spend
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Banknote className="w-4 h-4 text-teal-600" />
              <span>Cash Payments</span>
            </div>
            <p className="text-xl font-black text-slate-900">
              ₹{paymentBreakdown.Cash.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">
              {totalSpent > 0 ? Math.round((paymentBreakdown.Cash / totalSpent) * 100) : 0}% of total spend
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Debit / Credit Card</span>
            </div>
            <p className="text-xl font-black text-slate-900">
              ₹{paymentBreakdown.Card.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">
              {totalSpent > 0 ? Math.round((paymentBreakdown.Card / totalSpent) * 100) : 0}% of total spend
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
