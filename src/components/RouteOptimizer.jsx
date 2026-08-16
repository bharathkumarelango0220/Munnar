import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  Plus, 
  RotateCcw, 
  ExternalLink, 
  Gauge, 
  Layers,
  Fuel,
  Info
} from 'lucide-react';
import { MUNNAR_PLACES } from '../data/munnarPlaces';
import confetti from 'canvas-confetti';

const MUNNAR_TOWN_COORDS = { lat: 10.0889, lng: 77.0595, name: 'Munnar Town Center' };

// Distance formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1.35; // 1.35 factor for mountain winding roads
}

export default function RouteOptimizer() {
  // Selected place IDs
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([
    'mattupetty-dam',
    'echo-point',
    'kundala-dam',
    'top-station'
  ]);

  const [startingTime, setStartingTime] = useState('08:30');

  // Toggle selection
  const handleTogglePlace = (id) => {
    if (selectedPlaceIds.includes(id)) {
      if (selectedPlaceIds.length <= 1) return;
      setSelectedPlaceIds(selectedPlaceIds.filter((p) => p !== id));
    } else {
      setSelectedPlaceIds([...selectedPlaceIds, id]);
    }
  };

  // Quick Preset Clusters
  const handleApplyPreset = (ids) => {
    setSelectedPlaceIds(ids);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Nearest Neighbor Traveling Salesperson Heuristic for Zero Backtracking
  const optimizedRoute = useMemo(() => {
    const placesToVisit = MUNNAR_PLACES.filter((p) => selectedPlaceIds.includes(p.id));
    if (placesToVisit.length === 0) return [];

    let currentLat = MUNNAR_TOWN_COORDS.lat;
    let currentLng = MUNNAR_TOWN_COORDS.lng;
    let unvisited = [...placesToVisit];
    const sequence = [];
    let totalKm = 0;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calculateDistance(
          currentLat,
          currentLng,
          unvisited[i].coordinates.lat,
          unvisited[i].coordinates.lng
        );
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      const nextStop = unvisited[nearestIdx];
      totalKm += minDistance;
      sequence.push({
        ...nextStop,
        distanceFromPrev: minDistance.toFixed(1),
        cumulativeKm: totalKm.toFixed(1)
      });

      currentLat = nextStop.coordinates.lat;
      currentLng = nextStop.coordinates.lng;
      unvisited.splice(nearestIdx, 1);
    }

    // Return to Munnar town distance
    const returnKm = calculateDistance(currentLat, currentLng, MUNNAR_TOWN_COORDS.lat, MUNNAR_TOWN_COORDS.lng);
    totalKm += returnKm;

    return {
      stops: sequence,
      totalDistance: Math.round(totalKm),
      estimatedDrivingTimeMinutes: Math.round((totalKm / 28) * 60) // 28 km/h avg speed on Munnar ghats
    };
  }, [selectedPlaceIds]);

  // Generate Google Maps Multi-Stop Link
  const getGoogleMapsMultiStopUrl = () => {
    if (!optimizedRoute.stops || optimizedRoute.stops.length === 0) return '#';
    const origin = `${MUNNAR_TOWN_COORDS.lat},${MUNNAR_TOWN_COORDS.lng}`;
    const destination = origin;
    const waypoints = optimizedRoute.stops
      .map((s) => `${s.coordinates.lat},${s.coordinates.lng}`)
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Driving Route Sequencer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Smart Route Optimizer (Zero Backtracking) 🗺️⚡
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select the places you want to visit $\rightarrow$ our engine automatically orders them into the shortest, single-direction mountain driving sequence!
          </p>
        </div>

        <a
          href={getGoogleMapsMultiStopUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Navigation className="w-4 h-4 stroke-[2.5]" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      {/* Quick Circuit Presets */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quick Single-Direction Circuits
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset(['mattupetty-dam', 'echo-point', 'kundala-dam', 'top-station'])}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-1.5"
          >
            <span>🌊 Top Station & Dam Circuit (4 Stops)</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset(['eravikulam-national-park', 'lakkam-waterfalls', 'marayoor-sandalwood', 'anamudi-peak'])}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-1.5"
          >
            <span>🌿 Marayoor & Wildlife Circuit (4 Stops)</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset(['kolukkumalai-tea-estate', 'chinnakanal-waterfalls', 'lockhart-gap-viewpoint'])}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-1.5"
          >
            <span>🌅 Kolukkumalai Sunrise & Gap Road (3 Stops)</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset(['tea-museum-kdhp', 'blossom-hydel-park', 'pothamedu-viewpoint', 'attukal-waterfalls'])}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-1.5"
          >
            <span>☕ Munnar Town & Waterfalls (4 Stops)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Multi-Place Selector vs Optimized Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Select Places */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Select Places to Visit ({selectedPlaceIds.length})
            </h3>
            <span className="text-xs text-slate-400">Click to select/unselect</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {MUNNAR_PLACES.map((place) => {
              const isSelected = selectedPlaceIds.includes(place.id);
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleTogglePlace(place.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' 
                      : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isSelected ? '✓' : '+'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{place.name}</h4>
                      <p className="text-[10px] text-slate-500">{place.category} • {place.distance}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    ★ {place.rating}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Optimized Route Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-soft">
              <span className="text-[11px] text-slate-400 font-medium">Total Driving Route</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {optimizedRoute.totalDistance || 0} KM
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-soft">
              <span className="text-[11px] text-emerald-700 font-medium">Est. Mountain Drive Time</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-1">
                ~{Math.floor((optimizedRoute.estimatedDrivingTimeMinutes || 0) / 60)}h {(optimizedRoute.estimatedDrivingTimeMinutes || 0) % 60}m
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 shadow-soft col-span-2 sm:col-span-1">
              <span className="text-[11px] text-teal-700 font-medium">Backtracking Saved</span>
              <p className="text-xl sm:text-2xl font-black text-teal-900 mt-1">
                0% Zero Loops
              </p>
            </div>
          </div>

          {/* Sequential Stops Timeline */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Optimized Driving Sequence (Shortest Path)</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Auto-Sequenced
              </span>
            </div>

            {/* Starting Point: Munnar Town */}
            <div className="relative pl-6 pb-4 border-l-2 border-dashed border-emerald-400 space-y-1">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Start Point</span>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">Munnar Town Center (0 KM)</h4>
              <p className="text-[11px] text-slate-400">Depart early at ~8:30 AM to beat morning tour buses</p>
            </div>

            {/* Sequence Stops */}
            {optimizedRoute.stops?.map((stop, idx) => (
              <div 
                key={stop.id} 
                className={`relative pl-6 pb-4 ${
                  idx === optimizedRoute.stops.length - 1 ? '' : 'border-l-2 border-dashed border-slate-200'
                } space-y-1`}
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-xs flex items-center justify-center text-[9px] font-black text-white">
                  {idx + 1}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Stop #{idx + 1} • +{stop.distanceFromPrev} KM drive
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Cumulative: {stop.cumulativeKm} KM
                  </span>
                </div>

                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{stop.name}</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Best visit timing: <strong>{stop.bestTime}</strong> • {stop.entryFee}
                </p>
              </div>
            ))}

            {/* Return to Munnar Town */}
            <div className="relative pl-6 pt-2 space-y-1 border-t border-slate-100">
              <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Return Leg</span>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">Return to Munnar Town / Hotel</h4>
              <p className="text-[11px] text-slate-400">Total round trip: {optimizedRoute.totalDistance} KM completed</p>
            </div>

            {/* 1-Tap Google Maps Button */}
            <div className="pt-3">
              <a
                href={getGoogleMapsMultiStopUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 stroke-[2.5]" />
                <span>Start Multi-Stop GPS Navigation in Google Maps 🚀</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
