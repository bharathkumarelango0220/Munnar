import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { saveUserTripToCloud, loadUserTripFromCloud } from '../services/firebase';

export const DEFAULT_CATEGORY_DEFINITIONS = {
  rooms: {
    id: 'rooms',
    name: 'Rooms & Stays',
    fullName: 'Rooms & Stays',
    subtitle: 'Resorts, Homestays, Hotels, Tents',
    icon: 'BedDouble',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    barColor: 'bg-blue-500',
    accentColor: '#3b82f6'
  },
  food: {
    id: 'food',
    name: 'Food & Dining',
    fullName: 'Food & Meals',
    subtitle: 'Breakfast, Lunch, Dinner, Kerala Meals',
    icon: 'UtensilsCrossed',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
    accentColor: '#f59e0b'
  },
  bike: {
    id: 'bike',
    name: 'Travel & Fuel',
    fullName: 'Travel, Fuel & Cabs',
    subtitle: 'Fuel, Rental, Tolls, Parking, Cabs',
    icon: 'Car',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-emerald-500',
    accentColor: '#10b981'
  },
  tickets: {
    id: 'tickets',
    name: 'Tickets & Safari',
    fullName: 'Tickets & Passes',
    subtitle: 'National Parks, Boating, Jeep Passes',
    icon: 'Ticket',
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    barColor: 'bg-purple-500',
    accentColor: '#a855f7'
  },
  shopping: {
    id: 'shopping',
    name: 'Spices & Shopping',
    fullName: 'Spices & Tea Shopping',
    subtitle: 'Cardamom, Tea powder, Chocolates, Gifts',
    icon: 'ShoppingBag',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    barColor: 'bg-rose-500',
    accentColor: '#f43f5e'
  }
};

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('places');

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('munnar_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Flag indicating if user configured their budget via predictor or custom setup
  const [isBudgetConfigured, setIsBudgetConfigured] = useState(() => {
    const saved = localStorage.getItem('munnar_budget_configured');
    return saved ? JSON.parse(saved) : false;
  });

  // Dynamic Categories Definitions
  const [categoryDefinitions, setCategoryDefinitions] = useState(() => {
    const saved = localStorage.getItem('munnar_custom_categories_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) return parsed;
      } catch (e) {}
    }
    return isBudgetConfigured ? DEFAULT_CATEGORY_DEFINITIONS : {};
  });

  // Budgets State
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('munnar_budgets_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // Expenses State
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
  const [prefilledCategory, setPrefilledCategory] = useState('');

  const syncTimeoutRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('munnar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('munnar_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('munnar_custom_categories_v2', JSON.stringify(categoryDefinitions));
    localStorage.setItem('munnar_budgets_v2', JSON.stringify(budgets));
    localStorage.setItem('munnar_budget_configured', JSON.stringify(isBudgetConfigured));
    localStorage.setItem('munnar_expenses', JSON.stringify(expenses));
    localStorage.setItem('munnar_wishlist', JSON.stringify(wishlist));

    const userKey = user?.phone || user?.email;
    if (userKey) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(async () => {
        setIsCloudSynced(false);
        await saveUserTripToCloud(userKey, {
          user,
          categoryDefinitions,
          budgets,
          expenses,
          wishlist,
          isBudgetConfigured
        });
        setIsCloudSynced(true);
      }, 1000);
    }
  }, [categoryDefinitions, budgets, isBudgetConfigured, expenses, wishlist, user]);

  // Dynamic Calculations per Category
  const activeCatKeys = Object.keys(categoryDefinitions);

  const categoryStats = activeCatKeys.reduce((acc, catKey) => {
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
    const defaultCat = activeCatKeys[0] || 'other';
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMode: expenseData.paymentMode || 'UPI',
      category: expenseData.category || defaultCat,
      note: expenseData.note || '',
      ...expenseData,
      amount: Number(expenseData.amount)
    };

    setExpenses((prev) => [newExpense, ...prev]);

    if (totalBudget > 0 && totalSpent + newExpense.amount <= totalBudget) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.85 }
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

  // Pipeline from Predictor to Tracker
  const saveTripCategories = (newCategoriesMap, newBudgetsMap) => {
    setCategoryDefinitions(newCategoriesMap);
    setBudgets(newBudgetsMap);
    setIsBudgetConfigured(true);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    setIsBudgetConfigured(true);
  };

  const resetAllData = () => {
    if (confirm('Are you sure you want to clear all trip expenses and reset your categories?')) {
      setExpenses([]);
      setBudgets({});
      setCategoryDefinitions({});
      setIsBudgetConfigured(false);
      localStorage.removeItem('munnar_custom_categories_v2');
      localStorage.removeItem('munnar_budgets_v2');
      localStorage.removeItem('munnar_budget_configured');
      localStorage.removeItem('munnar_expenses');
    }
  };

  const toggleWishlist = (placeId) => {
    setWishlist((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const openPlaceDetails = (place) => {
    setSelectedPlace(place);
  };

  const closePlaceDetails = () => {
    setSelectedPlace(null);
  };

  const openAddExpenseForCategory = (catKey) => {
    setPrefilledCategory(catKey);
    setIsAddExpenseModalOpen(true);
  };

  const loginUser = (userData) => {
    setUser({ ...userData, isVerified: true });
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    setIsBudgetConfigured(false);
    setCategoryDefinitions({});
    setBudgets({});
    setExpenses([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        loginUser,
        logoutUser,
        isBudgetConfigured,
        setIsBudgetConfigured,
        categoryDefinitions,
        setCategoryDefinitions,
        saveTripCategories,
        budgets,
        setBudgets,
        updateBudgets,
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        categoryStats,
        totalBudget,
        totalSpent,
        totalRemaining,
        totalPercentUsed,
        wishlist,
        toggleWishlist,
        selectedPlace,
        openPlaceDetails,
        closePlaceDetails,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        isSetBudgetModalOpen,
        setIsSetBudgetModalOpen,
        prefilledCategory,
        openAddExpenseForCategory,
        isCloudSynced,
        resetAllData
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
