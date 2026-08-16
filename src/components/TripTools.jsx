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
  Sparkles, 
  Plus, 
  RotateCcw, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const INITIAL_PACKING_CATEGORIES = {
  warm: {
    name: 'Warm Clothing & Sweaters',
    icon: '🧥',
    items: [
      { id: 'w1', label: 'Warm fleece jacket / sweater (essential for 12°C-18°C evening mist)' },
      { id: 'w2', label: 'Woolen beanie / cap & gloves (for Kolukkumalai sunrise 8°C cold)' },
      { id: 'w3', label: 'Thermal inners (for winter months Oct - Feb)' },
      { id: 'w4', label: 'Cotton socks (2-3 extra pairs for damp hill walks)' }
    ]
  },
  rain: {
    name: 'Rain & Monsoon Gear',
    icon: '☔',
    items: [
      { id: 'r1', label: 'Sturdy compact umbrella (frequent sudden mountain showers)' },
      { id: 'r2', label: 'Waterproof rain poncho / jacket' },
      { id: 'r3', label: 'Waterproof phone pouch / backpack rain cover' }
    ]
  },
  meds: {
    name: 'Medicines & First Aid',
    icon: '💊',
    items: [
      { id: 'm1', label: 'Motion sickness tablets (for Ghat roads & 40+ hairpin bends)' },
      { id: 'm2', label: 'Insect & mosquito repellent cream / spray' },
      { id: 'm3', label: 'Basic pain relief, band-aids & ORS electrolyte sachets' },
      { id: 'm4', label: 'Moisturizing lip balm & cold cream for hill dry skin' }
    ]
  },
  gadgets: {
    name: 'Gadgets & Electronics',
    icon: '📱',
    items: [
      { id: 'g1', label: 'High-capacity 20,000mAh Power Bank (battery drains faster in cold)' },
      { id: 'g2', label: 'Fast car charger & extra USB cables' },
      { id: 'g3', label: 'Camera memory card with ample free space for tea garden photos' }
    ]
  },
  docs: {
    name: 'Travel Documents & Cash',
    icon: '📄',
    items: [
      { id: 'd1', label: 'Government Photo ID (Original Aadhar/Passport for national park & hotel check-ins)' },
      { id: 'd2', label: 'Physical Cash (₹2,000-₹4,000) for remote tea/spice stalls with weak UPI network' },
      { id: 'd3', label: 'Advance Eravikulam National Park ticket printout/QR code' }
    ]
  },
  essentials: {
    name: 'Trekking & Hill Essentials',
    icon: '🥾',
    items: [
      { id: 'e1', label: 'Comfortable grip sneakers / trekking shoes for damp grassy slopes' },
      { id: 'e2', label: 'Insulated thermos flask for hot drinking water / chai' },
      { id: 'e3', label: 'Sunglasses & high UV sunscreen (high mountain sun index)' }
    ]
  }
};

export default function TripTools() {
  const { openAddExpenseForCategory } = useApp();
  const [activeDay, setActiveDay] = useState(1);
  const [activePackCategory, setActivePackCategory] = useState('all');

  const [packingData, setPackingData] = useState(() => {
    const saved = localStorage.getItem('munnar_custom_packing');
    return saved ? JSON.parse(saved) : INITIAL_PACKING_CATEGORIES;
  });

  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('munnar_checked_items');
    return saved ? JSON.parse(saved) : ['w1', 'r1', 'm1', 'g1', 'd1', 'd2', 'e1'];
  });

  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('warm');

  useEffect(() => {
    localStorage.setItem('munnar_custom_packing', JSON.stringify(packingData));
  }, [packingData]);

  useEffect(() => {
    localStorage.setItem('munnar_checked_items', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id) => {
    const isNowChecked = !checkedItems.includes(id);
    const updated = isNowChecked
      ? [...checkedItems, id]
      : checkedItems.filter((item) => item !== id);
    setCheckedItems(updated);

    // Celebrate 100% packing
    if (isNowChecked && updated.length === totalItemsCount) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const itemId = `c_${Date.now()}`;
    const updated = { ...packingData };
    updated[newItemCategory].items.push({
      id: itemId,
      label: newItemText.trim()
    });

    setPackingData(updated);
    setNewItemText('');
  };

  const handleResetChecklist = () => {
    if (confirm('Reset packing checklist to standard Munnar travel essentials?')) {
      setPackingData(INITIAL_PACKING_CATEGORIES);
      setCheckedItems(['w1', 'r1', 'm1', 'g1', 'd1', 'd2', 'e1']);
    }
  };

  // Calculate totals
  const allItemsList = Object.values(packingData).flatMap((cat) => cat.items);
  const totalItemsCount = allItemsList.length;
  const checkedCount = checkedItems.filter((id) =>
    allItemsList.some((it) => it.id === id)
  ).length;
  const percentPacked = Math.round((checkedCount / (totalItemsCount || 1)) * 100);

  const itineraries = {
    1: {
      title: 'Day 1: Classic Mattupetty & Top Station Cloud Circuit',
      timing: '8:30 AM - 6:30 PM (Approx 70 km round trip)',
      mapRouteUrl: 'https://www.google.com/maps/dir/Munnar+Tea+Museum/Photo+Point/Mattupetty+Dam/Kundala+Dam/Top+Station',
      estCost: '₹850 / person (Entry + Boating + Meals)',
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
      mapRouteUrl: 'https://www.google.com/maps/dir/Suryanelli/Kolukkumalai+Tea+Estate/Eravikulam+National+Park/Pothamedu+View+Point',
      estCost: '₹1,500 / person (Jeep Safari share + National Park pass)',
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
      mapRouteUrl: 'https://www.google.com/maps/dir/Attukal+Waterfalls/Lakkam+Waterfalls/Marayoor+Sandalwood+Forest/Blossom+Hydel+Park',
      estCost: '₹600 / person (Entry + Fresh Jaggery & Spice shopping)',
      stops: [
        { time: '09:30 AM', place: 'Attukal Waterfalls', note: 'Cascading roaring mountain falls' },
        { time: '11:30 AM', place: 'Lakkam Waterfalls', note: 'Refreshing crystal-clear natural rock pool dip' },
        { time: '01:30 PM', place: 'Marayoor Sandalwood Forests & Dolmens', note: 'Historic stone age Muniyara & fresh jaggery making' },
        { time: '04:30 PM', place: 'Blossom Hydel Park & Spice Shopping', note: 'Evening stroll and buying authentic Kerala spices' }
      ]
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Travel Planning & Essentials</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Munnar Itinerary, Packing Checklist & SOS Guide 🎒🗺️
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Curated 3-day optimal routes, categorized smart packing checklist, and 24x7 emergency contacts.
        </p>
      </div>

      {/* 1. Suggested 3-Day Itinerary */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Day-by-Day Sightseeing Routes
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Optimal Sightseeing Itinerary Planner
            </h3>
          </div>

          {/* Day Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDay === day
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Active Day Detail Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-black text-sm sm:text-base text-slate-900">
                {itineraries[activeDay].title}
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                ⏱️ {itineraries[activeDay].timing} • 💰 Est. Cost: <strong>{itineraries[activeDay].estCost}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={itineraries[activeDay].mapRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Full Route in Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>

          {/* Stops Timeline */}
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
            {itineraries[activeDay].stops.map((stop, i) => (
              <div key={i} className="relative group">
                <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[11px] font-black text-emerald-700">{stop.time}</span>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{stop.place}</h5>
                  </div>
                  <p className="text-xs text-slate-500">{stop.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Smart Categorized Packing Checklist */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-5">
        
        {/* Header & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Smart Hill Station Checklist
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Munnar Travel Packing Assistant 🎒
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900">
                {checkedCount} / {totalItemsCount} Packed
              </span>
              <span className="text-xs font-black text-emerald-700 ml-1.5">({percentPacked}%)</span>
            </div>
            <button
              onClick={handleResetChecklist}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${percentPacked}%` }}
          ></div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActivePackCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activePackCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items ({totalItemsCount})
          </button>
          {Object.entries(packingData).map(([catKey, catData]) => (
            <button
              key={catKey}
              onClick={() => setActivePackCategory(catKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                activePackCategory === catKey
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{catData.icon}</span>
              <span>{catData.name}</span>
            </button>
          ))}
        </div>

        {/* Items Grid by Category */}
        <div className="space-y-4">
          {Object.entries(packingData)
            .filter(([catKey]) => activePackCategory === 'all' || activePackCategory === catKey)
            .map(([catKey, catData]) => (
              <div key={catKey} className="space-y-2">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <span>{catData.icon}</span>
                  <span>{catData.name}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catData.items.map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-md border-2 border-slate-300 bg-white"></div>
                          )}
                        </div>
                        <span className={`text-xs font-medium leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Add Custom Item Form */}
        <form onSubmit={handleAddCustomItem} className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="+ Add your custom travel item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="w-full sm:flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500"
          >
            {Object.entries(packingData).map(([catKey, catData]) => (
              <option key={catKey} value={catKey}>
                {catData.icon} {catData.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>

      </div>

      {/* 3. 24x7 Emergency Helplines & Health Centers */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="font-extrabold text-base sm:text-lg text-white">
            Munnar Emergency Contacts & Tourist Police (24x7)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Tourist Police Munnar</span>
            <a href="tel:04865230321" className="text-sm font-black text-emerald-400 hover:underline mt-1 block">
              📞 04865 230321
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Tata General Hospital</span>
            <a href="tel:04865230223" className="text-sm font-black text-emerald-400 hover:underline mt-1 block">
              🏥 04865 230223
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Forest Dept Wildlife SOS</span>
            <a href="tel:04865231587" className="text-sm font-black text-emerald-400 hover:underline mt-1 block">
              🐘 04865 231587
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Emergency Ambulance</span>
            <a href="tel:108" className="text-sm font-black text-rose-400 hover:underline mt-1 block">
              🚑 108 / 112
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}
