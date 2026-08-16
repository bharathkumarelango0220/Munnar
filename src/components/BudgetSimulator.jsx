import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  Sparkles, 
  Users, 
  Calendar, 
  Hotel, 
  Car, 
  UtensilsCrossed, 
  Ticket, 
  ShoppingBag, 
  TrendingDown, 
  TrendingUp, 
  RotateCcw, 
  Share2, 
  Check, 
  Target,
  ArrowRight
} from 'lucide-react';

export default function BudgetSimulator() {
  const { totalBudget, saveTripCategories, setActiveTab } = useApp();

  // All values start at 0 (Zero defaults)
  const [days, setDays] = useState(0);
  const [travelers, setTravelers] = useState(0);
  const [stayPerNight, setStayPerNight] = useState(0);
  const [foodPerPersonPerDay, setFoodPerPersonPerDay] = useState(0);
  const [travelPerDay, setTravelPerDay] = useState(0);
  const [activitiesPerPerson, setActivitiesPerPerson] = useState(0);
  const [shoppingPerPerson, setShoppingPerPerson] = useState(0);
  const [targetBudget, setTargetBudget] = useState(totalBudget || 0);

  const [copied, setCopied] = useState(false);

  // Calculations
  const roomCount = Math.ceil((travelers || 0) / 2) || (travelers > 0 ? 1 : 0);
  const nights = Math.max(0, (days || 0) > 1 ? (days || 0) - 1 : (days || 0));

  const totalStay = (stayPerNight || 0) * (nights > 0 ? nights : (days > 0 ? 1 : 0)) * (roomCount > 0 ? roomCount : 1);
  const totalFood = (foodPerPersonPerDay || 0) * (days > 0 ? days : 1) * (travelers > 0 ? travelers : 1);
  const totalTravel = (travelPerDay || 0) * (days > 0 ? days : 1);
  const totalActivities = (activitiesPerPerson || 0) * (travelers > 0 ? travelers : 1);
  const totalShopping = (shoppingPerPerson || 0) * (travelers > 0 ? travelers : 1);

  const totalCalculated = totalStay + totalFood + totalTravel + totalActivities + totalShopping;
  const costPerPerson = (travelers || 0) > 0 ? Math.round(totalCalculated / travelers) : 0;
  const costPerDay = (days || 0) > 0 ? Math.round(totalCalculated / days) : 0;

  // Comparison against target budget
  const hasTarget = (targetBudget || 0) > 0;
  const diff = hasTarget ? totalCalculated - targetBudget : 0;
  const isSaving = diff < 0;

  // Reset all to 0
  const handleReset = () => {
    setDays(0);
    setTravelers(0);
    setStayPerNight(0);
    setFoodPerPersonPerDay(0);
    setTravelPerDay(0);
    setActivitiesPerPerson(0);
    setShoppingPerPerson(0);
    setTargetBudget(0);
  };

  // Apply directly to app
  const handleApplyToApp = () => {
    const categoriesMap = {
      rooms: {
        id: 'rooms',
        name: 'Rooms & Stays',
        fullName: 'Rooms & Stays',
        subtitle: `${roomCount} rooms × ${nights} nights`,
        icon: 'Hotel',
        color: 'blue',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        barColor: 'bg-blue-500',
        accentColor: '#3b82f6'
      },
      food: {
        id: 'food',
        name: 'Food & Dining',
        fullName: 'Food & Dining',
        subtitle: `₹${foodPerPersonPerDay}/person/day`,
        icon: 'UtensilsCrossed',
        color: 'amber',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        accentColor: '#f59e0b'
      },
      travel: {
        id: 'travel',
        name: 'Travel & Fuel',
        fullName: 'Travel, Fuel & Cabs',
        subtitle: `₹${travelPerDay}/day`,
        icon: 'Car',
        color: 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        accentColor: '#10b981'
      },
      tickets: {
        id: 'tickets',
        name: 'Sightseeing & Safari',
        fullName: 'Sightseeing & Safaris',
        subtitle: `₹${activitiesPerPerson}/person`,
        icon: 'Ticket',
        color: 'purple',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        barColor: 'bg-purple-500',
        accentColor: '#a855f7'
      },
      shopping: {
        id: 'shopping',
        name: 'Spices & Shopping',
        fullName: 'Tea, Chocolates & Spices',
        subtitle: `₹${shoppingPerPerson}/person`,
        icon: 'ShoppingBag',
        color: 'rose',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        accentColor: '#f43f5e'
      }
    };

    const budgetsMap = {
      rooms: totalStay,
      food: totalFood,
      travel: totalTravel,
      tickets: totalActivities,
      shopping: totalShopping
    };

    saveTripCategories(categoriesMap, budgetsMap);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy WhatsApp summary
  const handleCopyWhatsApp = () => {
    const text = `🌟 *TripTools - Trip Budget Plan* 🌟
📅 *Days:* ${days} Days (${nights} Nights)
👥 *Travelers:* ${travelers} People (${roomCount} Rooms)

🏨 *Stay (₹${stayPerNight}/night):* ₹${totalStay.toLocaleString('en-IN')}
🍲 *Food (₹${foodPerPersonPerDay}/day):* ₹${totalFood.toLocaleString('en-IN')}
🚗 *Travel (₹${travelPerDay}/day):* ₹${totalTravel.toLocaleString('en-IN')}
🎟️ *Activities:* ₹${totalActivities.toLocaleString('en-IN')}
🛍️ *Shopping:* ₹${totalShopping.toLocaleString('en-IN')}

💰 *Total Budget:* ₹${totalCalculated.toLocaleString('en-IN')}
👤 *Per Person:* ₹${costPerPerson.toLocaleString('en-IN')} / person
⚡ *Daily Burn Rate:* ₹${costPerDay.toLocaleString('en-IN')} / day

Calculated on https://munnartools.vercel.app`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Simple Budget Calculator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Budget Simulator 🧮✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Type your numbers freely. See live total costs and per-person splits instantly with zero complicated presets.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition-all shadow-xs"
            title="Reset all values to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>

          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleApplyToApp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply to Tracker 🚀</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN SIMPLE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: PURE & SIMPLE INPUT FIELDS */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-5">
          
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 border-b border-slate-100 pb-3">
            1. Enter Your Trip Details
          </h3>

          {/* Stepper / Basic Info: Days & People */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Days Input */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Trip Duration</span>
                  <span className="text-[11px] text-slate-400">Total days</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={days === 0 ? '' : days}
                  onChange={(e) => setDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-20 px-2 py-1.5 rounded-xl border border-slate-300 text-right font-black text-sm text-slate-900 bg-white"
                />
                <span className="text-xs font-bold text-slate-500">Days</span>
              </div>
            </div>

            {/* Travelers Input */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Number of People</span>
                  <span className="text-[11px] text-slate-400">Total travelers</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={travelers === 0 ? '' : travelers}
                  onChange={(e) => setTravelers(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-20 px-2 py-1.5 rounded-xl border border-slate-300 text-right font-black text-sm text-slate-900 bg-white"
                />
                <span className="text-xs font-bold text-slate-500">People</span>
              </div>
            </div>

          </div>

          {/* Rate Category Inputs */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Cost Per Category
            </span>

            {/* 1. Stay Per Night */}
            <div className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                  <Hotel className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">Room / Hotel Cost</p>
                  <p className="text-[11px] text-slate-400">Rate per night (1 room per 2 people)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stayPerNight === 0 ? '' : stayPerNight}
                    onChange={(e) => setStayPerNight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 w-24 text-right">
                  = ₹{totalStay.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 2. Food Per Person Per Day */}
            <div className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">Food & Dining</p>
                  <p className="text-[11px] text-slate-400">Rate per person per day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={foodPerPersonPerDay === 0 ? '' : foodPerPersonPerDay}
                    onChange={(e) => setFoodPerPersonPerDay(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 w-24 text-right">
                  = ₹{totalFood.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 3. Travel & Fuel Per Day */}
            <div className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">Travel, Fuel & Cabs</p>
                  <p className="text-[11px] text-slate-400">Total vehicle / petrol cost per day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={travelPerDay === 0 ? '' : travelPerDay}
                    onChange={(e) => setTravelPerDay(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 w-24 text-right">
                  = ₹{totalTravel.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 4. Activities & Safaris Per Person */}
            <div className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">Sightseeing & Entry Tickets</p>
                  <p className="text-[11px] text-slate-400">Total entry & activity cost per person</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={activitiesPerPerson === 0 ? '' : activitiesPerPerson}
                    onChange={(e) => setActivitiesPerPerson(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 w-24 text-right">
                  = ₹{totalActivities.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 5. Shopping & Gifts Per Person */}
            <div className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">Spices, Tea & Shopping</p>
                  <p className="text-[11px] text-slate-400">Shopping budget per person</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={shoppingPerPerson === 0 ? '' : shoppingPerPerson}
                    onChange={(e) => setShoppingPerPerson(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 w-24 text-right">
                  = ₹{totalShopping.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          {/* Optional: Target Budget Comparison */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Target Budget to Compare (Optional)</span>
                  <span className="text-[11px] text-slate-500">Compare your simulated total against this target</span>
                </div>
              </div>
              <div className="relative self-end sm:self-auto">
                <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={targetBudget === 0 ? '' : targetBudget}
                  onChange={(e) => setTargetBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-32 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right bg-white"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COL: LIVE CALCULATION RESULT */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-teal-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Total Calculated Cost
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-teal-300 font-bold border border-white/10">
                  {days}D • {travelers}P
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{totalCalculated.toLocaleString('en-IN')}
                </p>

                {/* Target Comparison Badge */}
                {hasTarget && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-extrabold">
                    {isSaving ? (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Saves ₹{Math.abs(diff).toLocaleString('en-IN')} vs target</span>
                      </>
                    ) : diff === 0 ? (
                      <span className="text-teal-300">Exact match with target budget</span>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-300">+₹{diff.toLocaleString('en-IN')} over target</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Per Person & Daily Split */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Each Person Pays:</span>
                  <strong className="text-teal-300 text-base font-black">
                    ₹{costPerPerson.toLocaleString('en-IN')} / person
                  </strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Daily Burn Rate:</span>
                  <strong className="text-white">₹{costPerDay.toLocaleString('en-IN')} / day</strong>
                </div>
              </div>

              {/* Breakdown Stack */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category Breakdown
                </span>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span>🏨 Stay:</span>
                    <span className="font-bold text-white">₹{totalStay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍲 Food:</span>
                    <span className="font-bold text-white">₹{totalFood.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚗 Travel:</span>
                    <span className="font-bold text-white">₹{totalTravel.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🎟️ Activities:</span>
                    <span className="font-bold text-white">₹{totalActivities.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🛍️ Shopping:</span>
                    <span className="font-bold text-white">₹{totalShopping.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Apply Action Button */}
              <button
                type="button"
                onClick={handleApplyToApp}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-teal-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>Apply to My Trip 🚀</span>
              </button>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
