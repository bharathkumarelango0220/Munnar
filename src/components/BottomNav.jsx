import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Wallet, 
  Fuel, 
  Calculator, 
  Map, 
  Code
} from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'places', label: 'Places', icon: Compass },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'predictor', label: 'Predictor', icon: Calculator },
    { id: 'tracker', label: 'Expenses', icon: Wallet },
    { id: 'route', label: 'Route', icon: Map },
    { id: 'creator', label: 'Creator', icon: Code },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl safe-bottom">
      <div className="grid grid-cols-6 h-16 max-w-lg mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-emerald-50 text-emerald-700' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-emerald-600' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[9px] tracking-tight leading-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
