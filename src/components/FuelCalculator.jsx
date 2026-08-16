import React, { useState } from 'react';
import { 
  Fuel, 
  Bike, 
  Car, 
  Zap, 
  MapPin, 
  Gauge, 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Mountain, 
  PlusCircle, 
  Check, 
  Sparkles,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const VEHICLE_PRESETS = [
  { id: 'bike', label: 'Motorcycle / Royal Enfield', icon: Bike, defaultMileage: 32, fuelType: 'petrol' },
  { id: 'scooter', label: 'Scooter / Activa', icon: Bike, defaultMileage: 40, fuelType: 'petrol' },
  { id: 'hatchback', label: 'Hatchback / Sedan', icon: Car, defaultMileage: 16, fuelType: 'petrol' },
  { id: 'suv', label: 'SUV / Thar / Innova', icon: Car, defaultMileage: 13, fuelType: 'diesel' },
  { id: 'ev', label: 'Electric Vehicle (EV)', icon: Zap, defaultMileage: 7, fuelType: 'ev' }
];

const POPULAR_ROUTES = [
  { label: 'Cochin / Aluva ↔ Munnar (Round Trip)', distance: 230 },
  { label: 'Bangalore ↔ Munnar (Round Trip)', distance: 980 },
  { label: 'Chennai ↔ Munnar (Round Trip)', distance: 1160 },
  { label: 'Coimbatore / Pollachi ↔ Munnar (Round Trip)', distance: 320 },
  { label: 'Madurai ↔ Theni ↔ Munnar (Round Trip)', distance: 330 },
  { label: 'Munnar 2-Day Local Sightseeing Circuit', distance: 160 }
];

export default function FuelCalculator() {
  const { addExpense, openAddExpenseForCategory } = useApp();

  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [distanceKm, setDistanceKm] = useState('230');
  const [customMileage, setCustomMileage] = useState('32');
  const [fuelPrice, setFuelPrice] = useState('105');
  const [isGhatRoadMode, setIsGhatRoadMode] = useState(true); // 15-20% hill climbing adjustment
  const [passengerCount, setPassengerCount] = useState(2);
  const [isLoggedSuccess, setIsLoggedSuccess] = useState(false);

  // Handle preset vehicle selection
  const handleSelectPreset = (preset) => {
    setSelectedVehicle(preset.id);
    setCustomMileage(preset.defaultMileage.toString());
    if (preset.fuelType === 'diesel') {
      setFuelPrice('94');
    } else if (preset.fuelType === 'ev') {
      setFuelPrice('10'); // Cost per unit kWh
    } else {
      setFuelPrice('105');
    }
  };

  // Distance calculations
  const distance = parseFloat(distanceKm) || 0;
  const rawMileage = parseFloat(customMileage) || 1;
  
  // Ghat road reduces efficiency by ~18%
  const effectiveMileage = isGhatRoadMode ? Math.max(1, rawMileage * 0.82) : rawMileage;
  
  const pricePerLitre = parseFloat(fuelPrice) || 0;
  const fuelRequired = distance > 0 ? distance / effectiveMileage : 0;
  const totalFuelCost = Math.round(fuelRequired * pricePerLitre);
  const costPerKm = distance > 0 ? (totalFuelCost / distance).toFixed(1) : 0;
  const perPersonCost = Math.round(totalFuelCost / (passengerCount || 1));

  // 1-Tap Log to Bike / Transport Budget
  const handleLogToBudget = () => {
    if (totalFuelCost <= 0) return;

    addExpense({
      category: 'bike',
      amount: totalFuelCost,
      title: `Fuel for ${distance} km (${isGhatRoadMode ? 'Ghat Road' : 'Plain'} Trip)`,
      paymentMode: 'UPI',
      note: `${fuelRequired.toFixed(1)}L at ₹${pricePerLitre}/L (${effectiveMileage.toFixed(1)} km/L)`,
      date: new Date().toISOString().split('T')[0]
    });

    setIsLoggedSuccess(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => setIsLoggedSuccess(false), 3500);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Fuel className="w-4 h-4 text-emerald-600" />
            <span>Road Trip Fuel & Mileage Tool</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ghat Road Fuel & Mileage Calculator ⛽🏍️
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Accurately calculate petrol/diesel consumption, hill climbing adjustments, and per-person travel costs.
          </p>
        </div>

        {totalFuelCost > 0 && (
          <button
            onClick={handleLogToBudget}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            {isLoggedSuccess ? <Check className="w-4 h-4 text-white" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isLoggedSuccess ? 'Logged to Budget!' : 'Log Fuel to Budget'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Inputs vs Real-Time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Configuration */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Step 1: Vehicle Type Presets */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Vehicle Type
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {VEHICLE_PRESETS.map((preset) => {
                const isSelected = selectedVehicle === preset.id;
                const Icon = preset.icon;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                    </div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">{preset.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">~{preset.defaultMileage} km/L</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Route & Distance Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Travel Distance (KM)
              </label>
              <span className="text-xs text-slate-400">Select quick route or enter custom km</span>
            </div>

            {/* Quick Popular Route Pills */}
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={route.label}
                  onClick={() => setDistanceKm(route.distance.toString())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    distanceKm === route.distance.toString()
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {route.label} ({route.distance} km)
                </button>
              ))}
            </div>

            {/* Manual Distance Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="e.g. 250"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mileage (km / Litre)</label>
                <input
                  type="number"
                  value={customMileage}
                  onChange={(e) => setCustomMileage(e.target.value)}
                  placeholder="e.g. 35"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Price (₹ / Litre)</label>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="₹ 105"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Ghat Road Hill Elevation Toggle */}
            <div 
              onClick={() => setIsGhatRoadMode(!isGhatRoadMode)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isGhatRoadMode 
                  ? 'bg-emerald-50/80 border-emerald-200' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isGhatRoadMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Munnar Ghat Road Hill Climbing Adjustment
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Auto-adjusts for 40+ steep hairpin bends (-18% mileage drop on mountain inclines)
                  </p>
                </div>
              </div>

              <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isGhatRoadMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGhatRoadMode ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>

          </div>

          {/* Step 3: Passenger Share Counter */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Split Fuel Among Travelers
                </h4>
                <p className="text-[11px] text-slate-500">
                  Calculate fair per-person share for group bike rides & car trips
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setPassengerCount(num)}
                  className={`w-8 h-8 rounded-xl font-black text-xs transition-all ${
                    passengerCount === num 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Instant Calculation Cards */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Main Calculation Card */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Total Fuel Estimate
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {distance} km
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{totalFuelCost.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Approx <strong>{fuelRequired.toFixed(1)} Litres</strong> required
                </p>
              </div>

              {/* Breakdown Rows */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Effective Mileage:</span>
                  <strong className="text-white">{effectiveMileage.toFixed(1)} km / Litre</strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Running Cost:</span>
                  <strong className="text-white">₹{costPerKm} / km</strong>
                </div>

                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span>Split for {passengerCount} People:</span>
                  <strong className="text-emerald-300 text-sm font-black">
                    ₹{perPersonCost.toLocaleString('en-IN')} / person
                  </strong>
                </div>
              </div>

              {/* 1-Tap Log Button */}
              <button
                onClick={handleLogToBudget}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isLoggedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <PlusCircle className="w-4 h-4 stroke-[2.5]" />}
                <span>{isLoggedSuccess ? 'Added to Budget Tracker!' : 'Log to Bike / Fuel Budget'}</span>
              </button>
            </div>
          </div>

          {/* Quick Ghat Road Tips */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2 text-xs text-slate-600">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Munnar Fuel & Ghat Road Tips</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li>• <strong>Petrol Pumps in Town:</strong> Indian Oil & HP pumps in Munnar town and Adimali. Fill your tank before entering Top Station / Marayoor.</li>
              <li>• <strong>Engine Braking:</strong> Use 2nd/3rd gear while descending Ghat roads to prevent brake overheating.</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}
