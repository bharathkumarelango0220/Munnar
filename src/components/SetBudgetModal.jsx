import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Settings, 
  IndianRupee, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Tag,
  ArrowRight,
  Info
} from 'lucide-react';

export default function SetBudgetModal() {
  const { 
    isSetBudgetModalOpen, 
    setIsSetBudgetModalOpen, 
    budgets, 
    updateBudgets,
    categoryDefinitions
  } = useApp();

  const activeCategories = Object.values(categoryDefinitions || {});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initial = {};
    activeCategories.forEach((cat) => {
      initial[cat.id] = budgets[cat.id] || '';
    });
    setFormData(initial);
  }, [budgets, isSetBudgetModalOpen, categoryDefinitions]);

  if (!isSetBudgetModalOpen) return null;

  const totalCalculated = Object.values(formData).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBudgets(formData);
    setIsSetBudgetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 text-white relative">
          <button
            onClick={() => setIsSetBudgetModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Trip Budget Limits
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Adjust Category Budgets
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Modify budget allocations for each of your trip categories.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Category Inputs */}
          <div className="space-y-2.5 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Allocated Budget (₹ INR)
            </label>

            {activeCategories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 shadow-xs">
                  <Tag className="w-5 h-5 text-emerald-700" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{cat.subtitle || 'Custom category'}</span>
                </div>

                <div className="relative w-32 flex-shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="0"
                    value={formData[cat.id] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [cat.id]: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary Footer */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-semibold text-slate-300">Total Planned Trip Budget</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Sum of all categories</span>
            </div>
            <span className="text-xl font-black text-emerald-300">
              ₹{totalCalculated.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsSetBudgetModalOpen(false)}
              className="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Save Budget Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
