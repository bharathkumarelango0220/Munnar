import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Ticket, 
  Sparkles, 
  Heart, 
  Star, 
  Compass, 
  Share2, 
  Info,
  ExternalLink
} from 'lucide-react';

export default function PlaceDetailModal() {
  const { 
    selectedPlace, 
    setSelectedPlace, 
    wishlist, 
    toggleWishlist, 
    openAddExpenseForCategory 
  } = useApp();

  if (!selectedPlace) return null;

  const isSaved = wishlist.includes(selectedPlace.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedPlace.name} - Munnar`,
        text: `Check out ${selectedPlace.name} in Munnar!`,
        url: selectedPlace.googleMapsUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(selectedPlace.googleMapsUrl);
      alert('Google Maps link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-slideUp">
        
        {/* Modal Image Header */}
        <div className="relative h-60 sm:h-72 w-full flex-shrink-0">
          <img
            src={selectedPlace.imageUrl}
            alt={selectedPlace.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {selectedPlace.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(selectedPlace.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isSaved 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                    : 'bg-slate-900/80 text-white hover:bg-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-900 transition-colors"
                title="Share Place"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedPlace(null)}
                className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {selectedPlace.rating}
              </span>
              <span className="text-xs text-slate-300">({selectedPlace.reviewsCount.toLocaleString('en-IN')} reviews)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{selectedPlace.name}</h2>
            {selectedPlace.localName && (
              <p className="text-xs text-emerald-300 font-medium">{selectedPlace.localName}</p>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Distance</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{selectedPlace.distance}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-1">
                <Ticket className="w-3.5 h-3.5 text-purple-600" />
                <span>Entry & Tickets</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{selectedPlace.entryFee}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Timings</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{selectedPlace.timings}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              About This Destination
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {selectedPlace.description}
            </p>
          </div>

          {/* Key Highlights */}
          {selectedPlace.highlights && selectedPlace.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Key Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlace.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Traveler Pro Tip */}
          {selectedPlace.tip && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950 block mb-0.5">Traveler Pro-Tip:</strong>
                <p className="text-amber-800 leading-snug">{selectedPlace.tip}</p>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2.5">
          {/* Primary 1-Tap Google Maps Redirect Button */}
          <a
            href={selectedPlace.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Navigation className="w-4 h-4 fill-white stroke-none" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Quick Expense Log for this place */}
          <button
            onClick={() => {
              setSelectedPlace(null);
              openAddExpenseForCategory('tickets');
            }}
            className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Ticket className="w-4 h-4 text-purple-600" />
            <span>Log Ticket Expense</span>
          </button>
        </div>

      </div>
    </div>
  );
}
