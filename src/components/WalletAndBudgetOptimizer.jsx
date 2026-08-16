import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowRightLeft, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  Check, 
  TrendingUp, 
  ShieldAlert, 
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp, CATEGORY_DEFINITIONS } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function WalletAndBudgetOptimizer() {
  const { 
    budgets, 
    setBudgets, 
    expenses, 
    categoryStats, 
    totalBudget, 
    totalSpent, 
    totalRemaining 
  } = useApp();

  const [activeTab, setActiveTab] = useState('cash'); // 'cash' or 'reallocate'

  // Physical Cash Wallet State
  const [startingCash, setStartingCash] = useState(() => {
    const saved = localStorage.getItem('munnar_starting_cash');
    return saved ? Number(saved) : 5000;
  });

  const [atmWithdrawals, setAtmWithdrawals] = useState(() => {
    const saved = localStorage.getItem('munnar_atm_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  const [atmAmount, setAtmAmount] = useState('');
  const [atmLocation, setAtmLocation] = useState('Munnar Town ATM');
  const [isEditingStartingCash, setIsEditingStartingCash] = useState(false);
  const [tempStartingCash, setTempStartingCash] = useState(startingCash);

  // Budget Reallocation State
  const [fromCategory, setFromCategory] = useState('food');
  const [toCategory, setToCategory] = useState('tickets');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  // Persist cash data
  useEffect(() => {
    localStorage.setItem('munnar_starting_cash', startingCash.toString());
  }, [startingCash]);

  useEffect(() => {
    localStorage.setItem('munnar_atm_withdrawals', JSON.stringify(atmWithdrawals));
  }, [atmWithdrawals]);

  // Cash Calculations
  const totalAtmWithdrawn = atmWithdrawals.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalCashAdded = startingCash + totalAtmWithdrawn;

  // Expenses filtered by payment mode
  const cashSpent = expenses
    .filter((e) => e.paymentMode === 'Cash' || !e.paymentMode)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const upiSpent = expenses
    .filter((e) => e.paymentMode === 'UPI / GPay' || e.paymentMode === 'UPI')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const cardSpent = expenses
    .filter((e) => e.paymentMode === 'Card' || e.paymentMode === 'Debit/Credit Card')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const currentCashInPocket = totalCashAdded - cashSpent;
  const isLowCash = currentCashInPocket < 1000;

  // Add ATM Withdrawal
  const handleAddAtmWithdrawal = (e) => {
    e.preventDefault();
    const num = parseFloat(atmAmount);
    if (isNaN(num) || num <= 0) return;

    const newWithdrawal = {
      id: `atm_${Date.now()}`,
      amount: num,
      location: atmLocation.trim() || 'Munnar Town ATM',
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setAtmWithdrawals([newWithdrawal, ...atmWithdrawals]);
    setAtmAmount('');

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Save Starting Cash
  const handleSaveStartingCash = (e) => {
    e.preventDefault();
    const num = parseFloat(tempStartingCash);
    if (!isNaN(num) && num >= 0) {
      setStartingCash(num);
      setIsEditingStartingCash(false);
    }
  };

  // Reallocate Budget
  const handleReallocate = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid transfer amount in Rupees.');
      return;
    }
    if (fromCategory === toCategory) {
      alert('Please select two different categories to transfer funds between.');
      return;
    }

    const currentFromBudget = Number(budgets[fromCategory]) || 0;
    const currentFromSpent = categoryStats[fromCategory]?.spent || 0;
    const currentFromRemaining = currentFromBudget - currentFromSpent;

    if (amt > currentFromBudget) {
      alert(`Cannot transfer ₹${amt}. The allocated budget for ${CATEGORY_DEFINITIONS[fromCategory]?.name} is only ₹${currentFromBudget}.`);
      return;
    }

    const newBudgets = {
      ...budgets,
      [fromCategory]: Math.max(0, currentFromBudget - amt),
      [toCategory]: (Number(budgets[toCategory]) || 0) + amt
    };

    setBudgets(newBudgets);
    setTransferAmount('');
    setTransferSuccess(`Successfully transferred ₹${amt.toLocaleString('en-IN')} from ${CATEGORY_DEFINITIONS[fromCategory]?.name} to ${CATEGORY_DEFINITIONS[toCategory]?.name}!`);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => setTransferSuccess(''), 4000);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Money & Budget Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cash vs UPI Tracker & Smart Budget Reallocator 💵⚡
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track physical pocket cash for remote hill stalls + reallocate savings between categories dynamically!
          </p>
        </div>

        {/* Feature Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('cash')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cash'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💵 Cash vs UPI Wallet
          </button>
          <button
            onClick={() => setActiveTab('reallocate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reallocate'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Reallocate Savings
          </button>
        </div>
      </div>

      {/* TAB 1: CASH VS UPI WALLET TRACKER */}
      {activeTab === 'cash' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Low Cash Warning Banner */}
          {isLowCash && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-amber-900">
                  ⚠️ Low Physical Cash in Pocket (₹{Math.max(0, currentCashInPocket).toLocaleString('en-IN')} remaining)
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Remote Munnar areas (Kolukkumalai Jeep Base, Top Station, Marayoor Sandalwood stalls) have <strong>zero mobile/UPI network</strong>. Withdraw cash from Munnar Town ATMs before traveling!
                </p>
              </div>
            </div>
          )}

          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Physical Cash in Pocket */}
            <div className={`p-5 rounded-3xl border shadow-soft flex flex-col justify-between space-y-3 transition-colors ${
              isLowCash ? 'bg-amber-50/70 border-amber-300' : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Cash in Pocket</span>
                </div>
                <button
                  onClick={() => {
                    setTempStartingCash(startingCash);
                    setIsEditingStartingCash(!isEditingStartingCash);
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  {isEditingStartingCash ? 'Cancel' : 'Edit Base'}
                </button>
              </div>

              {isEditingStartingCash ? (
                <form onSubmit={handleSaveStartingCash} className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={tempStartingCash}
                    onChange={(e) => setTempStartingCash(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-bold"
                  />
                  <button type="submit" className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg">
                    Save
                  </button>
                </form>
              ) : (
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{Math.max(0, currentCashInPocket).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Started with ₹{startingCash.toLocaleString('en-IN')} + ₹{totalAtmWithdrawn.toLocaleString('en-IN')} ATM
                  </p>
                </div>
              )}
            </div>

            {/* UPI & Online Wallet */}
            <div className="p-5 rounded-3xl bg-sky-50/70 border border-sky-200 shadow-soft flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-600 text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">UPI / GPay / PhonePe</span>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{upiSpent.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Total online digital payments made
                </p>
              </div>
            </div>

            {/* Card Spending */}
            <div className="p-5 rounded-3xl bg-purple-50/70 border border-purple-200 shadow-soft flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Cards & Swipes</span>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{cardSpent.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Resort & hotel card payments
                </p>
              </div>
            </div>

          </div>

          {/* Payment Method Distribution Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>How You Are Spending (Cash vs Digital)</span>
            </h3>

            {totalSpent > 0 ? (
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded-full bg-slate-100 flex overflow-hidden">
                  <div 
                    style={{ width: `${(cashSpent / totalSpent) * 100}%` }} 
                    className="bg-emerald-500" 
                    title={`Cash: ₹${cashSpent}`}
                  ></div>
                  <div 
                    style={{ width: `${(upiSpent / totalSpent) * 100}%` }} 
                    className="bg-sky-500" 
                    title={`UPI: ₹${upiSpent}`}
                  ></div>
                  <div 
                    style={{ width: `${(cardSpent / totalSpent) * 100}%` }} 
                    className="bg-purple-500" 
                    title={`Card: ₹${cardSpent}`}
                  ></div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Cash: ₹{cashSpent.toLocaleString('en-IN')} ({Math.round((cashSpent / totalSpent) * 100)}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span>UPI: ₹{upiSpent.toLocaleString('en-IN')} ({Math.round((upiSpent / totalSpent) * 100)}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Card: ₹{cardSpent.toLocaleString('en-IN')} ({Math.round((cardSpent / totalSpent) * 100)}%)</span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Log expenses in the tracker to see your cash vs UPI breakdown!</p>
            )}
          </div>

          {/* ATM Cash Withdrawal Logger Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Log Cash Withdrawal from ATM</span>
            </h3>

            <form onSubmit={handleAddAtmWithdrawal} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="number"
                placeholder="Withdrawal Amount (e.g. ₹2,000)"
                value={atmAmount}
                onChange={(e) => setAtmAmount(e.target.value)}
                required
                min="100"
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-bold"
              />
              <input
                type="text"
                placeholder="ATM Location (e.g. SBI Munnar Town, Federal Bank)"
                value={atmLocation}
                onChange={(e) => setAtmLocation(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>+ Top Up Pocket Cash</span>
              </button>
            </form>

            {/* ATM Log History */}
            {atmWithdrawals.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ATM Cash Top-Up History
                </span>
                <div className="space-y-1.5">
                  {atmWithdrawals.map((atm) => (
                    <div key={atm.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{atm.location}</strong>
                        <span className="text-slate-400 text-[11px] ml-2">{atm.date} at {atm.time}</span>
                      </div>
                      <span className="font-black text-emerald-700">+₹{atm.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SMART CATEGORY BUDGET REALLOCATOR */}
      {activeTab === 'reallocate' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Transfer Success Toast */}
          {transferSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 shadow-xs animate-slideDown">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-bold">{transferSuccess}</p>
            </div>
          )}

          {/* 6 Category Balance Grid */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
              <span>Current 6-Category Surplus & Deficits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CATEGORY_DEFINITIONS).map(([key, cat]) => {
                const stat = categoryStats[key] || { allocated: 0, spent: 0, remaining: 0 };
                const isSurplus = stat.remaining > 0;

                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cat.fullName}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSurplus 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : stat.remaining < 0 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isSurplus ? `+₹${stat.remaining} Surplus` : stat.remaining < 0 ? `-₹${-stat.remaining} Over` : 'Exact'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Allocated: ₹{stat.allocated}</span>
                      <span className="font-bold text-slate-700">Spent: ₹{stat.spent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Fund Shift Tool */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Instant Fund Transfer Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Move Savings to Where You Need Them Most 🚀
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Saved money on food or hotel? Shift it straight to your <strong>Kolukkumalai Jeep Safari</strong> or <strong>Spices Shopping</strong> budget in 1 tap!
              </p>
            </div>

            <form onSubmit={handleReallocate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              
              {/* From Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Transfer From (Surplus Category):
                </label>
                <select
                  value={fromCategory}
                  onChange={(e) => setFromCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-emerald-400"
                >
                  {Object.entries(CATEGORY_DEFINITIONS).map(([key, cat]) => (
                    <option key={key} value={key} className="text-slate-900">
                      {cat.fullName} (₹{budgets[key] || 0} alloc)
                    </option>
                  ))}
                </select>
              </div>

              {/* To Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Transfer To (Needs Extra Funds):
                </label>
                <select
                  value={toCategory}
                  onChange={(e) => setToCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-emerald-400"
                >
                  {Object.entries(CATEGORY_DEFINITIONS).map(([key, cat]) => (
                    <option key={key} value={key} className="text-slate-900">
                      {cat.fullName} (₹{budgets[key] || 0} alloc)
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Button */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Amount (₹):
                  </label>
                  <input
                    type="number"
                    placeholder="₹ Amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-black text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all whitespace-nowrap"
                >
                  Transfer ₹
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </section>
  );
}
