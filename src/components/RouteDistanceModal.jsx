import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass, 
  ArrowRight, 
  RotateCw, 
  Check, 
  Sparkles, 
  LocateFixed, 
  Mountain, 
  Clock, 
  Route, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  POPULAR_ORIGINS, 
  POPULAR_DESTINATIONS, 
  calculateRouteDistance, 
  geocodeLocation 
} from '../services/routingService';
import { triggerHaptic } from '../utils/haptics';

export default function RouteDistanceModal({ isOpen, onClose, onApplyDistance }) {
  const [selectedOrigin, setSelectedOrigin] = useState(POPULAR_ORIGINS[0]);
  const [selectedDest, setSelectedDest] = useState(POPULAR_DESTINATIONS[0]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  const [customOriginQuery, setCustomOriginQuery] = useState('');
  const [isSearchingCustom, setIsSearchingCustom] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const [routeResult, setRouteResult] = useState(null);
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  // Auto-calculate route whenever origin, destination, or roundtrip changes
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

  const totalCalculatedKm = routeResult 
    ? (isRoundTrip ? routeResult.distanceKm * 2 : routeResult.distanceKm) 
    : 0;

  // Handle GPS location
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
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setSelectedOrigin(userLoc);
        triggerHaptic(20);
      },
      (err) => {
        setIsGpsLoading(false);
        alert('Could not get GPS location. Please check location permissions.');
      },
      { timeout: 8000 }
    );
  };

  // Handle custom origin search
  const handleSearchCustomOrigin = async (e) => {
    e.preventDefault();
    if (!customOriginQuery.trim()) return;

    setIsSearchingCustom(true);
    triggerHaptic(10);
    const loc = await geocodeLocation(customOriginQuery);
    setIsSearchingCustom(false);

    if (loc) {
      setSelectedOrigin({
        id: 'custom_' + Date.now(),
        name: loc.name,
        lat: loc.lat,
        lon: loc.lon
      });
      setCustomOriginQuery('');
      triggerHaptic(20);
    } else {
      alert(`Could not find "${customOriginQuery}". Try typing city name (e.g. Coimbatore, Salem, Kochi).`);
    }
  };

  const handleApply = () => {
    triggerHaptic(25);
    onApplyDistance(totalCalculatedKm);
    setAppliedFeedback(true);
    setTimeout(() => {
      setAppliedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              OpenStreetMap & OSRM Engine (100% Free)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>🗺️ Smart Route & Distance Calculator</span>
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Auto-calculates driving road distance and mountain travel times to Munnar viewpoints.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Step 1: Starting Location (Origin) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>1. Starting From (Departure City)</span>
              </label>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isGpsLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors active:scale-95"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>{isGpsLoading ? 'Getting GPS...' : 'Use My Live GPS'}</span>
              </button>
            </div>

            {/* Origin Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_ORIGINS.map((orig) => {
                const isSelected = selectedOrigin.id === orig.id;
                return (
                  <button
                    key={orig.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setSelectedOrigin(orig);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{orig.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {/* Custom City Search Bar */}
            <form onSubmit={handleSearchCustomOrigin} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customOriginQuery}
                onChange={(e) => setCustomOriginQuery(e.target.value)}
                placeholder="Or type any custom town (e.g. Ooty, Erode, Alappuzha)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSearchingCustom}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all shrink-0 active:scale-95"
              >
                {isSearchingCustom ? 'Searching...' : 'Find City'}
              </button>
            </form>
          </div>

          {/* Step 2: Destination in Munnar */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>2. Destination (Munnar Spot)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_DESTINATIONS.map((dest) => {
                const isSelected = selectedDest.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setSelectedDest(dest);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{dest.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Journey Type Toggle (One-Way vs Round-Trip) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Round-Trip Return Journey?</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Doubles calculated distance for return ride (2x KM)</p>
            </div>

            <div
              onClick={() => {
                triggerHaptic(15);
                setIsRoundTrip(!isRoundTrip);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isRoundTrip ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isRoundTrip ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>

          {/* Calculation Display Result Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Route className="w-4 h-4" />
                <span>Calculated Road Route</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold">
                {isRoundTrip ? '🔄 Round Trip (2x)' : '➡️ One-Way'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {isCalculating ? (
                    <span className="text-2xl text-slate-400 animate-pulse">Calculating route...</span>
                  ) : (
                    <>{totalCalculatedKm} <span className="text-lg font-bold text-emerald-400">KM</span></>
                  )}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>{selectedOrigin.name}</strong> ➔ <strong>{selectedDest.name}</strong>
                </p>
              </div>

              {routeResult && (
                <div className="sm:text-right space-y-0.5">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs text-teal-300 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Drive: {isRoundTrip ? `2 × ${routeResult.durationText}` : routeResult.durationText}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{routeResult.source}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={totalCalculatedKm <= 0}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {appliedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied {totalCalculatedKm} KM!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>⚡ Apply {totalCalculatedKm} KM to Calculator</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
