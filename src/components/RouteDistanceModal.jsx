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
  AlertCircle, 
  ExternalLink, 
  Share2, 
  Fuel, 
  ShieldAlert, 
  Coins, 
  Milestone, 
  ArrowUpDown, 
  Search, 
  Wifi, 
  AlertTriangle,
  RotateCcw,
  Coffee,
  Compass,
  Zap,
  ChevronRight
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
  const [selectedOrigin, setSelectedOrigin] = useState(POPULAR_ORIGINS[0]);
  const [selectedDest, setSelectedDest] = useState(POPULAR_DESTINATIONS[0]);
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
    }, 120);
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
    }, 120);
    return () => clearTimeout(timer);
  }, [customDestQuery]);

  // Auto-calculate route whenever origin or destination changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchRoute = async () => {
      setIsCalculating(true);
      try {
        const result = await calculateRouteDistance(
          { lat: selectedOrigin.lat, lon: selectedOrigin.lon },
          { lat: selectedDest.lat, lon: selectedDest.lon }
        );
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
          name: '📍 My Live Location (GPS)',
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
    }, 500);
  };

  // Share route summary on WhatsApp
  const handleShareRoute = () => {
    triggerHaptic(15);
    const text = `🗺️ *Munnar Road Trip & Fuel Strategy*\n\n` +
      `🚗 *Route:* ${selectedOrigin.name} ➔ ${selectedDest.name}\n` +
      `📏 *Total Distance:* ${totalCalculatedKm} KM (${isRoundTrip ? 'Round Trip' : 'One-Way'})\n` +
      `⏱️ *Driving Duration:* ${routeResult?.durationText || 'Calculating...'}\n` +
      `⛽ *Estimated Petrol:* ~${intelligence.fuelLiters} Liters (~₹${intelligence.estimatedFuelCost.toLocaleString('en-IN')})\n` +
      `⛽ *Last 24/7 Bunk:* ${intelligence.fuelPump}\n` +
      `🏔️ *Hairpin Bends:* ${intelligence.hairpins} Curves (${intelligence.elevation})\n` +
      `🛣️ *Highway:* ${intelligence.highway}\n\n` +
      `Plan & calculate exact trip petrol split on: https://munnartools.vercel.app`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const googleMapsUrl = getGoogleMapsNavigationUrl(selectedOrigin, selectedDest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-4 sm:p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Smart Highway & Mountain Intelligence</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
              Fuel Strategy • Petrol Bunks • Ghat Road Advisory
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>🗺️ Route Finder & Travel Intelligence</span>
          </h2>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TOP ROUTE SELECTORS: ORIGIN & DESTINATION WITH INSTANT AUTOCOMPLETE */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* 1. Departure Box */}
              <div ref={originBoxRef} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>1. Departure City</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isGpsLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors active:scale-95"
                  >
                    <LocateFixed className="w-3 h-3" />
                    <span>{isGpsLoading ? 'Getting GPS...' : 'My Live GPS'}</span>
                  </button>
                </div>

                {/* Instant Autocomplete Search Input */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={customOriginQuery}
                      onChange={(e) => {
                        isSelectingOriginRef.current = false;
                        setCustomOriginQuery(e.target.value);
                      }}
                      onFocus={() => { 
                        if (originSuggestions.length > 0) setShowOriginDropdown(true); 
                      }}
                      placeholder="Type ANY city (e.g. Coimbatore, Salem, Kochi)..."
                      className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs font-medium"
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
                        className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showOriginDropdown && originSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-52 overflow-y-auto custom-scrollbar p-1">
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
                              state: item.state,
                              lat: item.lat,
                              lon: item.lon,
                              highway: 'Highway Route Corridor',
                              elevationGain: '+1,540m Mountain Ascent',
                              hairpinBends: 16,
                              lastFuelStop: 'Highway Fuel Pump',
                              tolls: 'FASTag Tolls'
                            });
                            setCustomOriginQuery(item.name);
                            setShowOriginDropdown(false);
                            setOriginSuggestions([]);
                          }}
                          className="w-full text-left p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{item.shortName}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">({item.state})</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Departure Quick Chips */}
                <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1 pt-1">
                  {POPULAR_ORIGINS.slice(0, 6).map((orig) => {
                    const isSelected = selectedOrigin.id === orig.id;
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
                        className={`p-1.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{orig.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium ml-1">({orig.state})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Destination Box */}
              <div ref={destBoxRef} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>2. Destination City / Place</span>
                  </label>
                  {selectedDest.altitude && (
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      {selectedDest.altitude}
                    </span>
                  )}
                </div>

                {/* Instant Autocomplete Search Input */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={customDestQuery}
                      onChange={(e) => {
                        isSelectingDestRef.current = false;
                        setCustomDestQuery(e.target.value);
                      }}
                      onFocus={() => { 
                        if (destSuggestions.length > 0) setShowDestDropdown(true); 
                      }}
                      placeholder="Type ANY destination (e.g. Ooty, Goa, Wayanad)..."
                      className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs font-medium"
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
                        className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showDestDropdown && destSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-52 overflow-y-auto custom-scrollbar p-1">
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
                              lat: item.lat,
                              lon: item.lon,
                              altitude: item.tag,
                              attractions: 'Selected Destination'
                            });
                            setCustomDestQuery(item.name);
                            setShowDestDropdown(false);
                            setDestSuggestions([]);
                          }}
                          className="w-full text-left p-2 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-xl transition-colors flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{item.shortName}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">({item.state})</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                            {item.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Destination Quick Chips */}
                <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1 pt-1">
                  {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => {
                    const isSelected = selectedDest.id === dest.id;
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
                        className={`p-1.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{dest.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapLocations}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
                title="Swap Departure & Destination"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Swap Departure ⇄ Destination</span>
              </button>
            </div>
          </div>

          {/* PRIMARY DISTANCE & DURATION HERO CARD */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5" />
                  <span>Calculated Highway Distance</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {isCalculating ? '...' : totalCalculatedKm}
                  </span>
                  <span className="text-lg font-bold text-emerald-300">KM</span>
                  <span className="text-xs text-slate-300 ml-2">
                    {isRoundTrip ? '(Round Trip 2×)' : '(One-Way)'}
                  </span>
                </div>
              </div>

              {/* Trip Type Toggle (One-Way vs Round Trip) */}
              <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-2xl self-start sm:self-auto border border-white/10">
                <button
                  type="button"
                  onClick={() => { triggerHaptic(10); setIsRoundTrip(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    !isRoundTrip ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  One-Way
                </button>
                <button
                  type="button"
                  onClick={() => { triggerHaptic(10); setIsRoundTrip(true); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isRoundTrip ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Round Trip (2×)
                </button>
              </div>
            </div>

            {/* Sub stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/15 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Driving Time</div>
                  <div className="font-bold text-white">{routeResult?.durationText || '~Calculating...'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-300 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Highway Route</div>
                  <div className="font-bold text-white truncate">{intelligence.highway.split(' ')[0] || 'State Highway'}</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Elevation Profile</div>
                  <div className="font-bold text-white">{intelligence.elevation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 PREMIUM ROAD & TRAVEL INTELLIGENCE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* CARD 1: ⛽ PETROL BUNK & FUEL STRATEGY (CRITICAL USER FEATURE) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  <Fuel className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>⛽ Petrol Bunk Strategy & Fuel Estimates</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Critical Advice
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-500/20 space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-amber-500">📍</span>
                  <span>Last 24/7 Fuel Pump:</span>
                  <span className="text-amber-700 dark:text-amber-300 font-black">{intelligence.fuelPump}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  💡 <b>Pro Tip:</b> Hill station petrol bunks inside Munnar close early by <b>8:00 PM</b> and suffer long queues on weekends. Always fill a <b>FULL TANK</b> at the foothills before entering ghat roads!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-500/20">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Estimated Fuel</div>
                  <div className="text-sm font-black text-amber-700 dark:text-amber-300">~{intelligence.fuelLiters} Liters</div>
                  <div className="text-[10px] text-slate-400">(at 14 km/L avg)</div>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-500/20">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Est. Fuel Cost</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{intelligence.estimatedFuelCost.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">(at ₹{intelligence.avgFuelPrice}/L)</div>
                </div>
              </div>
            </div>

            {/* CARD 2: 🏔️ GHAT ROAD & HAIRPIN BENDS ADVISORY */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                  <Mountain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>🏔️ Ghat Road & Hairpins Guide</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  {intelligence.hairpins} Hairpins
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Hairpin Curves Count:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{intelligence.hairpins} Sharp Curves</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Elevation Climb:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{intelligence.elevation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    ⚠️ <b>Fog & Gear Advisory:</b> Heavy mist after 5:00 PM. Use <b>2nd/3rd gear engine braking</b> on steep descents to prevent brake overheating.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: 🚧 TOLL PLAZAS & BEST DEPARTURE WINDOW */}
            <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                  <Milestone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>🚧 Tolls & Best Timing</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  FASTag Ready
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-500/20">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Expected Tolls:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{intelligence.tolls}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-500/20">
                  <div className="font-bold text-blue-700 dark:text-blue-300 text-[11px] mb-0.5">Recommended Departure Window:</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    ⏰ <b>{intelligence.bestTravelWindow}</b> — Avoids heavy commercial truck traffic in the plains and reaches the hill roads before afternoon fog sets in.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 4: ☕ SCENIC PITSTOPS & MUST-SEE SPOTS */}
            <div className="p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                  <Coffee className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>☕ Recommended Highway Pitstops</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-800 dark:text-purple-300">
                  Scenic Breaks
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-purple-500/20 space-y-1">
                  <div className="font-bold text-purple-700 dark:text-purple-300 text-[11px]">🌊 Waterfall & Tea Breaks:</div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 list-disc pl-4">
                    <li><b>Cheeyappara Waterfalls:</b> Fresh banana fritters & hot tea stalls right on NH 85.</li>
                    <li><b>Valara Waterfalls:</b> Lush forest river cascade photo stop.</li>
                    <li><b>Karadippara Viewpoint:</b> First panoramic view of the Munnar mountain range.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* QUICK SUMMARY ADVISORY BANNER */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full route distance is ready. Click below to apply directly to the Fuel Calculator or navigate via Google Maps!</span>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold border border-slate-200 dark:border-slate-600 shadow-xs hover:bg-slate-50 transition-colors active:scale-95 self-start sm:self-auto shrink-0"
            >
              <span>Google Maps Navigation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <button
            type="button"
            onClick={handleShareRoute}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share Route on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isCalculating || totalCalculatedKm <= 0}
              className="w-2/3 sm:w-auto flex-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {appliedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Applied to Calculator! ✓</span>
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
