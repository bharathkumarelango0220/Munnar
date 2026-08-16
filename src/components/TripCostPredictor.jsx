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
    subtitle: 'Homestays, bike rides & local Kerala messes',
    badge: 'Budget Friendly',
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
    subtitle: '3-Star hotels, private cab & family dining',
    badge: 'Most Popular',
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
    subtitle: '5-Star hilltop resorts, 4x4 Jeeps & fine dining',
    badge: 'VIP Experience',
    badgeColor: 'bg-purple-100 text-purple-800',
    stayPerNight: 8000,
    foodPerDay: 2200,
    travelPerDay: 3200,
    ticketsPerDay: 1500,
    shoppingPerPerson: 4500
  }
];

export default function TripCostPredictor() {
  const { saveTripCategories, setActiveTab } = useApp();

  const [selectedStyle, setSelectedStyle] = useState('comfort');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);

  // Active Category List (User can delete default ones or add new ones)
  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('munnar_predictor_active_cats_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'rooms', name: 'Rooms & Stays', rate: 3000, rateType: 'roomsNights', icon: 'Hotel', color: 'blue' },
      { id: 'food', name: 'Food & Dining', rate: 900, rateType: 'perPersonPerDay', icon: 'UtensilsCrossed', color: 'amber' },
      { id: 'bike', name: 'Travel, Fuel & Cabs', rate: 1500, rateType: 'perDay', icon: 'Car', color: 'emerald' },
      { id: 'tickets', name: 'Tickets & Safari', rate: 600, rateType: 'perPersonPerDay', icon: 'Ticket', color: 'purple' },
      { id: 'shopping', name: 'Spices & Shopping', rate: 1800, rateType: 'perPerson', icon: 'ShoppingBag', color: 'rose' }
    ];
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatRate, setNewCatRate] = useState('');
  const [newCatRateType, setNewCatRateType] = useState('fixed');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Helper to sync state to AppContext & localStorage
  const syncToAppContext = (cats, currentDays, currentTravelers) => {
    const categoriesMap = {};
    const budgetsMap = {};

    const roomCount = Math.ceil(currentTravelers / 2);
    const nights = Math.max(1, currentDays - 1);

    cats.forEach((item) => {
      let totalCost = item.rate || 0;
      if (item.rateType === 'roomsNights') totalCost = (item.rate || 0) * nights * roomCount;
      if (item.rateType === 'perPersonPerDay') totalCost = (item.rate || 0) * currentDays * currentTravelers;
      if (item.rateType === 'perDay') totalCost = (item.rate || 0) * currentDays;
      if (item.rateType === 'perPerson') totalCost = (item.rate || 0) * currentTravelers;

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

  // Persist category list
  useEffect(() => {
    localStorage.setItem('munnar_predictor_active_cats_v2', JSON.stringify(categoriesList));
  }, [categoriesList]);

  // Handle travel style preset selection
  const handleSelectStyle = (style) => {
    setSelectedStyle(style.id);
    const updated = categoriesList.map((cat) => {
      if (cat.id === 'rooms') return { ...cat, rate: style.stayPerNight };
      if (cat.id === 'food') return { ...cat, rate: style.foodPerDay };
      if (cat.id === 'bike') return { ...cat, rate: style.travelPerDay };
      if (cat.id === 'tickets') return { ...cat, rate: style.ticketsPerDay };
      if (cat.id === 'shopping') return { ...cat, rate: style.shoppingPerPerson };
      return cat;
    });
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
  };

  // Add Custom Category
  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const rateNum = parseFloat(newCatRate) || 0;
    if (rateNum <= 0) return;

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

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Delete ANY category (immediately updates Expense Tracker as well!)
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

  // Steppers handlers with real-time sync
  const handleDaysChange = (newDays) => {
    const val = Math.max(1, newDays);
    setDays(val);
    syncToAppContext(categoriesList, val, travelers);
  };

  const handleTravelersChange = (newTravelers) => {
    const val = Math.max(1, newTravelers);
    setTravelers(val);
    syncToAppContext(categoriesList, days, val);
  };

  // Calculations
  const roomCount = Math.ceil(travelers / 2);
  const nights = Math.max(1, days - 1);

  const calculateCategoryTotal = (cat) => {
    const r = cat.rate || 0;
    if (cat.rateType === 'roomsNights') return r * nights * roomCount;
    if (cat.rateType === 'perPersonPerDay') return r * days * travelers;
    if (cat.rateType === 'perDay') return r * days;
    if (cat.rateType === 'perPerson') return r * travelers;
    return r;
  };

  const calculatedItems = categoriesList.map((cat) => ({
    ...cat,
    totalCost: calculateCategoryTotal(cat)
  }));

  const totalEstimatedCost = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);
  const costPerPerson = Math.round(totalEstimatedCost / (travelers || 1));
  const costPerDay = Math.round(totalEstimatedCost / (days || 1));

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
            Deleting or adding categories here instantly syncs with your Expense Tracker and Reports.
          </p>
        </div>

        <button
          onClick={handleSaveAndGoToTracker}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Save & Go to Expense Tracker 🚀</span>
        </button>
      </div>

      {/* STEP 1: Select Travel Style */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Travel Style Preset
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {TRAVEL_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelectStyle(style)}
                className={`p-4 sm:p-5 rounded-3xl border text-left transition-all relative ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">{style.title}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badgeColor}`}>
                    {style.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{style.subtitle}</p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700 font-semibold">
                  <span>~₹{style.stayPerNight}/night</span>
                  <span>~₹{style.foodPerDay}/day food</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Duration & Travelers Steppers */}
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
              value={days}
              onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
              min="1"
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
              value={travelers}
              onChange={(e) => handleTravelersChange(parseInt(e.target.value) || 1)}
              min="1"
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
                2. Customize & Manage Categories ({categoriesList.length})
              </h3>
              <p className="text-[11px] text-slate-400">Click 🗑️ to delete any category (instantly updates Expenses Tracker)</p>
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
                  required
                  min="1"
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

          {/* Categories List with Instant Deletion & Edit */}
          <div className="space-y-3 divide-y divide-slate-100">
            {calculatedItems.map((cat) => {
              let subtitle = 'Fixed Flat Budget';
              if (cat.rateType === 'roomsNights') subtitle = `${roomCount} rooms × ${nights} nights`;
              if (cat.rateType === 'perPersonPerDay') subtitle = `₹${cat.rate} × ${days} days × ${travelers} people`;
              if (cat.rateType === 'perDay') subtitle = `₹${cat.rate} × ${days} days`;
              if (cat.rateType === 'perPerson') subtitle = `₹${cat.rate} × ${travelers} people`;

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
                    <input
                      type="number"
                      value={cat.rate}
                      onChange={(e) => handleUpdateCategoryRate(cat.id, e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right focus:outline-none focus:border-emerald-500 bg-white"
                      title="Rate value"
                    />
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
                  Grand Total Trip Estimate
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
                  Total predicted trip budget for {travelers} {travelers === 1 ? 'person' : 'people'} ({categoriesList.length} Categories)
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
