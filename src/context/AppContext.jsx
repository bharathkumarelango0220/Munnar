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
  const [activeTab, setActiveTab] = useState('intro');

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('triptools_theme');
      if (saved) return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('triptools_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User state (only stored persistently if verified login)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('munnar_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isLoggedIn = !!(user && user.isVerified);

  // Storage helper
  const getInitial = (key, fallback) => {
    try {
      const storage = isLoggedIn ? localStorage : sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Flag indicating if user configured their budget via predictor or custom setup
  const [isBudgetConfigured, setIsBudgetConfigured] = useState(() => {
    return getInitial('munnar_budget_configured_v3', false);
  });

  // Dynamic Categories Definitions (Starts empty/clean for guests)
  const [categoryDefinitions, setCategoryDefinitions] = useState(() => {
    return getInitial('munnar_custom_categories_v3', {});
  });

  // Budgets State (Starts 0 for all)
  const [budgets, setBudgets] = useState(() => {
    return getInitial('munnar_budgets_v3', {});
  });

  // Expenses State (Starts empty)
  const [expenses, setExpenses] = useState(() => {
    return getInitial('munnar_expenses_v3', []);
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    return getInitial('munnar_wishlist_v3', ['kolukkumalai-tea-estate', 'eravikulam-national-park', 'mattupetty-dam']);
  });

  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [prefilledCategory, setPrefilledCategory] = useState('');

  const syncTimeoutRef = useRef(null);

  // Save to Appropriate Storage (sessionStorage for guests, localStorage + Cloud for logged-in users)
  useEffect(() => {
    const targetStorage = isLoggedIn ? localStorage : sessionStorage;

    targetStorage.setItem('munnar_custom_categories_v3', JSON.stringify(categoryDefinitions));
    targetStorage.setItem('munnar_budgets_v3', JSON.stringify(budgets));
    targetStorage.setItem('munnar_budget_configured_v3', JSON.stringify(isBudgetConfigured));
    targetStorage.setItem('munnar_expenses_v3', JSON.stringify(expenses));
    targetStorage.setItem('munnar_wishlist_v3', JSON.stringify(wishlist));

    if (!isLoggedIn) {
      // Clear persistent storage so closing tab resets everything to 0 for unlogged users
      localStorage.removeItem('munnar_custom_categories_v3');
      localStorage.removeItem('munnar_budgets_v3');
      localStorage.removeItem('munnar_budget_configured_v3');
      localStorage.removeItem('munnar_expenses_v3');
    } else {
      // Sync with Cloud Firestore for logged-in accounts
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
    }
  }, [categoryDefinitions, budgets, isBudgetConfigured, expenses, wishlist, user, isLoggedIn]);

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
  };

  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    setIsBudgetConfigured(true);
  };

  const resetAllData = () => {
    if (confirm('Are you sure you want to clear all trip expenses and reset all categories to 0?')) {
      setExpenses([]);
      setBudgets({});
      setCategoryDefinitions({});
      setIsBudgetConfigured(false);
      localStorage.removeItem('munnar_custom_categories_v3');
      localStorage.removeItem('munnar_budgets_v3');
      localStorage.removeItem('munnar_budget_configured_v3');
      localStorage.removeItem('munnar_expenses_v3');
      sessionStorage.clear();
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

  // Login: promotes all session data to permanent cloud-synced localStorage
  const loginUser = (userData) => {
    const verifiedUser = { ...userData, isVerified: true };
    setUser(verifiedUser);
    localStorage.setItem('munnar_user', JSON.stringify(verifiedUser));

    // Save current session data to localStorage
    localStorage.setItem('munnar_custom_categories_v3', JSON.stringify(categoryDefinitions));
    localStorage.setItem('munnar_budgets_v3', JSON.stringify(budgets));
    localStorage.setItem('munnar_budget_configured_v3', JSON.stringify(isBudgetConfigured));
    localStorage.setItem('munnar_expenses_v3', JSON.stringify(expenses));
    localStorage.setItem('munnar_wishlist_v3', JSON.stringify(wishlist));

    setIsAuthModalOpen(false);

    // Also attempt to load any previously saved cloud trip for this user
    const userKey = verifiedUser.phone || verifiedUser.email;
    if (userKey) {
      loadUserTripFromCloud(userKey).then((cloudData) => {
        if (cloudData) {
          if (cloudData.categoryDefinitions) setCategoryDefinitions(cloudData.categoryDefinitions);
          if (cloudData.budgets) setBudgets(cloudData.budgets);
          if (cloudData.expenses) setExpenses(cloudData.expenses);
          if (cloudData.isBudgetConfigured !== undefined) setIsBudgetConfigured(cloudData.isBudgetConfigured);
        }
      });
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsBudgetConfigured(false);
    setCategoryDefinitions({});
    setBudgets({});
    setExpenses([]);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        isLoggedIn,
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
        resetAllData,
        theme,
        toggleTheme
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
