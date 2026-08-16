import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { checkEmailLinkSignIn } from './services/emailAuth';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HeroBanner from './components/HeroBanner';
import TouristPlaces from './components/TouristPlaces';
import ExpenseTracker from './components/ExpenseTracker';
import ReportGenerator from './components/ReportGenerator';
import TripTools from './components/TripTools';
import CreatorCard from './components/CreatorCard';
import WeatherWidget from './components/WeatherWidget';
import FuelCalculator from './components/FuelCalculator';
import FoodGuide from './components/FoodGuide';
import AuthModal from './components/AuthModal';
import AddExpenseModal from './components/AddExpenseModal';
import SetBudgetModal from './components/SetBudgetModal';
import PlaceDetailModal from './components/PlaceDetailModal';
import { 
  Heart, 
  ExternalLink, 
  Phone, 
  Mail, 
  Sparkles, 
  Compass,
  ArrowUp,
  CloudSun,
  Fuel,
  Utensils
} from 'lucide-react';

export default function App() {
  const { activeTab, setActiveTab, loginUser } = useApp();

  useEffect(() => {
    // Check if user arrived via official Google Email verification link
    checkEmailLinkSignIn().then((res) => {
      if (res && res.success && res.email) {
        loginUser({
          name: res.email.split('@')[0],
          email: res.email,
          tripName: 'Munnar Tour 2026'
        });
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    });
  }, [loginUser]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* Entrance Hero Banner */}
        <HeroBanner />

        {/* Dynamic Tab Switcher Content */}
        <div className="transition-all duration-300">
          {activeTab === 'places' && <TouristPlaces />}
          {activeTab === 'tracker' && <ExpenseTracker />}
          {activeTab === 'fuel' && <FuelCalculator />}
          {activeTab === 'weather' && <WeatherWidget />}
          {activeTab === 'food' && <FoodGuide />}
          {activeTab === 'tools' && <TripTools />}
          {activeTab === 'reports' && <ReportGenerator />}
          {activeTab === 'creator' && <CreatorCard />}
        </div>

      </main>

      {/* Floating Scroll to Top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 md:bottom-8 right-4 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition-all"
        title="Scroll to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Universal Footer */}
      <footer className="bg-slate-900 text-white mt-12 border-t border-slate-800 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            
            {/* Col 1: About */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-black text-lg tracking-tight">MunnarGo</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Free mobile-first tourist companion, 6-category expense tracker, fuel calculator & live weather radar for everyone traveling to Munnar, Kerala.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Explore Features</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  <button onClick={() => { setActiveTab('places'); scrollToTop(); }} className="hover:text-white transition-colors">
                    📍 16+ Munnar Tourist Places
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tracker'); scrollToTop(); }} className="hover:text-white transition-colors">
                    💰 6-Category Expense Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('fuel'); scrollToTop(); }} className="hover:text-white transition-colors">
                    ⛽ Ghat Road Fuel & Mileage Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('weather'); scrollToTop(); }} className="hover:text-white transition-colors">
                    ⛅ Live Weather & Mist Forecast
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('food'); scrollToTop(); }} className="hover:text-white transition-colors">
                    🍛 Munnar Food & Restaurant Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tools'); scrollToTop(); }} className="hover:text-white transition-colors">
                    🎒 3-Day Itineraries & Packing Checklist
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('reports'); scrollToTop(); }} className="hover:text-white transition-colors">
                    📄 Download PDF Trip Report
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Developer & Contact */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Developer Contact</h4>
              <p className="text-xs text-slate-300 font-bold">Bharathkumar E</p>
              <div className="space-y-1 text-xs text-slate-400">
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
                Need a modern website or fullstack web app? Get in touch for custom development.
              </p>
              <a
                href="https://apexassure.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <span>Visit ApexAssure</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} MunnarGo Companion & Expense Tracker. Free for all travelers.</p>
            <p className="text-emerald-400 font-medium">
              Handcrafted with ❤️ by <a href="https://apexassure.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white hover:text-emerald-300">Bharathkumar E</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Persistent Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Global Modals */}
      <AuthModal />
      <AddExpenseModal />
      <SetBudgetModal />
      <PlaceDetailModal />

    </div>
  );
}
