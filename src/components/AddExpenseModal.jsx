import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Plus, 
  IndianRupee, 
  Calendar, 
  CreditCard, 
  FileText, 
  Check, 
  Tag,
  Sparkles
} from 'lucide-react';

export default function AddExpenseModal() {
  const { 
    isAddExpenseModalOpen, 
    setIsAddExpenseModalOpen, 
    addExpense, 
    prefilledCategory, 
    categoryStats,
    categoryDefinitions
  } = useApp();

  const activeCategories = Object.values(categoryDefinitions || {});
  const defaultCatId = prefilledCategory || (activeCategories[0]?.id || 'other');

  const [category, setCategory] = useState(defaultCatId);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledCategory) {
      setCategory(prefilledCategory);
    } else if (activeCategories.length > 0 && (!category || !categoryDefinitions[category])) {
      setCategory(activeCategories[0].id);
    }
  }, [prefilledCategory, isAddExpenseModalOpen, categoryDefinitions]);

  if (!isAddExpenseModalOpen) return null;

  const currentCatStat = categoryStats[category] || { remaining: 0, allocated: 0 };
  const previewRemaining = currentCatStat.remaining - (Number(amount) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid expense amount (minimum ₹1)');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a short title / description for this expense');
      return;
    }

    addExpense({
      category: category || activeCategories[0]?.id || 'other',
      amount: numAmount,
      title: title.trim(),
      paymentMode,
      note: note.trim(),
      date
    });

    setAmount('');
    setTitle('');
    setNote('');
    setError('');
    setIsAddExpenseModalOpen(false);
  };

  const quickAmounts = [50, 100, 250, 500, 1000, 2000, 3000, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 text-white relative">
          <button
            onClick={() => setIsAddExpenseModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Trip Expense Logger
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Log New Expense</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ₹1 & above
            </span>
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Updated amount will automatically reduce your remaining category budget.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Amount (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-black text-emerald-700">₹</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors shadow-xs"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-colors flex-shrink-0 border border-slate-200"
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          {activeCategories.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Expense Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeCategories.map((cat) => {
                  const isSelected = category === cat.id;
                  const stat = categoryStats[cat.id] || { remaining: 0 };

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <Tag className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-700 font-medium">₹{stat.remaining.toLocaleString('en-IN')} left</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-Time Balance Impact Callout */}
          {amount > 0 && categoryDefinitions[category] && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Current {categoryDefinitions[category]?.name} Remaining:</span>
                <span className="font-bold">₹{currentCatStat.remaining.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Deduction:</span>
                <span className="font-bold text-rose-600">-₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-black">
                <span className="text-slate-800">New Remaining Balance:</span>
                <span className={previewRemaining < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  ₹{previewRemaining.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Details / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fuel at Adimali / Kerala Lunch / Jeep Ride"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Payment Mode & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-medium bg-white"
              >
                <option value="UPI">📱 UPI / GPay / PhonePe</option>
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Credit/Debit Card</option>
                <option value="NetBanking">🏦 Net Banking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-medium bg-white"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Optional Notes / Bill Details
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Paid for 4 people / Received GST bill"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 custom-scrollbar resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Save & Deduct From Budget</span>
          </button>

        </form>
      </div>
    </div>
  );
}
