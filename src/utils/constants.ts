
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const generateOrderId = (): string => {
  return 'FO' + Date.now().toString().slice(-8);
};

export const FOOD_CATEGORIES = {
  INDIAN: {
    keywords: ['indian', 'curry', 'biryani', 'dal', 'roti', 'naan'],
    ingredients: [
      { name: 'Basmati Rice', price: 80 },
      { name: 'Chicken/Paneer', price: 200 },
      { name: 'Indian Spices', price: 60 },
      { name: 'Onions & Garlic', price: 40 },
      { name: 'Yogurt', price: 35 },
    ],
  },
  ITALIAN: {
    keywords: ['pizza', 'pasta', 'italian', 'spaghetti', 'lasagna'],
    ingredients: [
      { name: 'Pizza Dough/Pasta', price: 90 },
      { name: 'Mozzarella Cheese', price: 150 },
      { name: 'Tomato Sauce', price: 60 },
      { name: 'Italian Herbs', price: 45 },
      { name: 'Olive Oil', price: 55 },
    ],
  },
  AMERICAN: {
    keywords: ['burger', 'sandwich', 'fries', 'american'],
    ingredients: [
      { name: 'Burger Buns', price: 40 },
      { name: 'Beef/Chicken Patty', price: 180 },
      { name: 'Cheese Slices', price: 60 },
      { name: 'Fresh Vegetables', price: 70 },
      { name: 'Sauces', price: 30 },
    ],
  },
};

export const CHAT_RESPONSES = [
  "Excellent choice! Let me find the perfect ingredients for that dish.",
  "That sounds delicious! Here are some fresh ingredients I recommend.",
  "Great idea! I've curated some quality ingredients for you.",
  "Perfect! Let me suggest the best ingredients to make this amazing.",
  "Yummy choice! Here are some premium ingredients for your meal.",
];
export const API_BASE_URL = 'https://api.foodorder.com';
export const WEBSOCKET_URL = 'wss://api.foodorder.com';