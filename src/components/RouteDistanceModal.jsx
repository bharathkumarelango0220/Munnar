import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Check, 
  Sparkles, 
  LocateFixed, 
  Mountain, 
  Clock, 
  Route, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Fuel, 
  Milestone, 
  ArrowUpDown, 
  Search, 
  Zap,
  Coffee,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { 
  POPULAR_ORIGINS, 
  POPULAR_DESTINATIONS, 
  searchCitiesHybrid, 
  calculateRouteDistance, 
  getRouteIntelligence,
  getGoogleMapsNavigationUrl
} from '../services/routingService';
import { triggerHaptic } from '../utils/haptics';

export default function RouteDistanceModal({ isOpen, onClose, onApplyDistance }) {
  const [selectedOrigin, setSelectedOrigin] = useState(POPULAR_ORIGINS[0]); // Coimbatore default
  const [selectedDest, setSelectedDest] = useState(POPULAR_DESTINATIONS[0]); // Munnar Town default
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  // Origin search state
  const [customOriginQuery, setCustomOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);

  // Destination search state
  const [customDestQuery, setCustomDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const isSelectingOriginRef = useRef(false);
  const isSelectingDestRef = useRef(false);
  const originBoxRef = useRef(null);
  const destBoxRef = useRef(null);

  // Click outside listener to dismiss dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (originBoxRef.current && !originBoxRef.current.contains(e.target)) {
        setShowOriginDropdown(false);
      }
      if (destBoxRef.current && !destBoxRef.current.contains(e.target)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Origin Search Suggestions Debounce
  useEffect(() => {
    if (isSelectingOriginRef.current) {
      isSelectingOriginRef.current = false;
      setShowOriginDropdown(false);
      setOriginSuggestions([]);
      return;
    }
    if (!customOriginQuery || customOriginQuery.trim().length === 0) {
      setOriginSuggestions([]);
      setShowOriginDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingOrigin(true);
      const results = await searchCitiesHybrid(customOriginQuery);
      setOriginSuggestions(results);
      setIsSearchingOrigin(false);
      setShowOriginDropdown(results.length > 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [customOriginQuery]);

  // Destination Search Suggestions Debounce
  useEffect(() => {
    if (isSelectingDestRef.current) {
      isSelectingDestRef.current = false;
      setShowDestDropdown(false);
      setDestSuggestions([]);
      return;
    }
    if (!customDestQuery || customDestQuery.trim().length === 0) {
      setDestSuggestions([]);
      setShowDestDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingDest(true);
      const results = await searchCitiesHybrid(customDestQuery);
      setDestSuggestions(results);
      setIsSearchingDest(false);
      setShowDestDropdown(results.length > 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [customDestQuery]);

  // Auto-calculate route whenever origin or destination changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchRoute = async () => {
      setIsCalculating(true);
      try {
        const result = await calculateRouteDistance(selectedOrigin, selectedDest);
        if (isMounted) {
          setRouteResult(result);
        }
      } catch (err) {
        console.warn('Route calculation error:', err);
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    };

    fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [selectedOrigin, selectedDest, isOpen]);

  if (!isOpen) return null;

  const baseDistanceKm = routeResult ? routeResult.distanceKm : 0;
  const totalCalculatedKm = isRoundTrip ? baseDistanceKm * 2 : baseDistanceKm;

  // Calculate rich fuel strategy & mountain road insights
  const intelligence = getRouteIntelligence(selectedOrigin, selectedDest, totalCalculatedKm);

  // Handle Current GPS as Origin
  const handleUseCurrentLocation = () => {
    triggerHaptic(15);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your device browser.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const userLoc = {
          id: 'current_gps',
          name: 'My Live GPS Location',
          shortName: 'Live Location',
          state: 'GPS',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          highway: 'Direct GPS Highway Route',
          elevationGain: '+1,500m Mountain Ascent',
          hairpinBends: 16,
          lastFuelStop: 'Nearest Highway Fuel Pump',
          tolls: 'FASTag Tolls'
        };
        isSelectingOriginRef.current = true;
        setSelectedOrigin(userLoc);
        setCustomOriginQuery(userLoc.name);
        setShowOriginDropdown(false);
        setOriginSuggestions([]);
      },
      (err) => {
        setIsGpsLoading(false);
        alert('Could not retrieve GPS location. Please ensure location permissions are granted.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Swap Locations
  const handleSwapLocations = () => {
    triggerHaptic(15);
    const prevOrigin = selectedOrigin;
    const prevDest = selectedDest;
    isSelectingOriginRef.current = true;
    isSelectingDestRef.current = true;
    setSelectedOrigin(prevDest);
    setSelectedDest(prevOrigin);
    setCustomOriginQuery(prevDest.name);
    setCustomDestQuery(prevOrigin.name);
    setShowOriginDropdown(false);
    setShowDestDropdown(false);
    setOriginSuggestions([]);
    setDestSuggestions([]);
  };

  // Apply Calculated Distance to Fuel Calculator
  const handleApply = () => {
    triggerHaptic(20);
    setAppliedFeedback(true);
    if (onApplyDistance && totalCalculatedKm > 0) {
      onApplyDistance(totalCalculatedKm, {
        origin: selectedOrigin.name,
        destination: selectedDest.name,
        isRoundTrip
      });
    }
    setTimeout(() => {
      setAppliedFeedback(false);
      onClose();
    }, 450);
  };

  // Share route summary on WhatsApp
  const handleShareRoute = () => {
    triggerHaptic(15);
    const text = `🗺️ *Munnar Road Trip & Fuel Plan*\n\n` +
      `🚗 *Route:* ${selectedOrigin.name} ➔ ${selectedDest.name}\n` +
      `📏 *Total Distance:* ${totalCalculatedKm} KM (${isRoundTrip ? 'Round Trip' : 'One-Way'})\n` +
      `⏱️ *Driving Duration:* ${routeResult?.durationText || 'Calculating...'}\n` +
      `⛽ *Estimated Petrol:* ~${intelligence.fuelLiters} Liters (~₹${intelligence.estimatedFuelCost.toLocaleString('en-IN')})\n` +
      `⛽ *Last 24/7 Bunk:* ${intelligence.fuelPump}\n` +
      `🏔️ *Hairpins:* ${intelligence.hairpins} Curves (${intelligence.elevation})\n` +
      `🛣️ *Highway:* ${intelligence.highway}\n\n` +
      `Plan & calculate exact trip petrol split on: https://munnartools.vercel.app`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const googleMapsUrl = getGoogleMapsNavigationUrl(selectedOrigin, selectedDest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp flex flex-col max-h-[92vh]">
        
        {/* Sleek Minimal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-5 py-4 text-white relative shrink-0 flex items-center justify-between border-b border-emerald-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Route Distance & Fuel Guide</span>
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Google Maps Verified Distances • 24/7 Fuel Bunk Strategy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* DEPARTURE & DESTINATION SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            
            {/* 1. Departure Box */}
            <div ref={originBoxRef} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Departure</span>
                </label>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isGpsLoading}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold hover:bg-emerald-200 transition-colors active:scale-95"
                >
                  <LocateFixed className="w-2.5 h-2.5" />
                  <span>{isGpsLoading ? 'Locating...' : 'GPS'}</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customOriginQuery || selectedOrigin.name}
                    onChange={(e) => {
                      isSelectingOriginRef.current = false;
                      setCustomOriginQuery(e.target.value);
                    }}
                    onFocus={() => {
                      if (!customOriginQuery) setCustomOriginQuery(selectedOrigin.name);
                      if (originSuggestions.length > 0) setShowOriginDropdown(true);
                    }}
                    placeholder="Search departure city..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  {customOriginQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        isSelectingOriginRef.current = true;
                        setCustomOriginQuery('');
                        setOriginSuggestions([]);
                        setShowOriginDropdown(false);
                      }}
                      className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Instant Floating Dropdown */}
                {showOriginDropdown && originSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {originSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          isSelectingOriginRef.current = true;
                          setSelectedOrigin({
                            id: item.id,
                            name: item.name,
                            shortName: item.shortName,
                            state: item.state,
                            lat: item.lat,
                            lon: item.lon
                          });
                          setCustomOriginQuery(item.name);
                          setShowOriginDropdown(false);
                          setOriginSuggestions([]);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-900 dark:text-white truncate">{item.shortName}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{item.state}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {POPULAR_ORIGINS.slice(0, 4).map((orig) => {
                  const isSelected = selectedOrigin.id === orig.id || selectedOrigin.name === orig.name;
                  return (
                    <button
                      key={orig.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        isSelectingOriginRef.current = true;
                        setSelectedOrigin(orig);
                        setCustomOriginQuery(orig.name);
                        setShowOriginDropdown(false);
                        setOriginSuggestions([]);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {orig.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Destination Box */}
            <div ref={destBoxRef} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Destination</span>
                </label>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-1.5 py-0.5 rounded-md">
                  {selectedDest.altitude || 'Munnar'}
                </span>
              </div>

              {/* Search Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customDestQuery || selectedDest.name}
                    onChange={(e) => {
                      isSelectingDestRef.current = false;
                      setCustomDestQuery(e.target.value);
                    }}
                    onFocus={() => {
                      if (!customDestQuery) setCustomDestQuery(selectedDest.name);
                      if (destSuggestions.length > 0) setShowDestDropdown(true);
                    }}
                    placeholder="Search destination city..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-teal-500 font-semibold"
                  />
                  {customDestQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        isSelectingDestRef.current = true;
                        setCustomDestQuery('');
                        setDestSuggestions([]);
                        setShowDestDropdown(false);
                      }}
                      className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Instant Floating Dropdown */}
                {showDestDropdown && destSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {destSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          isSelectingDestRef.current = true;
                          setSelectedDest({
                            id: item.id,
                            name: item.name,
                            shortName: item.shortName,
                            lat: item.lat,
                            lon: item.lon,
                            altitude: item.tag
                          });
                          setCustomDestQuery(item.name);
                          setShowDestDropdown(false);
                          setDestSuggestions([]);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-900 dark:text-white truncate">{item.shortName}</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold shrink-0 ml-1">{item.tag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {POPULAR_DESTINATIONS.slice(0, 4).map((dest) => {
                  const isSelected = selectedDest.id === dest.id || selectedDest.name === dest.name;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        isSelectingDestRef.current = true;
                        setSelectedDest(dest);
                        setCustomDestQuery(dest.name);
                        setShowDestDropdown(false);
                        setDestSuggestions([]);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                      }`}
                    >
                      {dest.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quick Swap Pill */}
          <div className="flex justify-center -my-1.5">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-1 text-[11px] font-bold active:scale-95"
            >
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              <span>Swap Locations</span>
            </button>
          </div>

          {/* HERO DISTANCE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shadow-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Google Maps Verified Road Distance
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {isCalculating ? '...' : totalCalculatedKm}
                  </span>
                  <span className="text-base font-bold text-emerald-300">KM</span>
                  <span className="text-[11px] text-slate-300 ml-1">
                    {isRoundTrip ? '(Round Trip)' : '(One-Way)'}
                  </span>
                </div>
              </div>

              {/* Trip Switch */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => { triggerHaptic(10); setIsRoundTrip(false); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                    !isRoundTrip ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  One-Way
                </button>
                <button
                  type="button"
                  onClick={() => { triggerHaptic(10); setIsRoundTrip(true); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                    isRoundTrip ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Round Trip (2×)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white text-[11px]">{routeResult?.durationText || '~Calculating...'}</span>
              </div>

              <div className="flex items-center gap-1.5 truncate">
                <Compass className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span className="font-bold text-white text-[11px] truncate">{intelligence.highway.split(' ')[0] || 'Corridor'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-white text-[11px] truncate">{intelligence.elevation.split(' ')[0]} Climb</span>
              </div>
            </div>
          </div>

          {/* 3 CLEAN INTELLIGENCE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            
            {/* 1. Fuel Strategy */}
            <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-amber-900 dark:text-amber-200 text-[11px] uppercase">
                <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Fuel Strategy</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Last 24/7 Bunk: <b className="text-amber-700 dark:text-amber-300">{intelligence.fuelPump.split(' ')[0]}</b>
              </div>
              <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                ~{intelligence.fuelLiters}L Petrol (₹{intelligence.estimatedFuelCost.toLocaleString('en-IN')})
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                ⚠️ Top up full tank at base; hill bunks close by 8 PM.
              </div>
            </div>

            {/* 2. Ghats & Hairpins */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-emerald-900 dark:text-emerald-200 text-[11px] uppercase">
                <Mountain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ghat Road Guide</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Hairpin Curves: <b className="text-emerald-700 dark:text-emerald-300">{intelligence.hairpins} Curves</b>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                Heavy mist after 5 PM. Use <b>2nd/3rd gear engine braking</b> on downhills.
              </div>
            </div>

            {/* 3. Tolls & Pitstops */}
            <div className="p-3 rounded-2xl bg-blue-500/10 dark:bg-blue-950/20 border border-blue-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-blue-900 dark:text-blue-200 text-[11px] uppercase">
                <Coffee className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Pitstops & Tolls</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Tolls: <b className="text-blue-700 dark:text-blue-300">{intelligence.tolls}</b>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                Recommended stops: <b>Cheeyappara Waterfalls & Gap Road Viewpoint</b>.
              </div>
            </div>

          </div>

          {/* Quick Nav link */}
          <div className="flex items-center justify-between text-xs px-2 pt-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Ready for turn-by-turn driving?
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareRoute}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-bold shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 active:scale-95"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isCalculating || totalCalculatedKm <= 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {appliedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Applied! ✓</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Apply {totalCalculatedKm} KM to Fuel Calculator</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
