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
  TrendingUp,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight
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
  const { setBudgets } = useApp();

  const [selectedStyle, setSelectedStyle] = useState('comfort');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);

  // Custom adjustments per default category
  const activePreset = TRAVEL_STYLES.find((s) => s.id === selectedStyle) || TRAVEL_STYLES[1];

  const [customStay, setCustomStay] = useState(activePreset.stayPerNight);
  const [customFood, setCustomFood] = useState(activePreset.foodPerDay);
  const [customTravel, setCustomTravel] = useState(activePreset.travelPerDay);
  const [customTickets, setCustomTickets] = useState(activePreset.ticketsPerDay);
  const [customShopping, setCustomShopping] = useState(activePreset.shoppingPerPerson);

  // User-Defined Custom Categories
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('munnar_predictor_custom_cats');
    return saved ? JSON.parse(saved) : [];
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [newCatType, setNewCatType] = useState('fixed'); // 'fixed', 'perPerson', 'perDay'
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Persist custom categories
  useEffect(() => {
    localStorage.setItem('munnar_predictor_custom_cats', JSON.stringify(customCategories));
  }, [customCategories]);

  const handleSelectStyle = (style) => {
    setSelectedStyle(style.id);
    setCustomStay(style.stayPerNight);
    setCustomFood(style.foodPerDay);
    setCustomTravel(style.travelPerDay);
    setCustomTickets(style.ticketsPerDay);
    setCustomShopping(style.shoppingPerPerson);
  };

  // Add Custom Category
  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const amt = parseFloat(newCatAmount) || 0;
    if (amt <= 0) return;

    const newCat = {
      id: `cc_${Date.now()}`,
      name: newCatName.trim(),
      amount: amt,
      rateType: newCatType
    };

    setCustomCategories([...customCategories, newCat]);
    setNewCatName('');
    setNewCatAmount('');
    setIsAddingCategory(false);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Remove Custom Category
  const handleRemoveCustomCategory = (id) => {
    setCustomCategories(customCategories.filter((c) => c.id !== id));
  };

  // Update existing custom category amount
  const handleUpdateCustomAmount = (id, newAmt) => {
    setCustomCategories(
      customCategories.map((c) => {
        if (c.id === id) {
          return { ...c, amount: parseFloat(newAmt) || 0 };
        }
        return c;
      })
    );
  };

  // Base Calculations
  const roomCount = Math.ceil(travelers / 2); // 2 people per room average
  const totalStayCost = customStay * Math.max(1, days - 1) * roomCount; // nights = days - 1
  const totalFoodCost = customFood * days * travelers;
  const totalTravelCost = customTravel * days;
  const totalTicketsCost = customTickets * days * travelers;
  const totalShoppingCost = customShopping * travelers;

  // Custom Categories Calculations
  const customCategoriesCost = customCategories.reduce((sum, cat) => {
    let cost = cat.amount;
    if (cat.rateType === 'perPerson') cost = cat.amount * travelers;
    if (cat.rateType === 'perDay') cost = cat.amount * days;
    return sum + cost;
  }, 0);

  const totalEstimatedCost = 
    totalStayCost + 
    totalFoodCost + 
    totalTravelCost + 
    totalTicketsCost + 
    totalShoppingCost + 
    customCategoriesCost;

  const costPerPerson = Math.round(totalEstimatedCost / (travelers || 1));
  const costPerDay = Math.round(totalEstimatedCost / (days || 1));

  // 1-Tap apply to expense tracker budget
  const handleApplyToBudget = () => {
    setBudgets({
      rooms: totalStayCost,
      food: totalFoodCost,
      snacks: Math.round(totalFoodCost * 0.25),
      bike: totalTravelCost,
      tickets: totalTicketsCost,
      unexpected: totalShoppingCost + customCategoriesCost
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`🎉 Successfully applied ₹${totalEstimatedCost.toLocaleString('en-IN')} as your trip budget in the Expenses Tracker!`);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Trip Budget Predictor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            All-in-One Total Trip Cost Predictor 🧮💰
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Estimate total costs for Stays, Food, Fuel/Cab, Tickets, Shopping, and your own custom expense categories.
          </p>
        </div>

        <button
          onClick={handleApplyToBudget}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Apply to Expense Tracker</span>
        </button>
      </div>

      {/* STEP 1: Select Travel Style */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Your Travel Style
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
              <p className="text-[11px] text-slate-500">{days} Days ({Math.max(1, days - 1)} Nights)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => setDays(days + 1)}
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
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-14 h-10 px-1 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={() => setTravelers(travelers + 1)}
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
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Predicted Category Cost Breakdown
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Custom Category</span>
            </button>
          </div>

          {/* Add Custom Category Box */}
          {isAddingCategory && (
            <form onSubmit={handleAddCustomCategory} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-slideDown">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Add Your Custom Expense Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Campfire, Zipline, Drone)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
                />

                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(e.target.value)}
                  required
                  min="1"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black focus:outline-none focus:border-emerald-500 bg-white"
                />

                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="fixed">Fixed Flat Total</option>
                  <option value="perPerson">Per Person Rate</option>
                  <option value="perDay">Per Day Rate</option>
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

          <div className="space-y-3.5 divide-y divide-slate-100">
            
            {/* 1. Rooms & Stays */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <Hotel className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Rooms & Stays</h4>
                  <p className="text-[11px] text-slate-400">{roomCount} rooms × {Math.max(1, days - 1)} nights</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <input
                  type="number"
                  value={customStay}
                  onChange={(e) => setCustomStay(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                  title="Price per room/night"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">
                  ₹{totalStayCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 2. Food & Dining */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Food & Dining</h4>
                  <p className="text-[11px] text-slate-400">Breakfast, Lunch & Dinner for {travelers} people</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <input
                  type="number"
                  value={customFood}
                  onChange={(e) => setCustomFood(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                  title="Daily food per person"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">
                  ₹{totalFoodCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 3. Travel / Fuel / Cab */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Travel, Fuel & Cabs</h4>
                  <p className="text-[11px] text-slate-400">Bike petrol or sightseeing taxi for {days} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <input
                  type="number"
                  value={customTravel}
                  onChange={(e) => setCustomTravel(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                  title="Daily vehicle expense"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">
                  ₹{totalTravelCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 4. Tickets & Safaris */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Tickets & Jeep Safari</h4>
                  <p className="text-[11px] text-slate-400">Eravikulam bus, boating, passes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <input
                  type="number"
                  value={customTickets}
                  onChange={(e) => setCustomTickets(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                  title="Daily tickets per person"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">
                  ₹{totalTicketsCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 5. Spices & Shopping */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Spices & Tea Shopping</h4>
                  <p className="text-[11px] text-slate-400">Cardamom, tea powder, chocolates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <input
                  type="number"
                  value={customShopping}
                  onChange={(e) => setCustomShopping(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                  title="Shopping per person"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">
                  ₹{totalShoppingCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Custom User Categories */}
            {customCategories.map((cat) => {
              let calculatedCatTotal = cat.amount;
              let subtitle = 'Fixed flat expense';
              if (cat.rateType === 'perPerson') {
                calculatedCatTotal = cat.amount * travelers;
                subtitle = `₹${cat.amount} × ${travelers} people`;
              } else if (cat.rateType === 'perDay') {
                calculatedCatTotal = cat.amount * days;
                subtitle = `₹${cat.amount} × ${days} days`;
              }

              return (
                <div key={cat.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomCategory(cat.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors"
                          title="Remove custom category"
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
                      value={cat.amount}
                      onChange={(e) => handleUpdateCustomAmount(cat.id, e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-right"
                    />
                    <span className="text-sm font-black text-teal-700 w-24 text-right">
                      ₹{calculatedCatTotal.toLocaleString('en-IN')}
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
                  Total predicted trip budget for {travelers} {travelers === 1 ? 'person' : 'people'}
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

                {customCategories.length > 0 && (
                  <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                    <span>Custom Extras ({customCategories.length}):</span>
                    <strong className="text-teal-300 font-bold">
                      +₹{customCategoriesCost.toLocaleString('en-IN')}
                    </strong>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleApplyToBudget}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>Save as My Trip Budget</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
