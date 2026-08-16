import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Calendar, 
  Hotel, 
  Car, 
  UtensilsCrossed, 
  Ticket, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap, 
  DollarSign, 
  ShieldCheck,
  Calculator
} from 'lucide-react';

const STAY_TIERS = [
  { id: 'hostel', name: 'Backpacker Hostel', ratePerNight: 600, badge: 'Budget', icon: '🛏️', desc: 'Dorm bed / Youth hostel' },
  { id: 'homestay', name: 'Cozy Homestay / Airbnb', ratePerNight: 1400, badge: 'Popular', icon: '🏡', desc: 'Local family-run cottage' },
  { id: 'hotel3', name: '3-Star Comfort Hotel', ratePerNight: 3200, badge: 'Comfort', icon: '🏨', desc: 'Standard room with breakfast' },
  { id: 'resort5', name: '5-Star Luxury Villa', ratePerNight: 7800, badge: 'Luxury', icon: '👑', desc: 'Premium tea valley view suite' }
];

const TRANSPORT_MODES = [
  { id: 'bus', name: 'Public Transit / KSRTC Bus', baseRate: 250, type: 'perPerson', icon: '🚌', desc: 'Scenic mountain bus travel' },
  { id: 'bike', name: 'Rented Bike / Scooter', baseRate: 650, type: 'perDay', icon: '🛵', desc: '₹500 rent + ₹150 fuel/day' },
  { id: 'selfCar', name: 'Self-Drive Hatchback / SUV', baseRate: 1800, type: 'perDay', icon: '🚗', desc: '₹1200 rent + ₹600 fuel/day' },
  { id: 'cab', name: 'Private Chauffeur Cab', baseRate: 3200, type: 'perDay', icon: '🚕', desc: 'All-inclusive driver, fuel & tolls' }
];

const DINING_STYLES = [
  { id: 'budget', name: 'Local Mess & Street Food', ratePerPersonPerDay: 350, icon: '🍲', desc: 'Thali, tea stalls & local tiffin' },
  { id: 'standard', name: 'Casual Family Restaurants', ratePerPersonPerDay: 750, icon: '🍛', desc: 'Authentic Kerala meals & cafes' },
  { id: 'fine', name: 'Fine Dining & Resort Cafes', ratePerPersonPerDay: 1600, icon: '🍷', desc: 'Multi-cuisine buffets & barbecues' }
];

const ACTIVITY_TIERS = [
  { id: 'minimal', name: 'Free Viewpoints & Walking', ratePerPerson: 200, icon: '🚶', desc: 'Tea gardens, dams & lake views' },
  { id: 'standard', name: 'Popular Sights & National Park', ratePerPerson: 750, icon: '🎟️', desc: 'Eravikulam, boating, museum' },
  { id: 'adventure', name: '4x4 Offroad Safari & Trekking', ratePerPerson: 1800, icon: '🧗', desc: 'Kolukkumalai jeep, zipline, guide' }
];

export default function BudgetSimulator() {
  const { 
    totalBudget, 
    saveTripCategories, 
    setActiveTab, 
    isLoggedIn 
  } = useApp();

  // Baseline extraction or defaults
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(4);
  const [selectedStay, setSelectedStay] = useState('homestay');
  const [selectedTransport, setSelectedTransport] = useState('selfCar');
  const [selectedDining, setSelectedDining] = useState('standard');
  const [selectedActivity, setSelectedActivity] = useState('standard');
  const [includeShopping, setIncludeShopping] = useState(true);
  const [copied, setCopied] = useState(false);

  // Math Calculations
  const roomCount = Math.ceil(travelers / 2) || 1;
  const nights = Math.max(1, days > 1 ? days - 1 : days);

  const stayObj = STAY_TIERS.find((s) => s.id === selectedStay) || STAY_TIERS[1];
  const transportObj = TRANSPORT_MODES.find((t) => t.id === selectedTransport) || TRANSPORT_MODES[2];
  const diningObj = DINING_STYLES.find((d) => d.id === selectedDining) || DINING_STYLES[1];
  const activityObj = ACTIVITY_TIERS.find((a) => a.id === selectedActivity) || ACTIVITY_TIERS[1];

  const stayTotal = stayObj.ratePerNight * nights * roomCount;
  const transportTotal = transportObj.type === 'perPerson' 
    ? transportObj.baseRate * travelers 
    : transportObj.baseRate * days;
  const diningTotal = diningObj.ratePerPersonPerDay * days * travelers;
  const activityTotal = activityObj.ratePerPerson * travelers;
  const shoppingTotal = includeShopping ? 800 * travelers : 0;

  const simulatedTotal = stayTotal + transportTotal + diningTotal + activityTotal + shoppingTotal;
  const simulatedPerPerson = Math.round(simulatedTotal / travelers);
  const simulatedPerDay = Math.round(simulatedTotal / days);

  // Baseline comparison
  const baseline = totalBudget > 0 ? totalBudget : 25000;
  const diffAmount = simulatedTotal - baseline;
  const diffPercent = Math.round((diffAmount / baseline) * 100);
  const isSaving = diffAmount < 0;

  // Dynamic AI Suggestions
  const insights = useMemo(() => {
    const list = [];
    if (travelers >= 4 && selectedStay !== 'homestay' && selectedStay !== 'hostel') {
      list.push(`💡 Group of ${travelers}: Booking a whole 2-room Homestay instead of luxury rooms saves ₹${((stayObj.ratePerNight - 1400) * nights * roomCount).toLocaleString('en-IN')}!`);
    }
    if (selectedTransport === 'cab' && travelers <= 2) {
      list.push('💡 For 1-2 travelers, renting a self-drive bike cuts transport expenses by more than 60%.');
    }
    if (selectedDining === 'fine') {
      list.push('💡 Blending 1 fine-dining dinner with authentic local tea/thali lunches balances budget and taste.');
    }
    if (days >= 4) {
      list.push(`💡 Staying ${days} days? Weekly homestay discounts often reduce room rates by ~15%.`);
    }
    if (list.length === 0) {
      list.push('✨ Your current simulated parameters are balanced for a high-comfort, cost-effective tour!');
    }
    return list;
  }, [travelers, days, selectedStay, selectedTransport, selectedDining, stayObj, nights, roomCount]);

  // Apply to active site budget
  const handleApplyToApp = () => {
    const categoriesMap = {
      rooms: {
        id: 'rooms',
        name: `Rooms (${stayObj.name})`,
        fullName: `Rooms & Stays - ${stayObj.name}`,
        subtitle: `${roomCount} rooms × ${nights} nights`,
        icon: 'Hotel',
        color: 'blue',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        barColor: 'bg-blue-500',
        accentColor: '#3b82f6'
      },
      food: {
        id: 'food',
        name: `Dining (${diningObj.name})`,
        fullName: `Food & Dining - ${diningObj.name}`,
        subtitle: `₹${diningObj.ratePerPersonPerDay}/person/day`,
        icon: 'UtensilsCrossed',
        color: 'amber',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        accentColor: '#f59e0b'
      },
      travel: {
        id: 'travel',
        name: `Transport (${transportObj.name})`,
        fullName: `Travel & Fuel - ${transportObj.name}`,
        subtitle: `${transportObj.desc}`,
        icon: 'Car',
        color: 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        accentColor: '#10b981'
      },
      tickets: {
        id: 'tickets',
        name: `Activities (${activityObj.name})`,
        fullName: `Sightseeing & Safaris`,
        subtitle: `₹${activityObj.ratePerPerson}/person`,
        icon: 'Ticket',
        color: 'purple',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        barColor: 'bg-purple-500',
        accentColor: '#a855f7'
      }
    };

    if (includeShopping) {
      categoriesMap.shopping = {
        id: 'shopping',
        name: 'Spices & Souvenirs',
        fullName: 'Tea, Chocolates & Spices',
        subtitle: `₹800/person`,
        icon: 'ShoppingBag',
        color: 'rose',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        accentColor: '#f43f5e'
      };
    }

    const budgetsMap = {
      rooms: stayTotal,
      food: diningTotal,
      travel: transportTotal,
      tickets: activityTotal
    };
    if (includeShopping) budgetsMap.shopping = shoppingTotal;

    saveTripCategories(categoriesMap, budgetsMap);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy WhatsApp summary
  const handleCopyWhatsApp = () => {
    const text = `🌟 *TripTools - Simulated What-If Budget* 🌟
📅 *Duration:* ${days} Days (${nights} Nights)
👥 *Travelers:* ${travelers} People (${roomCount} Rooms)

🏨 *Stay:* ${stayObj.name} (₹${stayTotal.toLocaleString('en-IN')})
🚗 *Transport:* ${transportObj.name} (₹${transportTotal.toLocaleString('en-IN')})
🍲 *Dining:* ${diningObj.name} (₹${diningTotal.toLocaleString('en-IN')})
🎟️ *Activities:* ${activityObj.name} (₹${activityTotal.toLocaleString('en-IN')})
🛍️ *Shopping:* ₹${shoppingTotal.toLocaleString('en-IN')}

💰 *Total Estimated Budget:* ₹${simulatedTotal.toLocaleString('en-IN')}
👤 *Cost Per Person:* ₹${simulatedPerPerson.toLocaleString('en-IN')} / person
⚡ *Daily Burn Rate:* ₹${simulatedPerDay.toLocaleString('en-IN')} / day

Plan your trip on https://munnartools.vercel.app`;

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
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Interactive Financial Scenario Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Smart 'What-If' Trip Budget Simulator 🧮🔮
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Model alternative trip scenarios in real-time. See instant cost impacts of changing stays, transport, or adding friends!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary!' : 'Share Scenario'}</span>
          </button>

          <button
            onClick={handleApplyToApp}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply to My Trip 🚀</span>
          </button>
        </div>
      </div>

      {/* DURATION & TRAVELERS MODIFIERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Days Slider */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Trip Duration:</span>
            </span>
            <span className="text-sm font-black text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
              {days} Days ({nights} Nights)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>1 Day Trip</span>
            <span>5 Days</span>
            <span>10 Days Tour</span>
          </div>
        </div>

        {/* Travelers Slider */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Traveler Group Size:</span>
            </span>
            <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              {travelers} People ({roomCount} Rooms)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>Solo (1)</span>
            <span>Couple / Friends (4)</span>
            <span>Large Gang (12)</span>
          </div>
        </div>

      </div>

      {/* SIMULATOR CONTROLS & COMPARISON GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Scenario Configurator */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* 1. ACCOMMODATION TIER SELECTOR */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span>1. Accommodation Tier</span>
              </label>
              <span className="text-xs font-black text-blue-700">
                ₹{stayTotal.toLocaleString('en-IN')} Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAY_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedStay(tier.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedStay === tier.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{tier.icon}</span>
                      <span>{tier.name}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      ₹{tier.ratePerNight}/night
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. TRANSPORTATION MODE SELECTOR */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>2. Transport & Vehicle Mode</span>
              </label>
              <span className="text-xs font-black text-emerald-700">
                ₹{transportTotal.toLocaleString('en-IN')} Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TRANSPORT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedTransport(mode.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTransport === mode.id
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{mode.icon}</span>
                      <span>{mode.name}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ₹{mode.baseRate}/{mode.type === 'perPerson' ? 'person' : 'day'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. DINING & SIGHTSEEING PREFERENCES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Dining Style */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                  <span>Dining Style</span>
                </label>
                <span className="text-xs font-black text-amber-700">₹{diningTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-2">
                {DINING_STYLES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDining(d.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedDining === d.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">{d.icon} {d.name}</p>
                      <p className="text-[10px] text-slate-400">{d.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-amber-700 shrink-0">
                      ₹{d.ratePerPersonPerDay}/day
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activities & Safaris */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-purple-600" />
                  <span>Activity Level</span>
                </label>
                <span className="text-xs font-black text-purple-700">₹{activityTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-2">
                {ACTIVITY_TIERS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedActivity(a.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedActivity === a.id
                        ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">{a.icon} {a.name}</p>
                      <p className="text-[10px] text-slate-400">{a.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-purple-700 shrink-0">
                      ₹{a.ratePerPerson}/person
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI SMART OPTIMIZATION INSIGHTS */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 border border-emerald-500/20 shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                AI Financial Optimization Insights
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {insights.map((msg, i) => (
                <p key={i} className="leading-relaxed">{msg}</p>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Grand Comparison Card */}
        <div className="lg:col-span-1 space-y-5">
          
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-teal-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Simulated Scenario Total
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-teal-300 font-bold border border-white/10">
                  {days}D • {travelers}P
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{simulatedTotal.toLocaleString('en-IN')}
                </p>
                
                {/* Net Difference vs Baseline */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-extrabold">
                  {isSaving ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Saves ₹{Math.abs(diffAmount).toLocaleString('en-IN')} ({Math.abs(diffPercent)}%)</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-300">+₹{diffAmount.toLocaleString('en-IN')} vs baseline</span>
                    </>
                  )}
                </div>
              </div>

              {/* Per Person & Daily Split */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Each Person Pays:</span>
                  <strong className="text-teal-300 text-base font-black">
                    ₹{simulatedPerPerson.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Daily Group Burn:</span>
                  <strong className="text-white">₹{simulatedPerDay.toLocaleString('en-IN')} / day</strong>
                </div>
              </div>

              {/* Breakdown Stack Meter */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category Cost Distribution
                </span>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>🏨 Stay ({stayObj.badge})</span>
                    <span className="font-bold">₹{stayTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>🚗 Transport</span>
                    <span className="font-bold">₹{transportTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>🍲 Food & Dining</span>
                    <span className="font-bold">₹{diningTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>🎟️ Activities</span>
                    <span className="font-bold">₹{activityTotal.toLocaleString('en-IN')}</span>
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
                <span>Apply Scenario to My Trip 🚀</span>
              </button>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
