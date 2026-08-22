import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HeroBanner from './components/HeroBanner';
import Introduction from './components/Introduction';
import ExpenseTracker from './components/ExpenseTracker';
import ReportGenerator from './components/ReportGenerator';
import TripCostPredictor from './components/TripCostPredictor';
import BudgetAnalytics from './components/BudgetAnalytics';
import FuelCalculator from './components/FuelCalculator';
import CreatorCard from './components/CreatorCard';
import TravelerNameModal from './components/TravelerNameModal';
import AddExpenseModal from './components/AddExpenseModal';
import SetBudgetModal from './components/SetBudgetModal';
import AIReceiptScannerModal from './components/AIReceiptScannerModal';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Heart, 
  ExternalLink, 
  Phone, 
  Mail, 
  Sparkles, 
  Plane,
  ArrowUp,
  Calculator,
  Fuel,
  MapPin,
  Globe,
  WifiOff,
  Wifi
} from 'lucide-react';

export default function App() {
  const { activeTab, setActiveTab } = useApp();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors">
      
      {/* Offline / Online Status Banners */}
      {!isOnline && (
        <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-center text-xs font-black flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>📴 Offline Mode Active • All tools, calculators & spending records work 100% offline</span>
        </div>
      )}
      {showOnlineToast && (
        <div className="bg-emerald-400 text-slate-950 px-4 py-1.5 text-center text-xs font-black flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50 animate-fadeIn">
          <Wifi className="w-3.5 h-3.5" />
          <span>⚡ Back Online • Cloud Sync Active</span>
        </div>
      )}

      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* Dynamic Hero Banner */}
        <HeroBanner />

        {/* Tab Router with Error Boundary */}
        <ErrorBoundary>
          <div>
            {activeTab === 'intro' && <Introduction />}
            {activeTab === 'fuel' && <FuelCalculator />}
            {activeTab === 'predictor' && <TripCostPredictor />}
            {activeTab === 'tracker' && <ExpenseTracker />}
            {activeTab === 'analytics' && <BudgetAnalytics />}
            {activeTab === 'reports' && <ReportGenerator />}
            {activeTab === 'creator' && <CreatorCard />}
          </div>
        </ErrorBoundary>

      </main>

      {/* Modern High-Conversion Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Bio */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm">
                  <Plane className="w-4 h-4" />
                </div>
                <span className="font-black text-lg text-white tracking-tight">
                  Trip<span className="text-emerald-500">Tools</span> PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart travel budgeting, fuel prediction & expense statement auditing tailored for explorers.
              </p>
            </div>

            {/* Col 2: Quick Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Features</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => { setActiveTab('fuel'); scrollToTop(); }} className="hover:text-white transition-colors">
                    ⛽ Ghat Fuel & Bike Rental Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('predictor'); scrollToTop(); }} className="hover:text-white transition-colors">
                    🧮 Dynamic Trip Cost Predictor
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tracker'); scrollToTop(); }} className="hover:text-white transition-colors">
                    💰 Budget vs. Actual Expense Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('reports'); scrollToTop(); }} className="hover:text-white transition-colors">
                    📄 Download PDF Trip Report
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('creator'); scrollToTop(); }} className="hover:text-white text-emerald-400 font-bold transition-colors">
                    👨‍💻 Creator Profile & Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Developer & Contact */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Developer Contact</h4>
              <p className="text-xs text-slate-300 font-bold">Bharathkumar E</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <a 
                  href="https://apexassure.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 transition-colors font-bold"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  <span>apexassure.vercel.app ↗</span>
                </a>
                <a href="tel:8220802736" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+91 8220802736</span>
                </a>
                <a href="mailto:bharathkumarelango02@gmail.com" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">bharathkumarelango02@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Col 4: Website Development Services */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Hire For Web Building</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need a modern website or fullstack web app? Get in touch with Bharathkumar for custom development.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=918220802736&text=Hi%20Bharathkumar,%20I%20want%20to%20discuss%20building%20a%20website!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} TripTools Companion & Expense Tracker. Free for all travelers.</p>
            <p className="text-emerald-400 font-medium">
              Handcrafted by <button onClick={() => { setActiveTab('creator'); scrollToTop(); }} className="underline font-bold text-white hover:text-emerald-300">Bharathkumar E</button>
            </p>
          </div>
        </div>
      </footer>

      {/* Persistent Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Global Modals */}
      <TravelerNameModal />
      <AddExpenseModal />
      <SetBudgetModal />
      <AIReceiptScannerModal />
    </div>
  );
}
