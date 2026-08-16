import React, { useState } from 'react';
import { 
  Smartphone, 
  Banknote, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Receipt, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp, CATEGORY_DEFINITIONS } from '../context/AppContext';

export default function CashAndGpayTracker() {
  const { 
    expenses, 
    deleteExpense, 
    setIsAddExpenseModalOpen, 
    totalSpent, 
    totalBudget, 
    totalRemaining 
  } = useApp();

  const [paymentFilter, setPaymentFilter] = useState('All'); // 'All', 'UPI', 'Cash', 'Card'

  // Calculations by Payment Mode
  const upiExpenses = expenses.filter(
    (e) => e.paymentMode === 'UPI' || e.paymentMode === 'UPI / GPay' || e.paymentMode === 'GPay' || e.paymentMode === 'PhonePe'
  );
  const upiTotal = upiExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const cashExpenses = expenses.filter(
    (e) => e.paymentMode === 'Cash'
  );
  const cashTotal = cashExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const cardExpenses = expenses.filter(
    (e) => e.paymentMode === 'Card' || e.paymentMode === 'Debit/Credit Card' || e.paymentMode === 'NetBanking'
  );
  const cardTotal = cardExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Other/Uncategorized payments
  const otherExpenses = expenses.filter(
    (e) => !['UPI', 'UPI / GPay', 'GPay', 'PhonePe', 'Cash', 'Card', 'Debit/Credit Card', 'NetBanking'].includes(e.paymentMode)
  );
  const otherTotal = otherExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Filtered list for display
  const displayedExpenses = expenses.filter((e) => {
    if (paymentFilter === 'All') return true;
    if (paymentFilter === 'UPI') return ['UPI', 'UPI / GPay', 'GPay', 'PhonePe'].includes(e.paymentMode);
    if (paymentFilter === 'Cash') return e.paymentMode === 'Cash';
    if (paymentFilter === 'Card') return ['Card', 'Debit/Credit Card', 'NetBanking'].includes(e.paymentMode);
    return true;
  });

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Payment Mode Breakdown</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            GPay / UPI vs Cash Spending Tracker 📱💵
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time breakdown of online digital payments vs cash paid across all your Munnar trip expenses.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Log Expense</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* 1. UPI / GPay Total */}
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-3xl p-5 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-sky-600 text-white shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 block">UPI / GPay / PhonePe</span>
                <span className="text-[10px] text-sky-700 font-semibold">{upiExpenses.length} Transactions</span>
              </div>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-sky-200 text-sky-900">
              {totalSpent > 0 ? `${Math.round((upiTotal / totalSpent) * 100)}%` : '0%'}
            </span>
          </div>

          <div>
            <p className="text-3xl font-black text-sky-950">
              ₹{upiTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-sky-700 mt-0.5">
              Online digital QR & UPI transfers
            </p>
          </div>
        </div>

        {/* 2. Cash Total */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Cash Payments</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{cashExpenses.length} Transactions</span>
              </div>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {totalSpent > 0 ? `${Math.round((cashTotal / totalSpent) * 100)}%` : '0%'}
            </span>
          </div>

          <div>
            <p className="text-3xl font-black text-emerald-950">
              ₹{cashTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Physical cash paid at stalls & taxis
            </p>
          </div>
        </div>

        {/* 3. Card / Bank Total */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-3xl p-5 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-purple-600 text-white shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 block">Cards & Swipes</span>
                <span className="text-[10px] text-purple-700 font-semibold">{cardExpenses.length} Transactions</span>
              </div>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
              {totalSpent > 0 ? `${Math.round((cardTotal / totalSpent) * 100)}%` : '0%'}
            </span>
          </div>

          <div>
            <p className="text-3xl font-black text-purple-950">
              ₹{cardTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-purple-700 mt-0.5">
              Resort & hotel card payments
            </p>
          </div>
        </div>

      </div>

      {/* Visual Spending Proportion Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Digital vs Cash Spending Share</span>
          </h3>
          <span className="text-xs font-bold text-slate-700">
            Total Spent: <strong>₹{totalSpent.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        {totalSpent > 0 ? (
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
              {upiTotal > 0 && (
                <div 
                  style={{ width: `${(upiTotal / totalSpent) * 100}%` }} 
                  className="bg-sky-500 transition-all duration-500" 
                  title={`UPI: ₹${upiTotal}`}
                ></div>
              )}
              {cashTotal > 0 && (
                <div 
                  style={{ width: `${(cashTotal / totalSpent) * 100}%` }} 
                  className="bg-emerald-500 transition-all duration-500" 
                  title={`Cash: ₹${cashTotal}`}
                ></div>
              )}
              {cardTotal > 0 && (
                <div 
                  style={{ width: `${(cardTotal / totalSpent) * 100}%` }} 
                  className="bg-purple-500 transition-all duration-500" 
                  title={`Card: ₹${cardTotal}`}
                ></div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
              <span className="flex items-center gap-1.5 text-sky-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>UPI / GPay: ₹{upiTotal.toLocaleString('en-IN')} ({Math.round((upiTotal / totalSpent) * 100)}%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Cash: ₹{cashTotal.toLocaleString('en-IN')} ({Math.round((cashTotal / totalSpent) * 100)}%)</span>
              </span>
              {cardTotal > 0 && (
                <span className="flex items-center gap-1.5 text-purple-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Cards: ₹{cardTotal.toLocaleString('en-IN')} ({Math.round((cardTotal / totalSpent) * 100)}%)</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No expenses recorded yet. Click <strong>"+ Log Expense"</strong> and select <strong>UPI</strong> or <strong>Cash</strong>!
          </div>
        )}
      </div>

      {/* Itemized Transactions with Payment Mode Filter */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Itemized Transactions ({displayedExpenses.length})</span>
          </h3>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {['All', 'UPI', 'Cash', 'Card'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPaymentFilter(mode)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  paymentFilter === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode === 'All' ? 'All (Total)' : mode === 'UPI' ? '📱 UPI/GPay' : mode === 'Cash' ? '💵 Cash' : '💳 Cards'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {displayedExpenses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            {expenses.length === 0 
              ? 'No trip expenses added yet. Click "+ Log Expense" above to get started!' 
              : `No expenses found matching the "${paymentFilter}" filter.`}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedExpenses.map((exp) => {
              const catDef = CATEGORY_DEFINITIONS[exp.category] || {};
              const isUpi = exp.paymentMode === 'UPI' || exp.paymentMode === 'UPI / GPay';
              const isCash = exp.paymentMode === 'Cash';

              return (
                <div key={exp.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-xs font-bold ${
                      isUpi 
                        ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                        : isCash 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {isUpi ? '📱 UPI' : isCash ? '💵 Cash' : '💳 Card'}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{exp.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{catDef.fullName || exp.category}</span>
                        <span>•</span>
                        <span>{exp.date}</span>
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

      </div>

    </section>
  );
}
