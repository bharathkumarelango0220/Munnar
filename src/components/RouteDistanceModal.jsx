import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass, 
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
  Layers, 
  Maximize2, 
  ArrowUpDown, 
  Lock, 
  Unlock, 
  ZoomIn, 
  ZoomOut, 
  Hand, 
  Download, 
  Radio, 
  Search, 
  Wifi, 
  WifiOff, 
  Gauge, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  POPULAR_ORIGINS, 
  POPULAR_DESTINATIONS, 
  searchCitiesHybrid, 
  calculateRouteDistance, 
  checkOffCourseAndReroute,
  saveRouteOffline,
  getOfflineSavedRoute,
  getGoogleMapsNavigationUrl
} from '../services/routingService';
import { triggerHaptic } from '../utils/haptics';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteDistanceModal({ isOpen, onClose, onApplyDistance }) {
  const [selectedOrigin, setSelectedOrigin] = useState(POPULAR_ORIGINS[0]);
  const [selectedDest, setSelectedDest] = useState(POPULAR_DESTINATIONS[0]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  // Origin search & autocomplete suggestions
  const [customOriginQuery, setCustomOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);

  // Destination search & autocomplete suggestions
  const [customDestQuery, setCustomDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [appliedFeedback, setAppliedFeedback] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('map'); // 'map' | 'details' | 'live'
  const [isMapInteractActive, setIsMapInteractActive] = useState(false);
  const [mapStyle, setMapStyle] = useState('voyager'); // 'voyager' | 'satellite' | 'topo'

  // Live GPS Tracking & Off-course states
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // { lat, lon, speed, heading, accuracy }
  const [offCourseData, setOffCourseData] = useState(null); // { isOffCourse, minDistanceMeters, rerouteCoordinates }
  const [isRouteSavedOffline, setIsRouteSavedOffline] = useState(false);

  // Leaflet map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userGpsMarkerRef = useRef(null);
  const rerouteLayerRef = useRef(null);
  const watchPositionIdRef = useRef(null);

  // Initialize and Maintain Leaflet Map Instance
  useEffect(() => {
    if (!isOpen) return;

    const initTimer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        try {
          const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false
          }).setView([10.0889, 77.0595], 8);

          // Ultra-Fast, Colorful, High-Contrast CartoDB Voyager Tiles (No CORS issues, 100% reliable)
          tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
          }).addTo(map);

          polylineLayerRef.current = L.layerGroup().addTo(map);
          rerouteLayerRef.current = L.layerGroup().addTo(map);
          markersLayerRef.current = L.layerGroup().addTo(map);
          userGpsMarkerRef.current = L.layerGroup().addTo(map);
          mapInstanceRef.current = map;
        } catch (e) {
          console.warn('[Leaflet] Map init error:', e);
        }
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(initTimer);
    };
  }, [isOpen]);

  // Handle Map Style Switch (Voyager / Satellite / Topo)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let opts = { maxZoom: 19, subdomains: 'abcd' };

    if (mapStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      opts = { maxZoom: 19 };
    } else if (mapStyle === 'topo') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      opts = { maxZoom: 19 };
    }

    tileLayerRef.current = L.tileLayer(url, opts).addTo(map);

    // Keep layers on top
    polylineLayerRef.current?.bringToFront();
    rerouteLayerRef.current?.bringToFront();
    markersLayerRef.current?.bringToFront();
    userGpsMarkerRef.current?.bringToFront();
  }, [mapStyle]);

  // Sync interactive map panning mode with immediate tile repaint
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (isMapInteractActive) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
    }
    
    // Invalidate size to guarantee smooth tile rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 50);
  }, [isMapInteractActive]);

  // Handle Tab Switch Invalidate Size
  useEffect(() => {
    if (activeViewTab === 'map' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [activeViewTab]);

  // Clean up Leaflet and GPS on modal close
  useEffect(() => {
    if (!isOpen) {
      if (watchPositionIdRef.current) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      setIsLiveTracking(false);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        polylineLayerRef.current = null;
        rerouteLayerRef.current = null;
        markersLayerRef.current = null;
        userGpsMarkerRef.current = null;
      }
    }
  }, [isOpen]);

  // Origin Search Suggestions Debounce
  useEffect(() => {
    if (!customOriginQuery.trim() || customOriginQuery.length < 1) {
      setOriginSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingOrigin(true);
      const results = await searchCitiesHybrid(customOriginQuery);
      setOriginSuggestions(results);
      setIsSearchingOrigin(false);
      setShowOriginDropdown(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [customOriginQuery]);

  // Destination Search Suggestions Debounce
  useEffect(() => {
    if (!customDestQuery.trim() || customDestQuery.length < 1) {
      setDestSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingDest(true);
      const results = await searchCitiesHybrid(customDestQuery);
      setDestSuggestions(results);
      setIsSearchingDest(false);
      setShowDestDropdown(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [customDestQuery]);

  // Draw Route Polyline & Markers on Map
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !routeResult) return;

    const map = mapInstanceRef.current;
    if (polylineLayerRef.current) polylineLayerRef.current.clearLayers();
    if (markersLayerRef.current) markersLayerRef.current.clearLayers();

    const coords = routeResult.coordinates;

    if (coords && coords.length > 0) {
      try {
        // 1. Draw glowing green road polyline
        const polyline = L.polyline(coords, {
          color: '#059669', // vibrant emerald-600
          weight: 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(polylineLayerRef.current);

        // 2. Custom Start Marker Icon (A)
        const startIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color: #047857; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.35);">A</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        // 3. Custom Destination Marker Icon (B)
        const destIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color: #0f766e; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px; border: 2.5px solid white; box-shadow: 0 4px 16px rgba(0,0,0,0.45);">🏔️</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        L.marker([selectedOrigin.lat, selectedOrigin.lon], { icon: startIcon })
          .bindPopup(`<b>Starting Point:</b><br/>${selectedOrigin.name}`)
          .addTo(markersLayerRef.current);

        L.marker([selectedDest.lat, selectedDest.lon], { icon: destIcon })
          .bindPopup(`<b>Destination:</b><br/>${selectedDest.name}`)
          .addTo(markersLayerRef.current);

        // Fit map bounds to show full road route
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } catch (err) {
        console.warn('[Leaflet] Layer draw error:', err);
      }
    }
  }, [routeResult, isOpen, selectedOrigin, selectedDest]);

  // Auto-calculate route whenever origin, destination changes
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

  // Live GPS Tracking & Real-Time Off-Course Rerouting
  const handleToggleLiveTracking = () => {
    triggerHaptic(20);
    if (isLiveTracking) {
      if (watchPositionIdRef.current) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      setIsLiveTracking(false);
      setUserLocation(null);
      setOffCourseData(null);
      if (userGpsMarkerRef.current) userGpsMarkerRef.current.clearLayers();
      if (rerouteLayerRef.current) rerouteLayerRef.current.clearLayers();
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      setIsLiveTracking(true);
      watchPositionIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0; // km/h
          const heading = pos.coords.heading || 0;
          const accuracy = Math.round(pos.coords.accuracy || 0);

          setUserLocation({ lat, lon, speed, heading, accuracy });

          // Draw Live User Location on Map
          if (mapInstanceRef.current && userGpsMarkerRef.current) {
            userGpsMarkerRef.current.clearLayers();

            const pulseIcon = L.divIcon({
              className: 'custom-leaflet-marker',
              html: `<div class="user-gps-pulse-marker"><div class="gps-dot"></div></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            L.marker([lat, lon], { icon: pulseIcon })
              .bindPopup(`<b>Your Live Position</b><br/>Speed: ${speed} km/h<br/>Accuracy: ±${accuracy}m`)
              .addTo(userGpsMarkerRef.current);
          }

          // Check if User went Off-Course & Calculate Dynamic Offline Reroute
          if (routeResult?.coordinates) {
            const check = checkOffCourseAndReroute(
              lat, 
              lon, 
              routeResult.coordinates, 
              { lat: selectedDest.lat, lon: selectedDest.lon }
            );

            setOffCourseData(check);

            // If off course, draw high-visibility dashed re-route connector on map
            if (rerouteLayerRef.current) {
              rerouteLayerRef.current.clearLayers();
              if (check.isOffCourse && check.rerouteCoordinates) {
                L.polyline(check.rerouteCoordinates, {
                  color: '#f59e0b', // amber-500
                  weight: 5,
                  dashArray: '8, 8',
                  opacity: 0.95
                }).addTo(rerouteLayerRef.current);
              }
            }
          }
        },
        (err) => {
          console.warn('GPS watch error:', err);
          setIsLiveTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
    }
  };

  // Save Route for Offline Use
  const handleSaveRouteOffline = () => {
    triggerHaptic(20);
    if (!routeResult) return;
    const success = saveRouteOffline({
      origin: selectedOrigin,
      destination: selectedDest,
      distanceKm: totalCalculatedKm,
      isRoundTrip,
      durationText: routeResult.durationText,
      coordinates: routeResult.coordinates,
      steps: routeResult.steps
    });
    if (success) {
      setIsRouteSavedOffline(true);
      setTimeout(() => setIsRouteSavedOffline(false), 3000);
    }
  };

  if (!isOpen) return null;

  const totalCalculatedKm = routeResult 
    ? (isRoundTrip ? routeResult.distanceKm * 2 : routeResult.distanceKm) 
    : 0;

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
          highway: 'Direct GPS Point to Mountain Corridor',
          elevationGain: '+1,500m Climb',
          hairpinBends: 16,
          lastFuelStop: 'Nearest Highway Fuel Pump',
          tolls: 'Varies by route'
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

  // Swap Departure & Destination
  const handleSwapLocations = () => {
    triggerHaptic(15);
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDest);
    setSelectedDest(temp);
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

  // Share route summary on WhatsApp
  const handleShareRoute = () => {
    triggerHaptic(15);
    const text = `🗺️ *Munnar Road Trip Route Plan*\n\n` +
      `🚗 *Route:* ${selectedOrigin.name} ➔ ${selectedDest.name}\n` +
      `📏 *Total Distance:* ${totalCalculatedKm} KM (${isRoundTrip ? 'Round Trip' : 'One-Way'})\n` +
      `⏱️ *Driving Duration:* ${routeResult?.durationText || 'N/A'}\n` +
      `🛣️ *Highway:* ${selectedOrigin.highway || 'Mountain Corridor'}\n` +
      `🏔️ *Elevation Gain:* ${selectedOrigin.elevationGain || '+1,500m'}\n` +
      `⛽ *Last Fuel Stop:* ${selectedOrigin.lastFuelStop || 'Town Bunk'}\n\n` +
      `Plan & calculate exact trip petrol split on: https://munnartools.vercel.app`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRecenterMap = () => {
    triggerHaptic(10);
    if (mapInstanceRef.current && routeResult?.coordinates) {
      const bounds = L.latLngBounds(routeResult.coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  const handleZoomIn = () => {
    triggerHaptic(10);
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    triggerHaptic(10);
    mapInstanceRef.current?.zoomOut();
  };

  const googleMapsUrl = getGoogleMapsNavigationUrl(selectedOrigin, selectedDest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp flex flex-col max-h-[94vh]">
        
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
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Offline-First Live GPS Engine</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
              OpenStreetMap & OSRM Mountain Topology
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mr-8">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>🗺️ Smart Route & Mountain Distance Suite</span>
            </h2>

            {/* Sub Nav Toggle */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveViewTab('map')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeViewTab === 'map' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Vibrant Map</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewTab('details')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeViewTab === 'details' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Ghat Road Insights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TOP ROUTE SELECTORS: ORIGIN & DESTINATION WITH INSTANT AUTOCOMPLETE */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Departure Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 relative">
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
                      onChange={(e) => setCustomOriginQuery(e.target.value)}
                      onFocus={() => { if (originSuggestions.length > 0) setShowOriginDropdown(true); }}
                      placeholder="Type ANY city name (e.g. Coimbatore, Salem, Kochi)..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showOriginDropdown && originSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-40 max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {originSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic(10);
                            setSelectedOrigin({
                              id: item.id,
                              name: item.name,
                              state: item.state,
                              lat: item.lat,
                              lon: item.lon,
                              highway: 'Highway Route Corridor',
                              elevationGain: '+1,500m Climb',
                              hairpinBends: 16,
                              lastFuelStop: 'Highway Fuel Pump',
                              tolls: 'Estimated'
                            });
                            setCustomOriginQuery(item.name);
                            setShowOriginDropdown(false);
                          }}
                          className="w-full text-left p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{item.shortName}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 ml-1.5">({item.state})</span>
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
                <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto custom-scrollbar pr-1 pt-1">
                  {POPULAR_ORIGINS.slice(0, 6).map((orig) => {
                    const isSelected = selectedOrigin.id === orig.id;
                    return (
                      <button
                        key={orig.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          setSelectedOrigin(orig);
                          setCustomOriginQuery(orig.name);
                          setShowOriginDropdown(false);
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

              {/* Destination Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 relative">
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
                      onChange={(e) => setCustomDestQuery(e.target.value)}
                      onFocus={() => { if (destSuggestions.length > 0) setShowDestDropdown(true); }}
                      placeholder="Type ANY destination (e.g. Ooty, Goa, Wayanad)..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showDestDropdown && destSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-40 max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {destSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic(10);
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
                          }}
                          className="w-full text-left p-2 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-xl transition-colors flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{item.shortName}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 ml-1.5">({item.state})</span>
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
                <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto custom-scrollbar pr-1 pt-1">
                  {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => {
                    const isSelected = selectedDest.id === dest.id;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          setSelectedDest(dest);
                          setCustomDestQuery(dest.name);
                          setShowDestDropdown(false);
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
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
                title="Swap Departure & Destination"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Swap Departure ⇄ Destination</span>
              </button>
            </div>
          </div>

          {/* TAB 1: VIBRANT INTERACTIVE MAP VIEW CONTAINER */}
          <div className={activeViewTab === 'map' ? 'space-y-2 block' : 'hidden'}>
            
            {/* Live Tracking & Off-Course Real-Time Status Alerts */}
            {isLiveTracking && offCourseData && (
              <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                offCourseData.isOffCourse 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200' 
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {offCourseData.isOffCourse ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
                      <span>⚠️ Off-Course ({offCourseData.minDistanceMeters}m off). Re-routing connecting vector active!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>🟢 Live on Route (Speed: {userLocation?.speed || 0} km/h • GPS ±{userLocation?.accuracy || 0}m)</span>
                    </>
                  )}
                </div>
                
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border">
                  Live GPS
                </span>
              </div>
            )}

            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
              {/* Map Container - Bright, vibrant, clean */}
              <div 
                ref={mapContainerRef} 
                className="w-full h-72 sm:h-80 bg-slate-100 dark:bg-slate-800 relative z-10"
              />

              {/* Floating Map Legend Overlay */}
              <div className="absolute top-3 left-3 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md text-[11px] font-bold flex items-center gap-2 shadow-lg max-w-[55%] truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                <span className="truncate">{selectedOrigin.name} ➔ {selectedDest.name}</span>
              </div>

              {/* Top-Right Action Badges: Live GPS + Lock/Unlock Map */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleLiveTracking}
                  className={`px-3 py-1.5 rounded-xl border shadow-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isLiveTracking
                      ? 'bg-blue-600 border-blue-400 text-white shadow-blue-600/40 animate-pulse'
                      : 'bg-slate-900/90 hover:bg-slate-900 text-white border-white/20 backdrop-blur-md'
                  }`}
                  title="Toggle Live GPS Tracking with Automatic Re-routing"
                >
                  <Radio className="w-3.5 h-3.5 text-blue-300" />
                  <span>{isLiveTracking ? 'Tracking Live' : '🛰️ Live GPS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setIsMapInteractActive(!isMapInteractActive);
                  }}
                  className={`px-3 py-1.5 rounded-xl border shadow-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isMapInteractActive
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30'
                      : 'bg-slate-900/90 hover:bg-slate-900 text-white border-white/20 backdrop-blur-md'
                  }`}
                >
                  {isMapInteractActive ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Lock</span>
                    </>
                  ) : (
                    <>
                      <Hand className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pan & Zoom</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Control Bar: Fit Route + Map Style Switcher + Dedicated Zoom Buttons */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-1.5">
                  {/* Re-center Button */}
                  <button
                    type="button"
                    onClick={handleRecenterMap}
                    className="bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors active:scale-95"
                    title="Fit Route to Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Fit Route</span>
                  </button>

                  {/* Map Style Switcher */}
                  <div className="flex items-center bg-white/95 dark:bg-slate-800/95 p-0.5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => { triggerHaptic(10); setMapStyle('voyager'); }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        mapStyle === 'voyager' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Roads
                    </button>
                    <button
                      type="button"
                      onClick={() => { triggerHaptic(10); setMapStyle('satellite'); }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        mapStyle === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Satellite
                    </button>
                    <button
                      type="button"
                      onClick={() => { triggerHaptic(10); setMapStyle('topo'); }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        mapStyle === 'topo' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Topo
                    </button>
                  </div>
                </div>

                {/* Explicit Zoom Buttons */}
                <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 p-1 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-90"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-90"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>
              </div>

            </div>

            {/* Scroll Hint & Offline Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                💡 {isMapInteractActive ? 'Map active: drag/pinch to move. Tap "Lock" to scroll page.' : 'Scroll page freely. Tap "Pan & Zoom" or use +/- to inspect.'}
              </p>

              <button
                type="button"
                onClick={handleSaveRouteOffline}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors active:scale-95 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isRouteSavedOffline ? '✓ Saved Offline!' : '📥 Save Route for Offline GPS'}</span>
              </button>
            </div>

          </div>

          {/* TAB 2: GHAT ROAD & MOUNTAIN INCLINE ANALYSIS */}
          {activeViewTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Mountain className="w-4 h-4 text-emerald-600" />
                  <span>Altitude Climb</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {selectedOrigin.elevationGain || '+1,500m'}
                </p>
                <span className="text-[11px] text-slate-500">From plains to High Range</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Milestone className="w-4 h-4 text-teal-600" />
                  <span>Hairpin Bends</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {selectedOrigin.hairpinBends || 16} Mountain Hairpins
                </p>
                <span className="text-[11px] text-slate-500">Use 2nd/3rd gear on slopes</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Estimated Tolls</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {selectedOrigin.tolls || '₹0'}
                </p>
                <span className="text-[11px] text-slate-500">Along highway corridor</span>
              </div>

              {/* Crucial Ghat Road Fuel Advisory */}
              <div className="sm:col-span-2 md:col-span-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                  <Fuel className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                    Crucial Ghat Road Fuel Advisory:
                  </h4>
                  <p className="text-xs text-amber-900 dark:text-amber-300 mt-0.5">
                    Last reliable fuel station before steep hill climb: <strong>{selectedOrigin.lastFuelStop || 'Foothill Fuel Bunk'}</strong>. Fill your tank before entering the forest pass!
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Step 3: Journey Type Toggle & Live Calculated Result Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Route className="w-4 h-4" />
                  <span>Calculated Road Corridor</span>
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong>{selectedOrigin.name}</strong> ➔ <strong>{selectedDest.name}</strong>
                </p>
              </div>

              {/* Round Trip Toggle */}
              <div className="flex items-center gap-3 self-start sm:self-auto bg-white/10 px-3 py-1.5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-slate-200">Round Trip (2x KM):</span>
                <div
                  onClick={() => {
                    triggerHaptic(15);
                    setIsRoundTrip(!isRoundTrip);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                    isRoundTrip ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isRoundTrip ? 'translate-x-5' : ''}`}></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {isCalculating ? (
                    <span className="text-2xl text-slate-400 animate-pulse">Calculating road route...</span>
                  ) : (
                    <>{totalCalculatedKm} <span className="text-lg font-bold text-emerald-400">KM</span></>
                  )}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Highway: <strong>{selectedOrigin.highway || 'Direct Mountain Pass'}</strong>
                </p>
              </div>

              {routeResult && (
                <div className="sm:text-right space-y-1">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs text-teal-300 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Drive: {isRoundTrip ? `2 × ${routeResult.durationText}` : routeResult.durationText}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{routeResult.source}</span>
                </div>
              )}
            </div>

            {/* Quick External Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-white/15"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open in Google Maps Navigation</span>
              </a>

              <button
                type="button"
                onClick={handleShareRoute}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-white/15"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Share Route on WhatsApp</span>
              </button>
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
            Close
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
                <span>⚡ Apply {totalCalculatedKm} KM to Fuel Calculator</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
