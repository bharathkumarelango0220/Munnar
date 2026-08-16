import React, { useState } from 'react';
import { 
  Utensils, 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ExternalLink, 
  Sparkles, 
  PlusCircle, 
  Coffee 
} from 'lucide-react';
import { MUNNAR_RESTAURANTS, RESTAURANT_CATEGORIES } from '../data/munnarRestaurants';
import { useApp } from '../context/AppContext';

export default function FoodGuide() {
  const { openAddExpenseForCategory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = MUNNAR_RESTAURANTS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mustTry.some(dish => dish.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>Munnar Food & Dining Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Authentic Kerala Meals & Hilltop Cafes 🍛☕
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover banana leaf Sadhya, hot cardamom chai, Kerala seafood, and street snacks in Munnar.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search dishes (e.g. Sadhya, Pazham Pori, Parotta, Fish Curry, Coffee)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 shadow-soft"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {RESTAURANT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRestaurants.map((resto) => (
          <div
            key={resto.id}
            className="group bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-xl transition-all overflow-hidden flex flex-col hover:-translate-y-0.5"
          >
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={resto.imageUrl}
                alt={resto.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  {resto.category}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{resto.rating}</span>
                </span>
              </div>

              {/* Bottom Details on Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-black text-lg text-white drop-shadow-sm">{resto.name}</h3>
                <p className="text-xs text-slate-200 drop-shadow-sm">{resto.cuisine}</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              
              <p className="text-xs text-slate-600 leading-relaxed">
                {resto.description}
              </p>

              {/* Must Try Tags */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  🌟 Must-Try Specialities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resto.mustTry.map((dish, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timing & Price Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{resto.timings}</span>
                </span>
                <span className="font-bold text-emerald-700">
                  {resto.priceRange}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={resto.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => openAddExpenseForCategory('food')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Add Food Expense"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Log Bill</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
