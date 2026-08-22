import React from 'react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/haptics';
import { 
  Plane, 
  Fuel, 
  Calculator, 
  Wallet, 
  BarChart3, 
  FileText, 
  Code
} from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'intro', label: 'Home', icon: Plane },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'predictor', label: 'Budget', icon: Calculator },
    { id: 'tracker', label: 'Ledger', icon: Wallet },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'reports', label: 'Report', icon: FileText },
    { id: 'creator', label: 'About', icon: Code },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-2xl safe-bottom transition-colors hardware-accelerated">
      <div className="grid grid-cols-7 h-[58px] max-w-lg mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic(12);
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all relative active:scale-95 select-none ${
                isActive 
                  ? 'text-emerald-700 dark:text-emerald-400 font-black' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-emerald-600 dark:text-emerald-400' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[9.5px] font-bold tracking-tight leading-none mt-1 truncate w-full text-center">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full mt-0.5 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
