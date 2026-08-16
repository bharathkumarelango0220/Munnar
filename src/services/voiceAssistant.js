/**
 * AI Voice Expense Assistant Natural Language Processing Engine
 * Parses spoken phrases into structured expense items: { amount, title, category, paymentMode, date, time }
 */

export const SAMPLE_VOICE_COMMANDS = [
  {
    phrase: "Spent 450 rupees for lunch at Saravana Bhavan with GPay",
    extracted: {
      amount: 450,
      title: "Lunch at Saravana Bhavan",
      category: "food",
      paymentMode: "UPI"
    }
  },
  {
    phrase: "Paid 1200 rupees for petrol at IndianOil in cash",
    extracted: {
      amount: 1200,
      title: "Petrol at IndianOil",
      category: "travel",
      paymentMode: "Cash"
    }
  },
  {
    phrase: "Bought homemade chocolates and green tea for 850 by Card",
    extracted: {
      amount: 850,
      title: "Chocolates & Green Tea",
      category: "shopping",
      paymentMode: "Card"
    }
  },
  {
    phrase: "Safari ticket and national park entry 600 via UPI",
    extracted: {
      amount: 600,
      title: "Safari Ticket & National Park Entry",
      category: "tickets",
      paymentMode: "UPI"
    }
  }
];

/**
 * Parses spoken voice transcript using pattern recognition & NLP rules
 * @param {string} text - Spoken transcript
 * @param {Array} availableCategories - Active categories from context
 */
export function parseVoiceExpense(text, availableCategories = []) {
  if (!text || typeof text !== 'string') {
    return {
      success: false,
      error: 'No speech detected.'
    };
  }

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Extract Amount (Look for numbers with currency context)
  let amount = 0;
  // Match patterns like "450 rupees", "rs 450", "₹450", "spent 450", "450 rs", "450"
  const amountMatch = lower.match(/(?:(?:rs\.?|inr|₹|spent|paid|for)\s*)?(\d+(?:\.\d{1,2})?)(?:\s*(?:rupees|rs\.?|inr|bucks|bucks|₹))?/i);
  
  if (amountMatch && amountMatch[1]) {
    // If multiple numbers exist, find the most plausible currency amount
    const numbers = lower.match(/\b\d+(?:\.\d{1,2})?\b/g);
    if (numbers && numbers.length > 0) {
      amount = parseFloat(numbers[0]);
    } else {
      amount = parseFloat(amountMatch[1]);
    }
  } else {
    // Fallback search for any isolated number
    const isolatedNum = lower.match(/\b\d+\b/);
    if (isolatedNum) {
      amount = parseFloat(isolatedNum[0]);
    }
  }

  // 2. Extract Payment Mode
  let paymentMode = 'UPI';
  if (lower.includes('cash') || lower.includes('currency') || lower.includes('notes')) {
    paymentMode = 'Cash';
  } else if (lower.includes('card') || lower.includes('debit') || lower.includes('credit') || lower.includes('visa') || lower.includes('mastercard')) {
    paymentMode = 'Card';
  } else if (lower.includes('gpay') || lower.includes('google pay') || lower.includes('phonepe') || lower.includes('paytm') || lower.includes('upi') || lower.includes('online')) {
    paymentMode = 'UPI';
  }

  // 3. Extract Category
  let categoryHint = 'food';
  if (
    lower.includes('petrol') || lower.includes('fuel') || lower.includes('diesel') ||
    lower.includes('cab') || lower.includes('taxi') || lower.includes('auto') ||
    lower.includes('bus') || lower.includes('toll') || lower.includes('parking') ||
    lower.includes('bike') || lower.includes('travel') || lower.includes('drive')
  ) {
    categoryHint = 'travel';
  } else if (
    lower.includes('hotel') || lower.includes('room') || lower.includes('stay') ||
    lower.includes('resort') || lower.includes('homestay') || lower.includes('lodge') ||
    lower.includes('cottage') || lower.includes('villa')
  ) {
    categoryHint = 'rooms';
  } else if (
    lower.includes('ticket') || lower.includes('safari') || lower.includes('park') ||
    lower.includes('boating') || lower.includes('entry') || lower.includes('museum') ||
    lower.includes('show') || lower.includes('pass')
  ) {
    categoryHint = 'tickets';
  } else if (
    lower.includes('shop') || lower.includes('tea') || lower.includes('spice') ||
    lower.includes('chocolate') || lower.includes('gift') || lower.includes('clothes') ||
    lower.includes('souvenir') || lower.includes('buying') || lower.includes('bought')
  ) {
    categoryHint = 'shopping';
  } else {
    categoryHint = 'food';
  }

  // 4. Extract Title / Merchant
  // Remove filler words to form a clean description
  let title = cleanText
    .replace(/(?:i\s+)?(?:spent|paid|gave|bought|purchased|allocated)\s+/gi, '')
    .replace(/\b(?:rs\.?|inr|rupees|₹|\d+)\b/gi, '')
    .replace(/\b(?:with|by|via|through|using)\s+(?:gpay|google pay|phonepe|paytm|upi|cash|card|debit|credit)\b/gi, '')
    .replace(/\b(?:in\s+cash|by\s+card|via\s+upi)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!title || title.length < 2) {
    title = categoryHint === 'food' ? 'Food / Dining'
      : categoryHint === 'travel' ? 'Travel & Fuel'
      : categoryHint === 'rooms' ? 'Room Stay'
      : categoryHint === 'tickets' ? 'Entry Tickets'
      : 'Shopping / Purchase';
  } else {
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const matchedCatId = matchCategory(categoryHint, availableCategories);

  return {
    success: true,
    amount: amount || 0,
    title: title,
    category: matchedCatId,
    paymentMode: paymentMode,
    date: today,
    time: currentTime,
    rawTranscript: cleanText,
    notes: `Logged via AI Voice Assistant • "${cleanText}"`
  };
}

function matchCategory(hint, availableCategories = []) {
  if (!availableCategories || availableCategories.length === 0) return 'food';
  const hintLower = (hint || '').toLowerCase();
  const found = availableCategories.find(
    (c) =>
      c.id.toLowerCase().includes(hintLower) ||
      c.name.toLowerCase().includes(hintLower)
  );
  return found ? found.id : availableCategories[0].id;
}
