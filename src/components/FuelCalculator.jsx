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
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';

const SINGLE_VEHICLE_PRESETS = [
  { id: 'bike', label: 'Motorcycle / Bike', icon: Bike, defaultMileage: 32, fuelType: 'petrol' },
  { id: 'scooter', label: 'Scooter / Activa', icon: Bike, defaultMileage: 40, fuelType: 'petrol' },
  { id: 'hatchback', label: 'Hatchback / Sedan', icon: Car, defaultMileage: 16, fuelType: 'petrol' },
  { id: 'suv', label: 'SUV / Thar / Innova', icon: Car, defaultMileage: 13, fuelType: 'diesel' },
  { id: 'ev', label: 'Electric Vehicle (EV)', icon: Zap, defaultMileage: 7, fuelType: 'ev' }
];

export default function FuelCalculator() {
  const [calcMode, setCalcMode] = useState('single'); // 'single' or 'multi'

  // Single Vehicle State
  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [distanceKm, setDistanceKm] = useState('');
  const [customMileage, setCustomMileage] = useState('32');
  const [fuelPrice, setFuelPrice] = useState('105');
  const [isGhatRoadMode, setIsGhatRoadMode] = useState(true); // 18% mountain incline adjustment
  const [passengerCount, setPassengerCount] = useState(2);

  // Multi-Bike Fleet State
  const [multiDistanceKm, setMultiDistanceKm] = useState('');
  const [multiFuelPrice, setMultiFuelPrice] = useState('105');
  const [multiPassengerCount, setMultiPassengerCount] = useState(2);
  const [bikes, setBikes] = useState([
    { id: 'b1', name: 'Bike 1', model: 'Royal Enfield Classic 350', mileage: '30' },
    { id: 'b2', name: 'Bike 2', model: 'KTM Duke 390', mileage: '25' }
  ]);

  // Single Vehicle Calculation
  const singleDist = parseFloat(distanceKm) || 0;
  const rawMileage = parseFloat(customMileage) || 1;
  const singleEffectiveMileage = isGhatRoadMode ? Math.max(1, rawMileage * 0.82) : rawMileage;
  const singlePrice = parseFloat(fuelPrice) || 0;
  const singleFuelLitres = singleDist > 0 ? singleDist / singleEffectiveMileage : 0;
  const singleTotalCost = Math.round(singleFuelLitres * singlePrice);
  const singleCostPerKm = singleDist > 0 ? (singleTotalCost / singleDist).toFixed(1) : '0';
  const singlePerPerson = Math.round(singleTotalCost / (passengerCount || 1));

  // Multi-Bike Fleet Calculations
  const multiDist = parseFloat(multiDistanceKm) || 0;
  const multiPrice = parseFloat(multiFuelPrice) || 0;

  const bikeCalculations = bikes.map((b) => {
    const raw = parseFloat(b.mileage) || 1;
    const effMileage = isGhatRoadMode ? Math.max(1, raw * 0.82) : raw;
    const litres = multiDist > 0 ? multiDist / effMileage : 0;
    const cost = Math.round(litres * multiPrice);
    return {
      ...b,
      effectiveMileage: effMileage,
      litres: litres,
      cost: cost
    };
  });

  const totalFleetLitres = bikeCalculations.reduce((sum, b) => sum + b.litres, 0);
  const totalFleetCost = bikeCalculations.reduce((sum, b) => sum + b.cost, 0);
  const avgCostPerBike = bikes.length > 0 ? Math.round(totalFleetCost / bikes.length) : 0;
  const multiPerPersonCost = Math.round(totalFleetCost / (multiPassengerCount || 1));

  // Add a new bike to multi-bike list
  const handleAddBike = () => {
    const newId = `b_${Date.now()}`;
    const nextIndex = bikes.length + 1;
    setBikes([
      ...bikes,
      {
        id: newId,
        name: `Bike ${nextIndex}`,
        model: `Bike ${nextIndex}`,
        mileage: '32'
      }
    ]);
  };

  // Remove bike
  const handleRemoveBike = (id) => {
    if (bikes.length <= 1) return;
    setBikes(bikes.filter((b) => b.id !== id));
  };

  // Update bike field
  const handleUpdateBike = (id, field, value) => {
    setBikes(
      bikes.map((b) => {
        if (b.id === id) {
          return { ...b, [field]: value };
        }
        return b;
      })
    );
  };

  // Preset selection for single
  const handleSelectSinglePreset = (preset) => {
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

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Fuel className="w-4 h-4 text-emerald-600" />
            <span>Fuel & Mileage Estimator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Fuel & Mileage Calculator ⛽🏍️
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calculate fuel consumption for single vehicles or a group ride with different bikes and custom mileages!
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCalcMode('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calcMode === 'single'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛵 Single Vehicle
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('multi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calcMode === 'multi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏍️ Multi-Bike Group Ride ({bikes.length})
          </button>
        </div>
      </div>

      {/* MODE 1: SINGLE VEHICLE */}
      {calcMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Left 2 Columns: Input Controls */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Step 1: Vehicle Presets */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Choose Vehicle
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {SINGLE_VEHICLE_PRESETS.map((preset) => {
                  const isSelected = selectedVehicle === preset.id;
                  const Icon = preset.icon;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectSinglePreset(preset)}
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Travel Distance (KM) *
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

            {/* Step 3: Passenger Count (Open input with +/- buttons, NO limit) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Number of Riders / Passengers
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Set any number of people splitting this vehicle's fuel cost
                  </p>
                </div>
              </div>

              {/* Number Stepper & Input with NO limit */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                  title="Decrease person"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={passengerCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPassengerCount(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  min="1"
                  className="w-16 h-10 px-2 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setPassengerCount(passengerCount + 1)}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors shadow-xs"
                  title="Increase person"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="text-xs font-bold text-slate-600 ml-1">Persons</span>
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
                    {singleDist > 0 ? `${singleDist} KM` : 'Enter KM'}
                  </span>
                </div>

                <div>
                  <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    ₹{singleTotalCost.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    {singleDist > 0 ? (
                      <>Approx <strong>{singleFuelLitres.toFixed(1)} Litres</strong> required</>
                    ) : (
                      'Type distance on the left to calculate'
                    )}
                  </p>
                </div>

                {/* Breakdown Rows */}
                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Effective Hill Mileage:</span>
                    <strong className="text-white">{singleEffectiveMileage.toFixed(1)} km / Litre</strong>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Running Cost:</span>
                    <strong className="text-white">₹{singleCostPerKm} / KM</strong>
                  </div>

                  <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                    <span>Per Person ({passengerCount} {passengerCount === 1 ? 'Person' : 'People'}):</span>
                    <strong className="text-emerald-300 text-sm font-black">
                      ₹{singlePerPerson.toLocaleString('en-IN')} / person
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
                Fuel stations are located in <strong>Munnar Town</strong> and <strong>Adimali</strong>. Fill your tank before heading into remote viewpoints.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* MODE 2: MULTI-BIKE FLEET GROUP RIDE */}
      {calcMode === 'multi' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Fleet Distance & Fuel Price Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Group Ride Trip Settings</span>
              </h3>
              <span className="text-xs text-slate-400">
                Applied to all {bikes.length} bikes in your convoy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Trip Distance */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Trip Distance for All Bikes (KM) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={multiDistanceKm}
                    onChange={(e) => setMultiDistanceKm(e.target.value)}
                    placeholder="e.g. 250"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    KM
                  </span>
                </div>
              </div>

              {/* Petrol Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Petrol Price (₹ / Litre)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={multiFuelPrice}
                    onChange={(e) => setMultiFuelPrice(e.target.value)}
                    placeholder="₹ 105"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    ₹/L
                  </span>
                </div>
              </div>

              {/* Ghat Road Hill Incline Adjustment */}
              <div 
                onClick={() => setIsGhatRoadMode(!isGhatRoadMode)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isGhatRoadMode ? 'bg-emerald-50/80 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mountain className={`w-4 h-4 ${isGhatRoadMode ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Ghat Road Incline</h4>
                    <span className="text-[10px] text-slate-500">-18% Hill drop</span>
                  </div>
                </div>

                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${isGhatRoadMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGhatRoadMode ? 'translate-x-5' : ''}`}></div>
                </div>
              </div>

            </div>

            {/* Split Fuel Among Number of Persons in Group (Open input with NO limit) */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Total People Splitting Group Fuel ({multiPassengerCount} Persons)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Enter any number of riders and pillion passengers in the group
                  </p>
                </div>
              </div>

              {/* Open Number Stepper with NO limit */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setMultiPassengerCount(Math.max(1, multiPassengerCount - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                  title="Decrease person"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={multiPassengerCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMultiPassengerCount(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  min="1"
                  className="w-16 h-10 px-2 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setMultiPassengerCount(multiPassengerCount + 1)}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors shadow-xs"
                  title="Increase person"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="text-xs font-bold text-slate-600 ml-1">Persons</span>
              </div>
            </div>

          </div>

          {/* OVERALL GROUP FLEET TOTAL SUMMARY CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Overall Group Total ({bikes.length} Bikes Combined)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Total Fuel Cost for Entire Group Ride 🏍️💨
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-xl bg-white/10 text-emerald-300 font-bold border border-white/10 self-start sm:self-auto">
                {multiDist > 0 ? `${multiDist} KM Trip` : 'Enter Distance Above'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              {/* Total Group Cost */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 font-medium">Total Group Fuel Cost</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                  ₹{totalFleetCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-slate-400 mt-0.5 block">For all {bikes.length} bikes</span>
              </div>

              {/* Total Litres */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 font-medium">Total Petrol Required</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {totalFleetLitres.toFixed(1)} <span className="text-base font-bold text-slate-300">Litres</span>
                </p>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Combined consumption</span>
              </div>

              {/* Per-Person Split */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 font-medium">Per-Person Split ({multiPassengerCount} People)</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                  ₹{multiPerPersonCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Fair share per person</span>
              </div>

              {/* Avg Per Bike */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 font-medium">Average Cost per Bike</span>
                <p className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
                  ₹{avgCostPerBike.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Per bike average</span>
              </div>

            </div>
          </div>

          {/* INDIVIDUAL BIKES LIST & MANUAL TEXT NAME & MILEAGE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-600" />
                <span>Configure Each Bike ({bikes.length})</span>
              </h3>

              <button
                type="button"
                onClick={handleAddBike}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Another Bike</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bikeCalculations.map((bike, index) => (
                <div 
                  key={bike.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-4 hover:border-emerald-300 transition-colors"
                >
                  
                  {/* Bike Header & Delete Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Bike className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-wider text-emerald-800">
                        Bike #{index + 1}
                      </span>
                    </div>

                    {bikes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBike(bike.id)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                        title="Remove Bike"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Free Manual Bike Name & Custom Mileage Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Bike Name / Model:
                      </label>
                      <input
                        type="text"
                        value={bike.model}
                        onChange={(e) => handleUpdateBike(bike.id, 'model', e.target.value)}
                        placeholder="e.g. Royal Enfield, Duke 390, MT-15"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Mileage (km/L):
                      </label>
                      <input
                        type="number"
                        value={bike.mileage}
                        onChange={(e) => handleUpdateBike(bike.id, 'mileage', e.target.value)}
                        placeholder="e.g. 30"
                        min="1"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Individual Bike Calculated Results */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Fuel Required:</span>
                      <p className="text-sm font-black text-slate-800">
                        {bike.litres.toFixed(1)} Litres
                      </p>
                      <span className="text-[10px] text-slate-400">
                        ({bike.effectiveMileage.toFixed(1)} km/L hill eff)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-medium">Fuel Cost:</span>
                      <p className="text-lg font-black text-emerald-700">
                        ₹{bike.cost.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
