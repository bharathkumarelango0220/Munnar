import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ReceiptText,
  BadgePercent,
  ChevronDown,
  ChevronUp,
  MapPin,
  Route
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/haptics';
import RouteDistanceModal from './RouteDistanceModal';

const SINGLE_VEHICLE_PRESETS = [
  { id: 'bike', label: 'Motorcycle / Bike', icon: Bike, defaultMileage: 32, fuelType: 'petrol' },
  { id: 'scooter', label: 'Scooter / Activa', icon: Bike, defaultMileage: 40, fuelType: 'petrol' },
  { id: 'hatchback', label: 'Hatchback / Sedan', icon: Car, defaultMileage: 16, fuelType: 'petrol' },
  { id: 'suv', label: 'SUV / Thar / Innova', icon: Car, defaultMileage: 13, fuelType: 'diesel' },
  { id: 'ev', label: 'Electric Vehicle (EV)', icon: Zap, defaultMileage: 7, fuelType: 'ev' }
];

export default function FuelCalculator() {
  const getStorage = () => localStorage;
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const [calcMode, setCalcMode] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_mode_v3') || 'single';
    } catch (e) {
      return 'single';
    }
  });

  // Single Vehicle State (Starts empty/0 on fresh device)
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_selected_veh_v3') || 'bike';
    } catch (e) {
      return 'bike';
    }
  });

  const [distanceKm, setDistanceKm] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_dist_v3') || '';
    } catch (e) {
      return '';
    }
  });

  const [customMileage, setCustomMileage] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_mileage_v3') || '';
    } catch (e) {
      return '';
    }
  });

  const [fuelPrice, setFuelPrice] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_price_v3') || '';
    } catch (e) {
      return '';
    }
  });

  const [isGhatRoadMode, setIsGhatRoadMode] = useState(true); // 18% mountain incline adjustment
  const [passengerCount, setPassengerCount] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_fuel_pass_v3');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  // Single Vehicle Rental Option
  const [isSingleRental, setIsSingleRental] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_single_rental_v3') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [singleRentalFee, setSingleRentalFee] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_single_fee_v3') || '';
    } catch (e) {
      return '';
    }
  });

  // Multi-Bike Fleet State (Starts empty/0 on fresh device)
  const [multiDistanceKm, setMultiDistanceKm] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_multi_dist_v3') || '';
    } catch (e) {
      return '';
    }
  });

  const [multiFuelPrice, setMultiFuelPrice] = useState(() => {
    try {
      return getStorage().getItem('munnar_fuel_multi_price_v3') || '';
    } catch (e) {
      return '';
    }
  });

  const [multiPassengerCount, setMultiPassengerCount] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_fuel_multi_pass_v3');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [bikes, setBikes] = useState(() => {
    try {
      const saved = getStorage().getItem('munnar_fuel_fleet_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Listen to Global Reset Event
  useEffect(() => {
    const handleResetAll = () => {
      setDistanceKm('');
      setCustomMileage('');
      setFuelPrice('');
      setPassengerCount(0);
      setIsSingleRental(false);
      setSingleRentalFee('');
      setMultiDistanceKm('');
      setMultiFuelPrice('');
      setMultiPassengerCount(0);
      setBikes([]);
    };
    window.addEventListener('triptools_reset_all', handleResetAll);
    return () => window.removeEventListener('triptools_reset_all', handleResetAll);
  }, []);

  // Persist all fuel inputs
  useEffect(() => {
    try {
      const storage = getStorage();
      storage.setItem('munnar_fuel_dist_v3', distanceKm);
      storage.setItem('munnar_fuel_mileage_v3', customMileage);
      storage.setItem('munnar_fuel_price_v3', fuelPrice);
      storage.setItem('munnar_fuel_pass_v3', passengerCount.toString());
      storage.setItem('munnar_fuel_single_rental_v3', isSingleRental ? 'true' : 'false');
      storage.setItem('munnar_fuel_single_fee_v3', singleRentalFee);
      storage.setItem('munnar_fuel_multi_dist_v3', multiDistanceKm);
      storage.setItem('munnar_fuel_multi_price_v3', multiFuelPrice);
      storage.setItem('munnar_fuel_multi_pass_v3', multiPassengerCount.toString());
      storage.setItem('munnar_fuel_fleet_v3', JSON.stringify(bikes));
      storage.setItem('munnar_fuel_mode_v3', calcMode);
      storage.setItem('munnar_fuel_selected_veh_v3', selectedVehicle);
    } catch (e) {}
  }, [
    distanceKm, 
    customMileage, 
    fuelPrice, 
    passengerCount, 
    isSingleRental, 
    singleRentalFee, 
    multiDistanceKm, 
    multiFuelPrice, 
    multiPassengerCount, 
    bikes, 
    calcMode, 
    selectedVehicle
  ]);

  // Single Vehicle Calculation
  const singleDist = parseFloat(distanceKm) || 0;
  const rawMileage = parseFloat(customMileage) || 1;
  const singleEffectiveMileage = isGhatRoadMode ? Math.max(1, rawMileage * 0.82) : rawMileage;
  const singlePrice = parseFloat(fuelPrice) || 0;
  const singleFuelLitres = singleDist > 0 ? singleDist / singleEffectiveMileage : 0;
  const singleFuelCost = Math.round(singleFuelLitres * singlePrice);
  const singleRentalCost = isSingleRental ? (parseFloat(singleRentalFee) || 0) : 0;
  const singleTotalCost = singleFuelCost + singleRentalCost;
  const singleCostPerKm = singleDist > 0 ? (singleTotalCost / singleDist).toFixed(1) : '0';
  const singlePerPerson = passengerCount > 0 ? Math.round(singleTotalCost / passengerCount) : singleTotalCost;

  // Multi-Bike Fleet Calculations
  const multiDist = parseFloat(multiDistanceKm) || 0;
  const multiPrice = parseFloat(multiFuelPrice) || 0;

  const bikeCalculations = bikes.map((b) => {
    const raw = parseFloat(b.mileage) || 1;
    const effMileage = isGhatRoadMode ? Math.max(1, raw * 0.82) : raw;
    const litres = multiDist > 0 ? multiDist / effMileage : 0;
    const fuelCost = Math.round(litres * multiPrice);
    const rentalCost = b.isRental ? (parseFloat(b.rentalFee) || 0) : 0;
    const totalBikeCost = fuelCost + rentalCost;

    return {
      ...b,
      effectiveMileage: effMileage,
      litres: litres,
      fuelCost: fuelCost,
      rentalCost: rentalCost,
      totalBikeCost: totalBikeCost
    };
  });

  const totalFleetLitres = bikeCalculations.reduce((sum, b) => sum + b.litres, 0);
  const totalFleetFuelCost = bikeCalculations.reduce((sum, b) => sum + b.fuelCost, 0);
  const totalFleetRentalCost = bikeCalculations.reduce((sum, b) => sum + b.rentalCost, 0);
  const totalFleetGrandCost = totalFleetFuelCost + totalFleetRentalCost;
  const avgCostPerBike = bikes.length > 0 ? Math.round(totalFleetGrandCost / bikes.length) : 0;
  const multiPerPersonCost = multiPassengerCount > 0 ? Math.round(totalFleetGrandCost / multiPassengerCount) : totalFleetGrandCost;

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
        mileage: '32',
        isRental: false,
        rentalFee: ''
      }
    ]);
  };

  // Remove bike
  const handleRemoveBike = (id) => {
    if (bikes.length <= 1) return;
    setBikes(bikes.filter((b) => b.id !== id));
  };

  // Update bike fields
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
            <span>Fuel & Rental Cost Estimator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Fuel & Rental Calculator ⛽🏍️
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calculate petrol consumption + optional rental charges for single vehicles or multi-bike fleet rides.
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Travel Distance (KM) *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(15);
                        setIsRouteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline active:scale-95 transition-transform"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>🗺️ Route Finder</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
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
                      inputMode="decimal"
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
                      inputMode="decimal"
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
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60' 
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isGhatRoadMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                       Munnar Ghat Road Hill Incline Adjustment
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-emerald-400 font-medium">
                      Accounts for hairpin bends and steep slopes (-18% mileage on hill climbs)
                    </p>
                  </div>
                </div>

                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isGhatRoadMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGhatRoadMode ? 'translate-x-5' : ''}`}></div>
                </div>
              </div>

            </div>

            {/* Step 3: Rental Bike Option (ON/OFF Toggle & Amount Input) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border ${isSingleRental ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <ReceiptText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      Is this a Rental Bike / Vehicle?
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Enable to include bike rental fees in total cost and per-person split
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setIsSingleRental(!isSingleRental)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isSingleRental ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isSingleRental ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>

              {/* Rental Amount Input (if ON) */}
              {isSingleRental && (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-slideDown">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">
                      Total Bike / Vehicle Rental Charge (₹)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Total rental amount paid for this trip/day
                    </span>
                  </div>

                  <div className="relative w-full sm:w-44">
                    <span className="absolute left-3.5 top-3 text-xs font-black text-purple-700">₹</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={singleRentalFee}
                      onChange={(e) => setSingleRentalFee(e.target.value)}
                      placeholder="e.g. 1000"
                      min="0"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-purple-200 text-sm font-black text-slate-900 focus:outline-none focus:border-purple-500 bg-purple-50/40 shadow-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Passenger Count */}
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
                    Set any number of people splitting this vehicle's total cost
                  </p>
                </div>
              </div>

              {/* Number Stepper & Input */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setPassengerCount(Math.max(0, passengerCount - 1));
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={passengerCount === 0 ? '' : passengerCount}
                  placeholder="0"
                  onChange={(e) => setPassengerCount(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-16 h-10 px-2 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setPassengerCount(passengerCount + 1);
                  }}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors shadow-xs active:scale-90"
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
                    Total Trip Vehicle Cost
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
                      <>Petrol: <strong>{singleFuelLitres.toFixed(1)}L (₹{singleFuelCost})</strong> {isSingleRental ? `+ Rental: ₹${singleRentalCost}` : ''}</>
                    ) : (
                      'Type distance on the left to calculate'
                    )}
                  </p>
                </div>

                {/* Breakdown Rows */}
                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Fuel Expense:</span>
                    <strong className="text-white">₹{singleFuelCost.toLocaleString('en-IN')}</strong>
                  </div>

                  {isSingleRental && (
                    <div className="flex justify-between text-purple-300 font-bold">
                      <span>Rental Fee:</span>
                      <strong>+₹{singleRentalCost.toLocaleString('en-IN')}</strong>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>Effective Hill Mileage:</span>
                    <strong className="text-white">{singleEffectiveMileage.toFixed(1)} km / Litre</strong>
                  </div>

                  <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                    <span>Per Person ({passengerCount > 0 ? passengerCount : 1} People):</span>
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
                <span>Rental & Fuel Advice</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Check vehicle brakes and engine oil before starting mountain climbs. Mountain fuel stations are in <strong>Munnar Town</strong> and <strong>Adimali</strong>.
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Trip Distance for All Bikes (KM) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      setIsRouteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline active:scale-95 transition-transform"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>🗺️ Route Finder</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
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
                    inputMode="decimal"
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
                onClick={() => {
                  triggerHaptic(15);
                  setIsGhatRoadMode(!isGhatRoadMode);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isGhatRoadMode 
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300' 
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mountain className={`w-4 h-4 ${isGhatRoadMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Ghat Road Incline</h4>
                    <span className="text-[10px] text-slate-500 dark:text-emerald-400 font-bold">-18% Hill drop</span>
                  </div>
                </div>

                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${isGhatRoadMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGhatRoadMode ? 'translate-x-5' : ''}`}></div>
                </div>
              </div>

            </div>

            {/* Split Fuel Among Number of Persons in Group */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Total People Splitting Group Ride ({multiPassengerCount} Persons)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Enter total riders and pillion passengers sharing the overall group cost
                  </p>
                </div>
              </div>

              {/* Number Stepper */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setMultiPassengerCount(Math.max(0, multiPassengerCount - 1));
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={multiPassengerCount === 0 ? '' : multiPassengerCount}
                  placeholder="0"
                  onChange={(e) => setMultiPassengerCount(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-16 h-10 px-2 rounded-xl border border-slate-300 text-center font-black text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setMultiPassengerCount(multiPassengerCount + 1);
                  }}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-colors shadow-xs active:scale-90"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="text-xs font-bold text-slate-600 ml-1">Persons</span>
              </div>
            </div>

          </div>

          {/* STEP 2: INDIVIDUAL BIKES LIST WITH RENTAL TOGGLE FOR EACH BIKE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-600" />
                <span>Configure Each Bike ({bikes.length})</span>
              </h3>

              <button
                type="button"
                onClick={handleAddBike}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
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

                  {/* Bike Name & Custom Mileage Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Bike Name / Model:
                      </label>
                      <input
                        type="text"
                        value={bike.model}
                        onChange={(e) => handleUpdateBike(bike.id, 'model', e.target.value)}
                        placeholder="e.g. Royal Enfield, Duke 390"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Mileage (km/L):
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={bike.mileage}
                        onChange={(e) => handleUpdateBike(bike.id, 'mileage', e.target.value)}
                        placeholder="e.g. 30"
                        min="1"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* RENTAL OPTION FOR THIS INDIVIDUAL BIKE */}
                  <div className="p-3 rounded-2xl bg-purple-50/40 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-850/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ReceiptText className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                        <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                          Is this bike rented?
                        </span>
                      </div>

                      <div 
                        onClick={() => {
                          triggerHaptic(15);
                          handleUpdateBike(bike.id, 'isRental', !bike.isRental);
                        }}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                          bike.isRental ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${bike.isRental ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>

                    {bike.isRental && (
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-purple-200/50 dark:border-purple-800/40 animate-slideDown">
                        <label className="text-[11px] font-bold text-purple-900 dark:text-purple-300">
                          Rental Fee (₹):
                        </label>
                        <div className="relative w-32">
                          <span className="absolute left-2.5 top-1.5 text-xs font-black text-purple-700 dark:text-purple-400">₹</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={bike.rentalFee}
                            onChange={(e) => handleUpdateBike(bike.id, 'rentalFee', e.target.value)}
                            placeholder="e.g. 1000"
                            min="0"
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 bg-white dark:bg-slate-900 text-right"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Individual Bike Calculated Results */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Fuel Required:</span>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {bike.litres.toFixed(1)} Litres (₹{bike.fuelCost})
                      </p>
                      {bike.isRental && (
                        <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold block">
                          + Rental: ₹{bike.rentalCost}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-medium">Total Bike Cost:</span>
                      <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                        ₹{bike.totalBikeCost.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* ADD ANOTHER BIKE BUTTON (Placed directly after created bike modules on mobile & desktop) */}
            <button
              type="button"
              onClick={handleAddBike}
              className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-98 group"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span>+ Add Another Bike to Convoy</span>
            </button>
          </div>

          {/* STEP 3: OVERALL GROUP FLEET TOTAL SUMMARY CARD (CALCULATED VALUES) */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Overall Group Total ({bikes.length} Bikes Combined)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Total Cost for Entire Group Ride 🏍️💨
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-xl bg-white/10 text-emerald-300 font-bold border border-white/10 self-start sm:self-auto">
                {multiDist > 0 ? `${multiDist} KM Trip` : 'Enter Distance Above'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              {/* Grand Total Cost (Fuel + Rental) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 font-medium">Total Group Cost</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                  ₹{totalFleetGrandCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Fuel: ₹{totalFleetFuelCost.toLocaleString('en-IN')} {totalFleetRentalCost > 0 ? `+ Rental: ₹${totalFleetRentalCost.toLocaleString('en-IN')}` : ''}
                </span>
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
                <span className="text-xs text-slate-300 font-medium">Per-Person Split ({multiPassengerCount > 0 ? multiPassengerCount : 1} People)</span>
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

        </div>
      )}

      {/* Floating Sticky Live Cost Bar on Mobile */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 lg:hidden w-[92%] max-w-sm bg-slate-950/95 dark:bg-slate-900/95 text-white py-2.5 px-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-center justify-between pointer-events-auto animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Live Estimate</span>
            <span className="text-sm font-black text-white">
              ₹{(calcMode === 'single' ? singleTotalCost : totalFleetGrandCost).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium block">Per Rider</span>
          <span className="text-xs font-black text-emerald-300">
            ₹{(calcMode === 'single' ? singlePerPerson : multiPerPersonCost).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Smart Route & Distance Calculator Modal (100% Free OSRM & OpenStreetMap API) */}
      <RouteDistanceModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onApplyDistance={(calculatedKm) => {
          if (calcMode === 'single') {
            setDistanceKm(calculatedKm.toString());
          } else {
            setMultiDistanceKm(calculatedKm.toString());
          }
        }}
      />

    </section>
  );
}
