import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Wallet, 
  Fuel, 
  Map, 
  Plus, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, setIsAddExpenseModalOpen } = useApp();

  const navItems = [
    { id: 'places', label: 'Places', icon: Compass },
    { id: 'tracker', label: 'Expenses', icon: Wallet },
    { id: 'add', label: 'Add ₹', icon: Plus, isAction: true },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'route', label: 'Route', icon: Map },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl safe-bottom">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <div key={item.id} className="flex justify-center -mt-6">
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  aria-label="Add Expense"
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/40 active:scale-95 transition-transform border-4 border-white"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-emerald-600' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
