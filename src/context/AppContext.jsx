import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const DEFAULT_CATEGORY_DEFINITIONS = {};

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

  // Traveler / User Name (Persistent in localStorage, reflects on report & UI)
  const [travelerName, setTravelerNameState] = useState(() => {
    try {
      const saved = localStorage.getItem('munnar_traveler_name');
      return saved || 'Guest Traveler';
    } catch (e) {
      return 'Guest Traveler';
    }
  });

  const setTravelerName = (name) => {
    const clean = (name && name.trim()) || 'Guest Traveler';
    setTravelerNameState(clean);
    try {
      localStorage.setItem('munnar_traveler_name', clean);
    } catch (e) {}
  };

  // Trip Title
  const [tripTitle, setTripTitleState] = useState(() => {
    try {
      const saved = localStorage.getItem('munnar_trip_title');
      return saved || 'Trip Expedition 2026';
    } catch (e) {
      return 'Trip Expedition 2026';
    }
  });

  const setTripTitle = (title) => {
    const clean = (title && title.trim()) || 'Trip Expedition 2026';
    setTripTitleState(clean);
    try {
      localStorage.setItem('munnar_trip_title', clean);
    } catch (e) {}
  };

  // Storage helper
  const getInitial = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Flag indicating if user configured their budget via predictor or custom setup
  const [isBudgetConfigured, setIsBudgetConfigured] = useState(() => {
    return getInitial('munnar_budget_configured_v3', false);
  });

  // Dynamic Categories Definitions (Starts empty/clean)
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

  // Modals
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [prefilledCategory, setPrefilledCategory] = useState('');

  // Persist all data directly to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('munnar_custom_categories_v3', JSON.stringify(categoryDefinitions));
      localStorage.setItem('munnar_budgets_v3', JSON.stringify(budgets));
      localStorage.setItem('munnar_budget_configured_v3', JSON.stringify(isBudgetConfigured));
      localStorage.setItem('munnar_expenses_v3', JSON.stringify(expenses));
      localStorage.setItem('munnar_wishlist_v3', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [categoryDefinitions, budgets, isBudgetConfigured, expenses, wishlist]);

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
      isOverBudget: remaining < 0
    };
    return acc;
  }, {});

  // Overall Aggregates
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + (Number(b) || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;

  // Handlers
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      ...expenseData
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const updateExpense = (id, updatedData) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updatedData } : exp))
    );
  };

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

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        travelerName,
        setTravelerName,
        tripTitle,
        setTripTitle,
        isNameModalOpen,
        setIsNameModalOpen,
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
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        isSetBudgetModalOpen,
        setIsSetBudgetModalOpen,
        isReceiptScannerOpen,
        setIsReceiptScannerOpen,
        prefilledCategory,
        openAddExpenseForCategory,
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
