import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Users, 
  Calendar, 
  Sparkles, 
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Tag,
  Hotel,
  UtensilsCrossed,
  Car,
  Ticket,
  ShoppingBag,
  FolderPlus,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/haptics';

const QUICK_CATEGORY_PRESETS = [
  { id: 'rooms', name: 'Hotel & Stay', rateType: 'roomsNights', icon: 'Hotel', color: 'blue' },
  { id: 'food', name: 'Food & Dining', rateType: 'perPersonPerDay', icon: 'UtensilsCrossed', color: 'amber' },
  { id: 'travel', name: 'Travel & Fuel', rateType: 'perDay', icon: 'Car', color: 'emerald' },
  { id: 'tickets', name: 'Sightseeing & Safari', rateType: 'perPerson', icon: 'Ticket', color: 'purple' },
  { id: 'shopping', name: 'Shopping & Spices', rateType: 'perPerson', icon: 'ShoppingBag', color: 'rose' }
];

export default function TripCostPredictor() {
  const { saveTripCategories, setActiveTab } = useApp();

  const getStorage = () => localStorage;

  // Days & Travelers (starts 0 by default)
  const [days, setDays] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_days_v3');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [travelers, setTravelers] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_travelers_v3');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  // Active Category List (Starts empty [] with ZERO default categories)
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_predictor_active_cats_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatRate, setNewCatRate] = useState('');
  const [newCatRateType, setNewCatRateType] = useState('fixed');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Sync to AppContext safely
  const syncToAppContext = (cats, currentDays, currentTravelers) => {
    const categoriesMap = {};
    const budgetsMap = {};

    const currentRoomCount = Math.ceil((currentTravelers || 0) / 2) || 0;
    const currentNights = Math.max(0, (currentDays || 0) > 1 ? (currentDays || 0) - 1 : (currentDays || 0));

    cats.forEach((item) => {
      const r = Number(item.rate) || 0;
      let totalCost = r;
      if (item.rateType === 'roomsNights') {
        totalCost = r * (currentNights > 0 ? currentNights : 1) * (currentRoomCount > 0 ? currentRoomCount : 1);
      } else if (item.rateType === 'perPersonPerDay') {
        totalCost = r * (currentDays > 0 ? currentDays : 1) * (currentTravelers > 0 ? currentTravelers : 1);
      } else if (item.rateType === 'perDay') {
        totalCost = r * (currentDays > 0 ? currentDays : 1);
      } else if (item.rateType === 'perPerson') {
        totalCost = r * (currentTravelers > 0 ? currentTravelers : 1);
      }

      categoriesMap[item.id] = {
        id: item.id,
        name: item.name,
        fullName: item.name,
        subtitle: 'Configured in Trip Predictor',
        icon: item.icon || 'Tag',
        color: item.color || 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        accentColor: '#10b981'
      };
      budgetsMap[item.id] = Math.round(totalCost || 0);
    });

    saveTripCategories(categoriesMap, budgetsMap);
  };

  // Listen to Global Reset Event
  useEffect(() => {
    const handleResetAll = () => {
      setDays(0);
      setTravelers(0);
      setCategoriesList([]);
    };
    window.addEventListener('triptools_reset_all', handleResetAll);
    return () => window.removeEventListener('triptools_reset_all', handleResetAll);
  }, []);

  // Persist category list & stepper values
  useEffect(() => {
    try {
      const storage = getStorage();
      storage.setItem('munnar_predictor_active_cats_v3', JSON.stringify(categoriesList));
      storage.setItem('munnar_predictor_days_v3', (days || 0).toString());
      storage.setItem('munnar_predictor_travelers_v3', (travelers || 0).toString());
    } catch (e) {
      console.warn('Could not persist predictor storage', e);
    }
  }, [categoriesList, days, travelers]);

  // Reset all rates to 0
  const handleResetToZero = () => {
    const resetList = categoriesList.map((cat) => ({ ...cat, rate: 0 }));
    setDays(0);
    setTravelers(0);
    setCategoriesList(resetList);
    syncToAppContext(resetList, 0, 0);
  };

  // Clear all categories
  const handleClearAllCategories = () => {
    setCategoriesList([]);
    syncToAppContext([], days, travelers);
  };

  // Add Quick Preset Category
  const handleAddPreset = (preset) => {
    // Prevent duplicate presets
    if (categoriesList.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      return;
    }
    const newCat = {
      id: `${preset.id}_${Date.now()}`,
      name: preset.name,
      rate: 0,
      rateType: preset.rateType,
      icon: preset.icon,
      color: preset.color
    };
    const updated = [...categoriesList, newCat];
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
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
    const updated = categoriesList.filter((c) => c.id !== id);
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
  };

  // Update category rate value
  const handleUpdateCategoryRate = (id, newRate) => {
    const parsed = newRate === '' ? 0 : parseFloat(newRate);
    const validRate = isNaN(parsed) ? 0 : parsed;
    const updated = categoriesList.map((c) => {
      if (c.id === id) {
        return { ...c, rate: validRate };
      }
      return c;
    });
    setCategoriesList(updated);
    syncToAppContext(updated, days, travelers);
  };

  // Stepper handlers
  const handleDaysChange = (newDays) => {
    const val = Math.max(0, parseInt(newDays, 10) || 0);
    setDays(val);
    syncToAppContext(categoriesList, val, travelers);
  };

  const handleTravelersChange = (newTravelers) => {
    const val = Math.max(0, parseInt(newTravelers, 10) || 0);
    setTravelers(val);
    syncToAppContext(categoriesList, days, val);
  };

  // Calculations
  const roomCount = Math.ceil((travelers || 0) / 2) || 0;
  const nights = Math.max(0, (days || 0) > 1 ? (days || 0) - 1 : (days || 0));

  const calculateCategoryTotal = (cat) => {
    const r = Number(cat.rate) || 0;
    if (r === 0) return 0;
    if (cat.rateType === 'roomsNights') {
      return r * (nights > 0 ? nights : 1) * (roomCount > 0 ? roomCount : 1);
    }
    if (cat.rateType === 'perPersonPerDay') {
      return r * (days > 0 ? days : 1) * (travelers > 0 ? travelers : 1);
    }
    if (cat.rateType === 'perDay') {
      return r * (days > 0 ? days : 1);
    }
    if (cat.rateType === 'perPerson') {
      return r * (travelers > 0 ? travelers : 1);
    }
    return r;
  };

  const calculatedItems = categoriesList.map((cat) => ({
    ...cat,
    totalCost: calculateCategoryTotal(cat) || 0
  }));

  const totalEstimatedCost = calculatedItems.reduce((sum, item) => sum + (item.totalCost || 0), 0) || 0;
  const costPerPerson = (travelers || 0) > 0 ? Math.round(totalEstimatedCost / travelers) : 0;
  const costPerDay = (days || 0) > 0 ? Math.round(totalEstimatedCost / days) : 0;

  // Save to Expense Tracker & Redirect
  const handleSaveAndGoToTracker = () => {
    syncToAppContext(categoriesList, days, travelers);
    setActiveTab('tracker');
  };

  return (
    <section className="space-y-6 animate-fadeIn w-full max-w-full overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Trip Cost & Category Setup</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Cost Predictor 🧮💰
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fresh clean slate with zero default categories. Add only the categories you need for your tour!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {categoriesList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllCategories}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-all shadow-xs"
              title="Remove all categories"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

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
              onClick={() => {
                triggerHaptic(10);
                handleDaysChange(days - 1);
              }}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={days === 0 ? '' : days}
              placeholder="0"
              onChange={(e) => handleDaysChange(e.target.value)}
              min="0"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                handleDaysChange(days + 1);
              }}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors active:scale-90"
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
              <p className="text-[11px] text-slate-500">{travelers} People ({roomCount} Rooms)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                handleTravelersChange(travelers - 1);
              }}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={travelers === 0 ? '' : travelers}
              placeholder="0"
              onChange={(e) => handleTravelersChange(e.target.value)}
              min="0"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                handleTravelersChange(travelers + 1);
              }}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors active:scale-90"
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
                2. Your Trip Categories ({categoriesList.length})
              </h3>
              <p className="text-[11px] text-slate-400">Add categories freshly and set your custom rates</p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Custom Category</span>
            </button>
          </div>

          {/* Quick Category Chips for Fast Adding */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Quick Add Category:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_CATEGORY_PRESETS.map((preset) => {
                const isAlreadyAdded = categoriesList.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleAddPreset(preset)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isAlreadyAdded
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Custom Category Form */}
          {isAddingCategory && (
            <form onSubmit={handleAddCustomCategory} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-slideDown">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Create New Custom Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Campfire, Guide)"
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
                  required
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
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
                  <option value="roomsNights">Per Room Per Night</option>
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

          {/* Empty State when 0 categories */}
          {calculatedItems.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">No Categories Added Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click any of the quick presets above (like Hotel, Food, Travel) or click <strong>+ Add Custom Category</strong> to build your trip budget freshly!
              </p>
            </div>
          ) : (
            /* Categories List with 0 Default Inputs */
            <div className="space-y-3 divide-y divide-slate-100">
              {calculatedItems.map((cat) => {
                let subtitle = 'Fixed Flat Budget';
                if (cat.rateType === 'roomsNights') subtitle = `${roomCount || 0} rooms × ${nights || 0} nights`;
                if (cat.rateType === 'perPersonPerDay') subtitle = `₹${cat.rate || 0} × ${days || 0} days × ${travelers || 0} people`;
                if (cat.rateType === 'perDay') subtitle = `₹${cat.rate || 0} × ${days || 0} days`;
                if (cat.rateType === 'perPerson') subtitle = `₹${cat.rate || 0} × ${travelers || 0} people`;

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
                          inputMode="decimal"
                          value={cat.rate === 0 ? '' : cat.rate}
                          placeholder="0"
                          onChange={(e) => handleUpdateCategoryRate(cat.id, e.target.value)}
                          min="0"
                          className="w-28 pl-6 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-right text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                        />
                      </div>
                      <span className="text-xs font-black text-slate-900 w-24 text-right">
                        = ₹{(cat.totalCost || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Col: Cost Summary Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Total Predicted Cost
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {days}D • {travelers}P
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{(totalEstimatedCost || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Sum of your {categoriesList.length} custom categories
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Each Person Pays:</span>
                  <strong className="text-emerald-300 text-base font-black">
                    ₹{(costPerPerson || 0).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Daily Group Burn:</span>
                  <strong className="text-white">
                    ₹{(costPerDay || 0).toLocaleString('en-IN')} / day
                  </strong>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  handleSaveAndGoToTracker();
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>Save to Expense Tracker 🚀</span>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* Floating Sticky Live Predicted Budget Bar on Mobile */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 lg:hidden w-[92%] max-w-sm bg-slate-950/95 dark:bg-slate-900/95 text-white py-2.5 px-4 rounded-2xl shadow-2xl border border-teal-500/40 backdrop-blur-md flex items-center justify-between pointer-events-auto animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Predicted Budget</span>
            <span className="text-sm font-black text-white">
              ₹{(totalEstimatedCost || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium block">Per Person</span>
          <span className="text-xs font-black text-teal-300">
            ₹{(costPerPerson || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

    </section>
  );
}
