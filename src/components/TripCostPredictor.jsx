import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Users, 
  Calendar, 
  Sparkles, 
  Check, 
  Hotel, 
  UtensilsCrossed, 
  Car, 
  Ticket, 
  ShoppingBag, 
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const TRAVEL_STYLES = [
  {
    id: 'budget',
    title: '🎒 Backpacker / Budget',
    subtitle: 'Fill with Homestay & Local mess rates',
    badge: 'Budget Template',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    stayPerNight: 1000,
    foodPerDay: 400,
    travelPerDay: 500,
    ticketsPerDay: 250,
    shoppingPerPerson: 600
  },
  {
    id: 'comfort',
    title: '🚗 Comfort / Family',
    subtitle: 'Fill with 3-Star hotel & Cab rates',
    badge: 'Family Template',
    badgeColor: 'bg-teal-100 text-teal-800',
    stayPerNight: 3000,
    foodPerDay: 900,
    travelPerDay: 1500,
    ticketsPerDay: 600,
    shoppingPerPerson: 1800
  },
  {
    id: 'luxury',
    title: '👑 Luxury / Premium',
    subtitle: 'Fill with 5-Star resort & 4x4 Jeep rates',
    badge: 'Luxury Template',
    badgeColor: 'bg-purple-100 text-purple-800',
    stayPerNight: 8000,
    foodPerDay: 2200,
    travelPerDay: 3200,
    ticketsPerDay: 1500,
    shoppingPerPerson: 4500
  }
];

export default function TripCostPredictor() {
  const { saveTripCategories, setActiveTab, isLoggedIn } = useApp();

  const getStorage = () => (isLoggedIn ? localStorage : sessionStorage);

  // Days & Travelers (starts 0 by default)
  const [days, setDays] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_days_v3');
      return saved !== null ? parseInt(saved) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [travelers, setTravelers] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_travelers_v3');
      return saved !== null ? parseInt(saved) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  // Active Category List (All default rates start at 0)
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_active_cats_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return [
      { id: 'rooms', name: 'Rooms & Stays', rate: 0, rateType: 'roomsNights', icon: 'Hotel', color: 'blue' },
      { id: 'food', name: 'Food & Dining', rate: 0, rateType: 'perPersonPerDay', icon: 'UtensilsCrossed', color: 'amber' },
      { id: 'bike', name: 'Travel, Fuel & Cabs', rate: 0, rateType: 'perDay', icon: 'Car', color: 'emerald' },
      { id: 'tickets', name: 'Tickets & Safari', rate: 0, rateType: 'perPersonPerDay', icon: 'Ticket', color: 'purple' },
      { id: 'shopping', name: 'Spices & Shopping', rate: 0, rateType: 'perPerson', icon: 'ShoppingBag', color: 'rose' }
    ];
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatRate, setNewCatRate] = useState('');
  const [newCatRateType, setNewCatRateType] = useState('fixed');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Sync to AppContext
  const syncToAppContext = (cats, currentDays, currentTravelers) => {
    const categoriesMap = {};
    const budgetsMap = {};

    const roomCount = Math.ceil(currentTravelers / 2) || 0;
    const nights = Math.max(0, currentDays > 1 ? currentDays - 1 : currentDays);

    cats.forEach((item) => {
      let totalCost = item.rate || 0;
      if (item.rateType === 'roomsNights') totalCost = (item.rate || 0) * (nights || 1) * (roomCount || 1);
      if (item.rateType === 'perPersonPerDay') totalCost = (item.rate || 0) * (currentDays || 1) * (currentTravelers || 1);
      if (item.rateType === 'perDay') totalCost = (item.rate || 0) * (currentDays || 1);
      if (item.rateType === 'perPerson') totalCost = (item.rate || 0) * (currentTravelers || 1);

      categoriesMap[item.id] = {
        id: item.id,
        name: item.name,
        fullName: item.name,
        subtitle: `Configured in Trip Predictor`,
        icon: item.icon || 'Tag',
        color: item.color || 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        accentColor: '#10b981'
      };
      budgetsMap[item.id] = Math.round(totalCost);
    });

    saveTripCategories(categoriesMap, budgetsMap);
  };

  // Persist category list & stepper values
  useEffect(() => {
    const storage = getStorage();
    storage.setItem('munnar_predictor_active_cats_v3', JSON.stringify(categoriesList));
    storage.setItem('munnar_predictor_days_v3', days.toString());
    storage.setItem('munnar_predictor_travelers_v3', travelers.toString());
  }, [categoriesList, days, travelers, isLoggedIn]);

  // Handle travel style preset selection
  const handleSelectStyle = (style) => {
    const updated = categoriesList.map((cat) => {
      if (cat.id === 'rooms') return { ...cat, rate: style.stayPerNight };
      if (cat.id === 'food') return { ...cat, rate: style.foodPerDay };
      if (cat.id === 'bike') return { ...cat, rate: style.travelPerDay };
      if (cat.id === 'tickets') return { ...cat, rate: style.ticketsPerDay };
      if (cat.id === 'shopping') return { ...cat, rate: style.shoppingPerPerson };
      return cat;
    });

    const activeDays = days === 0 ? 3 : days;
    const activeTravelers = travelers === 0 ? 2 : travelers;
    setDays(activeDays);
    setTravelers(activeTravelers);

    setCategoriesList(updated);
    syncToAppContext(updated, activeDays, activeTravelers);
  };

  // Reset all rates to 0
  const handleResetToZero = () => {
    const resetList = categoriesList.map((cat) => ({ ...cat, rate: 0 }));
    setDays(0);
    setTravelers(0);
    setCategoriesList(resetList);
    syncToAppContext(resetList, 0, 0);
  };

  // Add Custom Category
  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const rateNum = parseFloat(newCatRate) || 0;

    const newId = `cat_${Date.now()}`;
    const newCat = {
      id: newId,
      name: newCatName.trim(),
      rate: rateNum,
      rateType: newCatRateType,
      icon: 'Tag',
      color: 'teal'
    };

    const updated = [...categoriesList, newCat];
    setCategoriesList(updated);
    setNewCatName('');
    setNewCatRate('');
    setIsAddingCategory(false);
    syncToAppContext(updated, days, travelers);
  };

  // Delete category
  const handleDeleteCategory = (id) => {
    if (categoriesList.length <= 1) {
      alert('You must keep at least 1 expense category in your trip.');
      return;
    }
    const updated = categoriesList.filter((c) => c.id !== id);
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
  };

  // Update category rate value
  const handleUpdateCategoryRate = (id, newRate) => {
    const updated = categoriesList.map((c) => {
      if (c.id === id) {
        return { ...c, rate: parseFloat(newRate) || 0 };
      }
      return c;
    });
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
  };

  // Stepper handlers
  const handleDaysChange = (newDays) => {
    const val = Math.max(0, newDays);
    setDays(val);
    syncToAppContext(categoriesList, val, travelers);
  };

  const handleTravelersChange = (newTravelers) => {
    const val = Math.max(0, newTravelers);
    setTravelers(val);
    syncToAppContext(categoriesList, days, val);
  };

  // Calculations
  const roomCount = Math.ceil(travelers / 2) || 0;
  const nights = Math.max(0, days > 1 ? days - 1 : days);

  const calculateCategoryTotal = (cat) => {
    const r = cat.rate || 0;
    if (r === 0) return 0;
    if (cat.rateType === 'roomsNights') return r * (nights || 1) * (roomCount || 1);
    if (cat.rateType === 'perPersonPerDay') return r * (days || 1) * (travelers || 1);
    if (cat.rateType === 'perDay') return r * (days || 1);
    if (cat.rateType === 'perPerson') return r * (travelers || 1);
    return r;
  };

  const calculatedItems = categoriesList.map((cat) => ({
    ...cat,
    totalCost: calculateCategoryTotal(cat)
  }));

  const totalEstimatedCost = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);
  const costPerPerson = travelers > 0 ? Math.round(totalEstimatedCost / travelers) : 0;
  const costPerDay = days > 0 ? Math.round(totalEstimatedCost / days) : 0;

  // Save to Expense Tracker & Redirect
  const handleSaveAndGoToTracker = () => {
    syncToAppContext(categoriesList, days, travelers);
    setActiveTab('tracker');
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Trip Cost & Category Setup</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            All-in-One Trip Cost Predictor 🧮💰
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every value starts at 0. Enter your custom amounts manually, or pick a template to quick-fill!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetToZero}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition-all shadow-xs"
            title="Reset all values to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>

          <button
            onClick={handleSaveAndGoToTracker}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Save & Go to Expense Tracker 🚀</span>
          </button>
        </div>
      </div>

      {/* Optional Templates */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quick Fill Templates (Optional)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {TRAVEL_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelectStyle(style)}
              className="p-4 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white text-left transition-all shadow-soft group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800">{style.title}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badgeColor}`}>
                  {style.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{style.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Duration & Travelers Steppers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Days Stepper */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Trip Duration</h4>
              <p className="text-[11px] text-slate-500">{days} Days ({nights} Nights)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDaysChange(days - 1)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={days === 0 ? '' : days}
              placeholder="0"
              onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
              min="0"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => handleDaysChange(days + 1)}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="text-xs font-bold text-slate-600 ml-1">Days</span>
          </div>
        </div>

        {/* Travelers Stepper */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Number of Travelers</h4>
              <p className="text-[11px] text-slate-500">{travelers} People ({roomCount} {roomCount === 1 ? 'Room' : 'Rooms'})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTravelersChange(travelers - 1)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={travelers === 0 ? '' : travelers}
              placeholder="0"
              onChange={(e) => handleTravelersChange(parseInt(e.target.value) || 0)}
              min="0"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => handleTravelersChange(travelers + 1)}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="text-xs font-bold text-slate-600 ml-1">People</span>
          </div>
        </div>

      </div>

      {/* MAIN CALCULATION SUMMARY & BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Category Adjustments & Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                2. Set Amounts for Your Categories ({categoriesList.length})
              </h3>
              <p className="text-[11px] text-slate-400">Type your amounts manually (all start at 0), or delete categories</p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Custom Category</span>
            </button>
          </div>

          {/* Add Custom Category Box */}
          {isAddingCategory && (
            <form onSubmit={handleAddCustomCategory} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-slideDown">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Add New Expense Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Campfire, Zipline, Guide)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
                />

                <input
                  type="number"
                  placeholder="Rate (₹)"
                  value={newCatRate}
                  onChange={(e) => setNewCatRate(e.target.value)}
                  min="0"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black focus:outline-none focus:border-emerald-500 bg-white"
                />

                <select
                  value={newCatRateType}
                  onChange={(e) => setNewCatRateType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="fixed">Fixed Flat Total</option>
                  <option value="perPerson">Per Person Rate</option>
                  <option value="perDay">Per Day Rate</option>
                  <option value="perPersonPerDay">Per Person Per Day</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          {/* Categories List with 0 Default Inputs */}
          <div className="space-y-3 divide-y divide-slate-100">
            {calculatedItems.map((cat) => {
              let subtitle = 'Fixed Flat Budget';
              if (cat.rateType === 'roomsNights') subtitle = `${roomCount || 0} rooms × ${nights || 0} nights`;
              if (cat.rateType === 'perPersonPerDay') subtitle = `₹${cat.rate} × ${days || 0} days × ${travelers || 0} people`;
              if (cat.rateType === 'perDay') subtitle = `₹${cat.rate} × ${days || 0} days`;
              if (cat.rateType === 'perPerson') subtitle = `₹${cat.rate} × ${travelers || 0} people`;

              return (
                <div key={cat.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-0.5"
                          title={`Delete ${cat.name} category`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </h4>
                      <p className="text-[11px] text-slate-400">{subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={cat.rate === 0 ? '' : cat.rate}
                        placeholder="0"
                        onChange={(e) => handleUpdateCategoryRate(cat.id, e.target.value)}
                        className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right focus:outline-none focus:border-emerald-500 bg-white"
                        title="Enter category amount"
                      />
                    </div>
                    <span className="text-sm font-black text-slate-900 w-24 text-right">
                      ₹{cat.totalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Grand Total Display Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Total Predicted Trip Budget
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {days}D / {travelers}P
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{totalEstimatedCost.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {totalEstimatedCost === 0 
                    ? 'Enter amounts above to calculate your total'
                    : `Calculated for ${travelers} people across ${categoriesList.length} categories`}
                </p>
              </div>

              {/* Breakdown Rows */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Per Person Cost:</span>
                  <strong className="text-emerald-300 text-base font-black">
                    ₹{costPerPerson.toLocaleString('en-IN')} / person
                  </strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Daily Burn Rate:</span>
                  <strong className="text-white">₹{costPerDay.toLocaleString('en-IN')} / day</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAndGoToTracker}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>Save & Go to Expense Tracker 🚀</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
