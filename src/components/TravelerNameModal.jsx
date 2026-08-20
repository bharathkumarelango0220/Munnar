import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TravelerNameModal() {
  const { 
    isNameModalOpen, 
    setIsNameModalOpen, 
    travelerName, 
    setTravelerName, 
    tripTitle, 
    setTripTitle 
  } = useApp();

  const [inputName, setInputName] = useState(travelerName || '');
  const [inputTrip, setInputTrip] = useState(tripTitle || 'Trip Expedition 2026');

  useEffect(() => {
    if (isNameModalOpen) {
      setInputName(travelerName || '');
      setInputTrip(tripTitle || 'Trip Expedition 2026');
    }
  }, [isNameModalOpen, travelerName, tripTitle]);

  if (!isNameModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const cleanName = inputName.trim() || 'Traveler';
    const cleanTrip = inputTrip.trim() || 'Trip Expedition 2026';

    setTravelerName(cleanName);
    setTripTitle(cleanTrip);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setIsNameModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      
      {/* Background click to dismiss */}
      <div 
        className="absolute inset-0"
        onClick={() => setIsNameModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative">
          <button
            onClick={() => setIsNameModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Traveler Profile</span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            Set Your Traveler Name 👤
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Your name will be printed on all official PDF statements, expense reports, and budget exports.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Traveler / User Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Bharathkumar E, Nithya, Alex..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This name appears on the official PDF trip document as the report recipient.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Trip / Tour Name
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Munnar Vacation 2026"
                value={inputTrip}
                onChange={(e) => setInputTrip(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Report Preview Callout */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1 text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <FileText className="w-4 h-4" />
              <span>Report Preview:</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Report Prepared For: <strong>{inputName.trim() || 'Traveler'}</strong> • Trip: <strong>{inputTrip.trim() || 'Trip Expedition 2026'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNameModalOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
