import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { checkEmailLinkSignIn } from './services/emailAuth';
import confetti from 'canvas-confetti';
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
import AuthModal from './components/AuthModal';
import AddExpenseModal from './components/AddExpenseModal';
import SetBudgetModal from './components/SetBudgetModal';
import AIReceiptScannerModal from './components/AIReceiptScannerModal';
import AIVoiceAssistantModal from './components/AIVoiceAssistantModal';
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
  MapPin
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
          tripName: 'Trip Expedition 2026'
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
        
        {/* Contextual Hero Banner */}
        <HeroBanner />

        {/* Dynamic Tab Switcher Content */}
        <div className="transition-all duration-300">
          {activeTab === 'intro' && <Introduction />}
          {activeTab === 'fuel' && <FuelCalculator />}
          {activeTab === 'predictor' && <TripCostPredictor />}
          {activeTab === 'tracker' && <ExpenseTracker />}
          {activeTab === 'analytics' && <BudgetAnalytics />}
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
                  <Plane className="w-5 h-5" />
                </div>
                <span className="font-black text-lg tracking-tight">TripTools</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All-in-one smart travel suite, dynamic expense tracker, mountain fuel & rental calculator, total cost predictor & route sequencer. Free for all travelers.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Explore Features</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  <button onClick={() => { setActiveTab('intro'); scrollToTop(); }} className="hover:text-white transition-colors">
                    🚀 Overview & Introduction
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('fuel'); scrollToTop(); }} className="hover:text-white transition-colors">
                    ⛽ Fuel & Rental Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('predictor'); scrollToTop(); }} className="hover:text-white transition-colors">
                    🧮 All-in-One Total Cost Predictor
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tracker'); scrollToTop(); }} className="hover:text-white transition-colors">
                    💰 Trip Budget & Expense Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('analytics'); scrollToTop(); }} className="hover:text-white transition-colors">
                    📊 Budget Analytics & Radar
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
      <AuthModal />
      <AddExpenseModal />
      <SetBudgetModal />
      <AIReceiptScannerModal />
      <AIVoiceAssistantModal />
    </div>
  );
}
