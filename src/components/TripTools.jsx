import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CloudRain, 
  Thermometer, 
  Sun, 
  MapPin, 
  CheckSquare, 
  Square, 
  PhoneCall, 
  ShieldAlert, 
  Clock, 
  Navigation, 
  Check, 
  Sparkles 
} from 'lucide-react';

const PACKING_ITEMS = [
  { id: 'p1', label: 'Warm jacket or fleece sweater (10°C-18°C evening mist)' },
  { id: 'p2', label: 'Raincoat or compact umbrella (frequent sudden hill showers)' },
  { id: 'p3', label: 'Comfortable trekking shoes / grip sneakers for damp slopes' },
  { id: 'p4', label: 'Government ID card (original Aadhar/Driving license for national park & hotel check-ins)' },
  { id: 'p5', label: 'Power bank & phone camera with ample storage' },
  { id: 'p6', label: 'Motion sickness tablets (for Ghat roads & hairpin bends)' },
  { id: 'p7', label: 'Cash currency (several remote viewpoint spice & tea stalls have weak network/UPI)' },
  { id: 'p8', label: 'Thermos flask for hot mountain tea/water' },
  { id: 'p9', label: 'Insect repellent & moisturizing cream' }
];

export default function TripTools() {
  const [activeDay, setActiveDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('munnar_packing');
    return saved ? JSON.parse(saved) : ['p1', 'p4', 'p5'];
  });

  useEffect(() => {
    localStorage.setItem('munnar_packing', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const itineraries = {
    1: {
      title: 'Day 1: Classic Mattupetty & Top Station Cloud Circuit',
      timing: '8:30 AM - 6:30 PM (Approx 70 km round trip)',
      stops: [
        { time: '09:00 AM', place: 'KDHP Tea Museum', note: 'Factory history & orthodox tea tasting (2 hrs)' },
        { time: '11:30 AM', place: 'Photo Point & Honey Bee Tree', note: 'Quick tea estate photos (30 mins)' },
        { time: '01:00 PM', place: 'Mattupetty Dam & Lake', note: 'Speed boating & Kerala lunch (2 hrs)' },
        { time: '03:30 PM', place: 'Kundala Arch Dam & Lake', note: 'Kashmiri Shikara boat ride (1 hr)' },
        { time: '05:00 PM', place: 'Top Station Sunset & Valley View', note: 'Panoramic cloud inversions & valley breeze (1.5 hrs)' }
      ]
    },
    2: {
      title: 'Day 2: Kolukkumalai Sunrise & Nilgiri Tahr Wildlife',
      timing: '4:30 AM - 6:00 PM (Off-road jeep + Eco safari)',
      stops: [
        { time: '04:30 AM', place: 'Kolukkumalai Sunrise 4x4 Jeep Safari', note: 'Start from Suryanelli base for world highest tea sunrise' },
        { time: '08:30 AM', place: 'Kolukkumalai Tea Factory Tour', note: 'Hot wood-fired black tea tasting' },
        { time: '11:00 AM', place: 'Return to Munnar & Rest', note: 'Relaxing brunch at Munnar town' },
        { time: '02:00 PM', place: 'Eravikulam National Park (Rajamalai)', note: 'Spotting Nilgiri Tahr mountain goats & Anamudi views' },
        { time: '05:30 PM', place: 'Pothamedu Viewpoint', note: 'Golden hour sunset over tea hills' }
      ]
    },
    3: {
      title: 'Day 3: Waterfalls, Sandalwood & Forest Delights',
      timing: '9:00 AM - 5:00 PM (Marayoor highway)',
      stops: [
        { time: '09:30 AM', place: 'Attukal Waterfalls', note: 'Cascading roaring mountain falls' },
        { time: '11:30 AM', place: 'Lakkam Waterfalls', note: 'Refreshing crystal-clear natural rock pool dip' },
        { time: '01:30 PM', place: 'Marayoor Sandalwood Forests & Dolmens', note: 'Historic stone age Muniyara & fresh jaggery making' },
        { time: '04:30 PM', place: 'Blossom Hydel Park & Spice Shopping', note: 'Evening stroll and buying authentic Kerala spices' }
      ]
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Travel Assistance & Planning</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Munnar Itinerary, Weather & Travel Essentials
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Curated 3-day plans, live climate guide, packing checklist, and 24x7 emergency contacts.
        </p>
      </div>

      {/* 1. Suggested 3-Day Itinerary */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Suggested 3-Day Munnar Road Trip Route
            </h3>
            <p className="text-xs text-slate-500">Optimized to minimize driving time and maximize scenery</p>
          </div>

          {/* Day selection tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDay === day
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Content */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="font-black text-sm text-emerald-950">{itineraries[activeDay].title}</h4>
            <span className="text-xs font-semibold text-emerald-700 block mt-0.5">{itineraries[activeDay].timing}</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {itineraries[activeDay].stops.map((stop, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs sm:text-sm font-bold text-slate-900">{stop.place}</strong>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {stop.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{stop.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Weather & Packing Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Weather Guide Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Climate & Seasons</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                1,600m Altitude
              </span>
            </div>
            <h3 className="font-black text-base text-slate-900">Munnar Hill Weather Guide</h3>
            <p className="text-xs text-slate-500 mt-0.5">Expect misty mornings, pleasant afternoons, and chilly nights.</p>

            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">Day Temp</span>
                <strong className="text-sm font-black text-slate-800">19°C - 24°C</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Thermometer className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">Night Temp</span>
                <strong className="text-sm font-black text-slate-800">10°C - 15°C</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <CloudRain className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">Mist Index</span>
                <strong className="text-sm font-black text-emerald-700">Very High</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              💡 <strong>Traveler Insight:</strong> Keep headlamps or fog lights on while driving on ghat roads between 5:00 AM to 8:30 AM due to dense rolling mountain mist.
            </p>
          </div>
        </div>

        {/* Packing Checklist Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Checklist</span>
              <h3 className="font-black text-base text-slate-900">Munnar Packing Checklist</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {checkedItems.length} / {PACKING_ITEMS.length} Packed
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {PACKING_ITEMS.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border ${
                    isChecked
                      ? 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className={`text-xs font-medium leading-tight ${isChecked ? 'line-through opacity-75' : ''}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Emergency Contacts Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="font-extrabold text-base text-white">
            Munnar Emergency Helpline & Assistance
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <a
            href="tel:04865230321"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] text-slate-400 font-bold block">Munnar Police</span>
            <strong className="text-xs sm:text-sm text-emerald-300 font-bold block">04865-230321</strong>
          </a>

          <a
            href="tel:04865230223"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] text-slate-400 font-bold block">Tata General Hospital</span>
            <strong className="text-xs sm:text-sm text-emerald-300 font-bold block">04865-230223</strong>
          </a>

          <a
            href="tel:04865231587"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] text-slate-400 font-bold block">Forest Range Office</span>
            <strong className="text-xs sm:text-sm text-emerald-300 font-bold block">04865-231587</strong>
          </a>

          <a
            href="tel:108"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] text-slate-400 font-bold block">Kerala Ambulance</span>
            <strong className="text-xs sm:text-sm text-rose-300 font-bold block">108</strong>
          </a>
        </div>
      </div>

    </section>
  );
}
