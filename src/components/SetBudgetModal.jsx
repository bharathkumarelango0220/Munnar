import React, { useState, useEffect } from 'react';
import { useApp, CATEGORY_DEFINITIONS } from '../context/AppContext';
import { 
  X, 
  Settings, 
  IndianRupee, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Bike, 
  UtensilsCrossed, 
  Coffee, 
  BedDouble, 
  Ticket, 
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

const ICON_MAP = {
  Bike,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Ticket,
  ShieldAlert
};

export default function SetBudgetModal() {
  const { 
    isSetBudgetModalOpen, 
    setIsSetBudgetModalOpen, 
    budgets, 
    updateBudgets,
    isBudgetConfigured 
  } = useApp();

  const [formData, setFormData] = useState({
    bike: budgets.bike || '',
    food: budgets.food || '',
    snacks: budgets.snacks || '',
    rooms: budgets.rooms || '',
    tickets: budgets.tickets || '',
    unexpected: budgets.unexpected || ''
  });

  useEffect(() => {
    setFormData({
      bike: budgets.bike || '',
      food: budgets.food || '',
      snacks: budgets.snacks || '',
      rooms: budgets.rooms || '',
      tickets: budgets.tickets || '',
      unexpected: budgets.unexpected || ''
    });
  }, [budgets, isSetBudgetModalOpen]);

  if (!isSetBudgetModalOpen) return null;

  const totalCalculated = Object.values(formData).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const handleApplyPreset = (preset) => {
    setFormData(preset);
  };

  const handleClearAll = () => {
    setFormData({
      bike: '',
      food: '',
      snacks: '',
      rooms: '',
      tickets: '',
      unexpected: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBudgets(formData);
    setIsSetBudgetModalOpen(false);
  };

  const presets = [
    {
      name: '🏍️ Bike & Friends Trip',
      desc: 'High bike & room budget',
      total: '₹42,000',
      data: { bike: 15000, food: 8000, snacks: 3000, rooms: 10000, tickets: 3000, unexpected: 3000 }
    },
    {
      name: '🎒 Solo Explorer',
      desc: 'Economical travel',
      total: '₹18,000',
      data: { bike: 6000, food: 3500, snacks: 1500, rooms: 4500, tickets: 1500, unexpected: 1000 }
    },
    {
      name: '🏨 Family / Luxury Stay',
      desc: 'Premium resort & dining',
      total: '₹65,000',
      data: { bike: 8000, food: 15000, snacks: 4000, rooms: 28000, tickets: 5000, unexpected: 5000 }
    }
  ];

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
              Step 1: Budget Setup
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Set Your Custom Category Budgets
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Fix your budget limits for each category. As you log expenses, remaining amounts will decrease in real-time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Helpful Tip */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>How it works:</strong> If you set <strong>₹15,000</strong> for Bike and spend ₹3,000, your remaining Bike budget automatically becomes <strong>₹12,000</strong>.
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Fill Templates (Optional)
              </label>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 underline"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p.data)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
                >
                  <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-800 block">{p.name}</span>
                  <span className="text-[11px] text-emerald-700 font-extrabold block">{p.total}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6 Category Inputs */}
          <div className="space-y-2.5 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Your Budget For 6 Categories (₹)
            </label>

            {Object.values(CATEGORY_DEFINITIONS).map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || Sparkles;

              return (
                <div key={cat.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 shadow-xs">
                    <IconComponent className="w-5 h-5 text-emerald-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-700 block truncate">{cat.subtitle}</span>
                  </div>

                  <div className="relative w-32 flex-shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="0"
                      value={formData[cat.id]}
                      onChange={(e) => setFormData({ ...formData, [cat.id]: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary Footer */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-semibold text-slate-300">Total Planned Trip Budget</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Sum of all 6 categories</span>
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
              <span>Save & Start Recording Expenses</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
