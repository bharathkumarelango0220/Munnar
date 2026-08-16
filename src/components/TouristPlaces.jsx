import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MUNNAR_PLACES, CATEGORIES } from '../data/munnarPlaces';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Heart, 
  Star, 
  ExternalLink, 
  Ticket, 
  Compass, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function TouristPlaces() {
  const { wishlist, toggleWishlist, setSelectedPlace } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const filteredPlaces = MUNNAR_PLACES.filter((place) => {
    const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
    const matchesSearch = 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWishlist = !showWishlistOnly || wishlist.includes(place.id);

    return matchesCategory && matchesSearch && matchesWishlist;
  });

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Munnar Sightseeing Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Top Tourist Places & Live Map Navigation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click any place to explore details or tap <strong>Open in Google Maps</strong> for instant GPS directions.
          </p>
        </div>

        {/* Wishlist toggle pill */}
        <button
          onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          className={`self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
            showWishlistOnly
              ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-white' : 'text-rose-500'}`} />
          <span>Saved Places ({wishlist.length})</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by spot name, waterfalls, peaks, tea estates, boating..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-soft font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No tourist places matched your search query or active category filter. Try clearing your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setShowWishlistOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredPlaces.map((place) => {
            const isSaved = wishlist.includes(place.id);

            return (
              <div
                key={place.id}
                className="group bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
              >
                {/* Place Image Banner */}
                <div 
                  onClick={() => setSelectedPlace(place)}
                  className="relative h-48 sm:h-52 w-full overflow-hidden cursor-pointer bg-slate-100"
                >
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      {place.category}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(place.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-slate-900/70 text-white hover:bg-slate-900'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save place'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="flex items-center gap-1 text-amber-400 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {place.rating}
                      </span>
                      <span className="text-[11px] text-slate-300">({place.reviewsCount.toLocaleString('en-IN')})</span>
                    </div>
                    <h3 className="font-extrabold text-base leading-snug line-clamp-1">{place.name}</h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {place.distance}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Ticket className="w-3 h-3 text-purple-600" />
                        {place.entryFee.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Open in Google Maps & View Info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {/* Direct 1-Tap Google Maps Link */}
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      title={`Open ${place.name} in Google Maps`}
                    >
                      <Navigation className="w-3.5 h-3.5 fill-white stroke-none" />
                      <span>Google Map</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {/* View Full Info */}
                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      Details
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
