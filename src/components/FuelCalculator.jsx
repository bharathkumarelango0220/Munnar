import React, { useState } from 'react';
import { 
  Fuel, 
  Bike, 
  Car, 
  Zap, 
  Mountain, 
  Users, 
  Check, 
  Info,
  RotateCcw
} from 'lucide-react';

const VEHICLE_PRESETS = [
  { id: 'bike', label: 'Motorcycle / Royal Enfield', icon: Bike, defaultMileage: 32, fuelType: 'petrol' },
  { id: 'scooter', label: 'Scooter / Activa', icon: Bike, defaultMileage: 40, fuelType: 'petrol' },
  { id: 'hatchback', label: 'Hatchback / Sedan', icon: Car, defaultMileage: 16, fuelType: 'petrol' },
  { id: 'suv', label: 'SUV / Thar / Innova', icon: Car, defaultMileage: 13, fuelType: 'diesel' },
  { id: 'ev', label: 'Electric Vehicle (EV)', icon: Zap, defaultMileage: 7, fuelType: 'ev' }
];

export default function FuelCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [distanceKm, setDistanceKm] = useState('');
  const [customMileage, setCustomMileage] = useState('32');
  const [fuelPrice, setFuelPrice] = useState('105');
  const [isGhatRoadMode, setIsGhatRoadMode] = useState(true); // 18% mountain incline adjustment
  const [passengerCount, setPassengerCount] = useState(2);

  // Handle vehicle preset selection
  const handleSelectPreset = (preset) => {
    setSelectedVehicle(preset.id);
    setCustomMileage(preset.defaultMileage.toString());
    if (preset.fuelType === 'diesel') {
      setFuelPrice('94');
    } else if (preset.fuelType === 'ev') {
      setFuelPrice('10');
    } else {
      setFuelPrice('105');
    }
  };

  // Calculations
  const distance = parseFloat(distanceKm) || 0;
  const rawMileage = parseFloat(customMileage) || 1;
  const effectiveMileage = isGhatRoadMode ? Math.max(1, rawMileage * 0.82) : rawMileage;
  const pricePerLitre = parseFloat(fuelPrice) || 0;
  const fuelRequired = distance > 0 ? distance / effectiveMileage : 0;
  const totalFuelCost = Math.round(fuelRequired * pricePerLitre);
  const costPerKm = distance > 0 ? (totalFuelCost / distance).toFixed(1) : '0';
  const perPersonCost = Math.round(totalFuelCost / (passengerCount || 1));

  const handleReset = () => {
    setDistanceKm('');
    setCustomMileage('32');
    setSelectedVehicle('bike');
    setFuelPrice('105');
    setPassengerCount(2);
    setIsGhatRoadMode(true);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Fuel className="w-4 h-4 text-emerald-600" />
            <span>Fuel & Mileage Estimator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Fuel & Mileage Calculator ⛽🚗
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Type your travel distance in kilometers to see total petrol/diesel litres, cost, and per-person split.
          </p>
        </div>

        {distance > 0 && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold shadow-soft transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main Grid: Inputs vs Calculation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Input Controls */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Step 1: Vehicle Presets */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Choose Vehicle
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {VEHICLE_PRESETS.map((preset) => {
                const isSelected = selectedVehicle === preset.id;
                const Icon = preset.icon;

                return (
                  <button
                    key={preset.id}
                    type="button"
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

          {/* Step 2: Distance & Mileage Manual Inputs */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Enter Distance & Fuel Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Distance Input */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Total Travel Distance (KM) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    placeholder="e.g. 150"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    KM
                  </span>
                </div>
              </div>

              {/* Mileage Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Vehicle Mileage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customMileage}
                    onChange={(e) => setCustomMileage(e.target.value)}
                    placeholder="e.g. 35"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    km/L
                  </span>
                </div>
              </div>

              {/* Fuel Price Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fuel Price (₹ / Litre)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    placeholder="₹ 105"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    ₹/L
                  </span>
                </div>
              </div>

            </div>

            {/* Ghat Road Mountain Incline Toggle */}
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
                    Munnar Ghat Road Hill Incline Adjustment
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Accounts for hairpin bends and steep slopes (-18% mileage on hill climbs)
                  </p>
                </div>
              </div>

              <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isGhatRoadMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGhatRoadMode ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>

          </div>

          {/* Step 3: Passenger Count */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Number of Passengers / Riders
                </h4>
                <p className="text-[11px] text-slate-500">
                  See how much fuel costs per person
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPassengerCount(num)}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
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

        {/* Right Column: Clean Calculated Results Display */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Total Fuel Estimate
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {distance > 0 ? `${distance} KM` : 'Enter KM'}
                </span>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{totalFuelCost.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {distance > 0 ? (
                    <>Approx <strong>{fuelRequired.toFixed(1)} Litres</strong> required</>
                  ) : (
                    'Type distance on the left to calculate'
                  )}
                </p>
              </div>

              {/* Breakdown Rows */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Effective Hill Mileage:</span>
                  <strong className="text-white">{effectiveMileage.toFixed(1)} km / Litre</strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Running Cost:</span>
                  <strong className="text-white">₹{costPerKm} / KM</strong>
                </div>

                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span>Per Person ({passengerCount} People):</span>
                  <strong className="text-emerald-300 text-sm font-black">
                    ₹{perPersonCost.toLocaleString('en-IN')} / person
                  </strong>
                </div>
              </div>

            </div>
          </div>

          {/* Tips Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2 text-xs text-slate-600">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Ghat Road Driving Note</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Fuel pumps are located in <strong>Munnar Town</strong> and <strong>Adimali</strong>. It is best to fill your tank before heading to Top Station or Marayoor.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
