import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { saveUserTripToCloud, loadUserTripFromCloud } from '../services/firebase';

export const CATEGORY_DEFINITIONS = {
  bike: {
    id: 'bike',
    name: 'Bike',
    fullName: 'Bike & Transport',
    subtitle: 'Fuel, Rental, Tolls, Spares, Parking',
    icon: 'Bike',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-emerald-500',
    accentColor: '#10b981'
  },
  food: {
    id: 'food',
    name: 'Food',
    fullName: 'Food & Meals',
    subtitle: 'Breakfast, Lunch, Dinner, Kerala Meals',
    icon: 'UtensilsCrossed',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
    accentColor: '#f59e0b'
  },
  snacks: {
    id: 'snacks',
    name: 'Snacks',
    fullName: 'Snacks & Beverages',
    subtitle: 'Munnar Tea, Coffee, Kerala Snacks, Fruits',
    icon: 'Coffee',
    color: 'orange',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    barColor: 'bg-orange-500',
    accentColor: '#f97316'
  },
  rooms: {
    id: 'rooms',
    name: 'Rooms',
    fullName: 'Rooms & Stays',
    subtitle: 'Resorts, Homestays, Hotels, Tents',
    icon: 'BedDouble',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    barColor: 'bg-blue-500',
    accentColor: '#3b82f6'
  },
  tickets: {
    id: 'tickets',
    name: 'Entry Tickets',
    fullName: 'Entry Tickets & Safari',
    subtitle: 'National Parks, Boating, Jeep, Museum Passes',
    icon: 'Ticket',
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    barColor: 'bg-purple-500',
    accentColor: '#a855f7'
  },
  unexpected: {
    id: 'unexpected',
    name: 'Unexpected Expenses',
    fullName: 'Unexpected & Extras',
    subtitle: 'Emergency, Spices Shopping, Medicine, Extras',
    icon: 'ShieldAlert',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    barColor: 'bg-rose-500',
    accentColor: '#f43f5e'
  }
};

const BLANK_BUDGETS = {
  bike: 0,
  food: 0,
  snacks: 0,
  rooms: 0,
  tickets: 0,
  unexpected: 0
};

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('places'); // 'places', 'tracker', 'reports', 'tools', 'creator'

  // Fresh user state - starts unauthenticated on fresh devices
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('munnar_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Flag indicating if the user has already configured their custom budgets
  const [isBudgetConfigured, setIsBudgetConfigured] = useState(() => {
    const saved = localStorage.getItem('munnar_budget_configured');
    return saved ? JSON.parse(saved) : false;
  });

  // Budgets State - starts customizable per user
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('munnar_budgets');
    return saved ? JSON.parse(saved) : BLANK_BUDGETS;
  });

  // Expenses State - starts empty for fresh custom user tracking
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('munnar_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('munnar_wishlist');
    return saved ? JSON.parse(saved) : ['kolukkumalai-tea-estate', 'eravikulam-national-park', 'mattupetty-dam'];
  });

  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [prefilledCategory, setPrefilledCategory] = useState('bike');

  // Debounced Cloud Sync Ref
  const syncTimeoutRef = useRef(null);

  // Auto prompt login if not logged in on first visit to expense tracker
  useEffect(() => {
    if (!user || !user.isVerified) {
      // Keep state clean for fresh visitors
    }
  }, []);

  // Persist to localStorage & Trigger Free Cloud Sync across devices
  useEffect(() => {
    if (user) {
      localStorage.setItem('munnar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('munnar_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('munnar_budgets', JSON.stringify(budgets));
    localStorage.setItem('munnar_budget_configured', JSON.stringify(isBudgetConfigured));
    localStorage.setItem('munnar_expenses', JSON.stringify(expenses));
    localStorage.setItem('munnar_wishlist', JSON.stringify(wishlist));

    // If user is verified and has phone or email, automatically sync to Cloud Firestore
    const userKey = user?.phone || user?.email;
    if (userKey) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(async () => {
        setIsCloudSynced(false);
        await saveUserTripToCloud(userKey, {
          user,
          budgets,
          expenses,
          wishlist,
          isBudgetConfigured
        });
        setIsCloudSynced(true);
      }, 1000);
    }
  }, [budgets, isBudgetConfigured, expenses, wishlist, user]);

  // Dynamic Calculations per Category
  const categoryStats = Object.keys(CATEGORY_DEFINITIONS).reduce((acc, catKey) => {
    const allocated = Number(budgets[catKey]) || 0;
    const spent = expenses
      .filter((exp) => exp.category === catKey)
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const remaining = allocated - spent;
    const percentUsed = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 999) : 0;
    const expenseCount = expenses.filter((exp) => exp.category === catKey).length;

    acc[catKey] = {
      allocated,
      spent,
      remaining,
      percentUsed,
      expenseCount,
      isConfigured: allocated > 0,
      isExceeded: allocated > 0 && spent > allocated,
      isClose: allocated > 0 && spent >= allocated * 0.85 && spent <= allocated
    };
    return acc;
  }, {});

  // Overall Calculations
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + (Number(b) || 0), 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Actions
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMode: expenseData.paymentMode || 'UPI',
      note: expenseData.note || '',
      ...expenseData,
      amount: Number(expenseData.amount)
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // Micro-animation confetti celebration if user stays within budget
    if (totalBudget > 0 && totalSpent + newExpense.amount <= totalBudget) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const updateExpense = (id, updatedData) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updatedData, amount: Number(updatedData.amount) } : exp))
    );
  };

  const updateBudgets = (newBudgets) => {
    const formatted = {};
    let hasAnyBudget = false;
    Object.keys(newBudgets).forEach((k) => {
      const val = Math.max(0, Number(newBudgets[k]) || 0);
      formatted[k] = val;
      if (val > 0) hasAnyBudget = true;
    });
    setBudgets(formatted);
    setIsBudgetConfigured(hasAnyBudget);

    if (hasAnyBudget) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Preload realistic sample template for demonstration (e.g. ₹15,000 for Bike)
  const loadExampleTemplate = () => {
    const sampleBudgets = {
      bike: 15000,
      food: 6000,
      snacks: 2000,
      rooms: 12000,
      tickets: 4000,
      unexpected: 3000
    };
    const sampleExpenses = [
      {
        id: 'exp-1',
        category: 'bike',
        amount: 3000,
        title: 'Fuel refuel at Adimali petrol station',
        paymentMode: 'UPI',
        date: new Date().toISOString().split('T')[0],
        time: '08:30 AM',
        note: 'Tank full for mountain climb'
      },
      {
        id: 'exp-2',
        category: 'bike',
        amount: 2000,
        title: 'Royal Enfield Rental Advance',
        paymentMode: 'UPI',
        date: new Date().toISOString().split('T')[0],
        time: '09:15 AM',
        note: 'Riding gear and helmet'
      },
      {
        id: 'exp-3',
        category: 'food',
        amount: 850,
        title: 'Authentic Kerala Meals & Fish Curry',
        paymentMode: 'Cash',
        date: new Date().toISOString().split('T')[0],
        time: '01:30 PM',
        note: 'Lunch near Blossom Park'
      },
      {
        id: 'exp-4',
        category: 'snacks',
        amount: 240,
        title: 'Hot Cardamom Tea & Banana Fritters',
        paymentMode: 'UPI',
        date: new Date().toISOString().split('T')[0],
        time: '04:45 PM',
        note: 'Pothamedu viewpoint tea stall'
      },
      {
        id: 'exp-5',
        category: 'tickets',
        amount: 600,
        title: 'Eravikulam National Park passes',
        paymentMode: 'Card',
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        note: 'Eco bus ticket included'
      }
    ];

    setBudgets(sampleBudgets);
    setExpenses(sampleExpenses);
    setIsBudgetConfigured(true);
  };

  const toggleWishlist = (placeId) => {
    setWishlist((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  // Cross-device login & Cloud restore
  const loginUser = async (userData) => {
    setUser({
      ...userData,
      isVerified: true
    });
    setIsAuthModalOpen(false);

    // Check if cloud data exists for this mobile number / email from another device
    const userKey = userData.phone || userData.email;
    if (userKey) {
      const cloudData = await loadUserTripFromCloud(userKey);
      if (cloudData) {
        if (cloudData.budgets) setBudgets(cloudData.budgets);
        if (cloudData.expenses) setExpenses(cloudData.expenses);
        if (cloudData.wishlist) setWishlist(cloudData.wishlist);
        if (typeof cloudData.isBudgetConfigured === 'boolean') {
          setIsBudgetConfigured(cloudData.isBudgetConfigured);
        }
      }
    }
  };

  const logoutUser = () => {
    setUser(null);
    setBudgets(BLANK_BUDGETS);
    setExpenses([]);
    setIsBudgetConfigured(false);
    localStorage.removeItem('munnar_user');
    localStorage.removeItem('munnar_budgets');
    localStorage.removeItem('munnar_budget_configured');
    localStorage.removeItem('munnar_expenses');
  };

  const resetAllData = () => {
    setBudgets(BLANK_BUDGETS);
    setExpenses([]);
    setIsBudgetConfigured(false);
    localStorage.removeItem('munnar_budgets');
    localStorage.removeItem('munnar_budget_configured');
    localStorage.removeItem('munnar_expenses');

    const userKey = user?.phone || user?.email;
    if (userKey) {
      saveUserTripToCloud(userKey, {
        budgets: BLANK_BUDGETS,
        expenses: [],
        wishlist: [],
        isBudgetConfigured: false
      });
    }
  };

  const openAddExpenseForCategory = (catKey) => {
    setPrefilledCategory(catKey);
    setIsAddExpenseModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        loginUser,
        logoutUser,
        budgets,
        updateBudgets,
        isBudgetConfigured,
        setIsBudgetConfigured,
        loadExampleTemplate,
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        resetAllData,
        categoryStats,
        totalBudget,
        totalSpent,
        totalRemaining,
        totalPercentUsed,
        wishlist,
        toggleWishlist,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        isSetBudgetModalOpen,
        setIsSetBudgetModalOpen,
        selectedPlace,
        setSelectedPlace,
        prefilledCategory,
        openAddExpenseForCategory,
        isCloudSynced
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
