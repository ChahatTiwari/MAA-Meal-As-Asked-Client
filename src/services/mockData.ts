// services/mockData.ts
// Demo mode data — hardcoded data for complete journey demo without backend API
import { Meal, Cook, Availability, CookOrder } from '../types';

export const DEMO_MODE = true;

/* =========================================================
   DEMO USERS
   ========================================================= */

export const demoCustomer = {
  id: 'demo-customer-1',
  name: 'Demo Customer',
  email: 'demo@maa.com',
  token: 'demo-token-customer',
  role: 'customer' as const,
};

export const demoCookUser = {
  id: 'demo-cook-user-1',
  name: 'Demo Cook',
  email: 'cook@maa.com',
  token: 'demo-token-cook',
  role: 'cook' as const,
};

export const DEMO_ACCOUNTS = [
  {
    label: '👤 Customer',
    email: 'demo@maa.com',
    password: 'demo123',
    name: 'Demo Customer',
  },
  {
    label: '👨‍🍳 Cook',
    email: 'cook@maa.com',
    password: 'cook123',
    name: 'Demo Cook',
  },
];

/* =========================================================
   DEMO COOK PROFILE
   ========================================================= */

export const demoCookProfile = {
  id: 'cook-1',
  userId: 'demo-cook-user-1',
  displayName: 'Priya Sharma',
  bio: 'Home chef specializing in authentic Indian cuisine. Cooking with love for over 10 years!',
  profileImage: '',
  location: {
    type: 'Point',
    coordinates: [77.2090, 28.6139], // [longitude, latitude] Delhi
    address: '12, Green Park Extension, New Delhi',
  },
  serviceRadiusKm: 10,
  isActive: true,
  rating: 4.8,
  totalOrders: 156,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/* =========================================================
   DEMO MEALS
   ========================================================= */

export const demoMeals: Meal[] = [
  {
    id: 'meal-1',
    cookId: 'cook-1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces, finished with butter and cream.',
    category: 'non-veg',
    cuisine: 'indian',
    price: 250,
    originalPrice: 300,
    imageUrl: '',
    ingredients: ['chicken', 'tomato', 'cream', 'butter', 'spices', 'ginger', 'garlic'],
    allergens: ['dairy'],
    prepTimeMins: 45,
    serves: 2,
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'medium',
    tags: ['dinner', 'popular', 'north-indian'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'meal-2',
    cookId: 'cook-1',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices, served with raita.',
    category: 'veg',
    cuisine: 'indian',
    price: 180,
    originalPrice: 200,
    imageUrl: '',
    ingredients: ['basmati rice', 'mixed vegetables', 'yogurt', 'mint', 'spices', 'saffron'],
    allergens: ['dairy'],
    prepTimeMins: 30,
    serves: 2,
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    tags: ['lunch', 'healthy', 'rice'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'meal-3',
    cookId: 'cook-1',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in rich tomato and cream gravy, a Punjabi classic.',
    category: 'veg',
    cuisine: 'indian',
    price: 150,
    originalPrice: 180,
    imageUrl: '',
    ingredients: ['black lentils', 'kidney beans', 'tomato', 'cream', 'butter', 'spices'],
    allergens: ['dairy'],
    prepTimeMins: 60,
    serves: 2,
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    tags: ['lunch', 'dinner', 'protein'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'meal-4',
    cookId: 'cook-1',
    name: 'Paneer Tikka',
    description: 'Char-grilled cottage cheese cubes marinated in spiced yogurt, served with mint chutney.',
    category: 'veg',
    cuisine: 'indian',
    price: 220,
    originalPrice: 250,
    imageUrl: '',
    ingredients: ['paneer', 'yogurt', 'spices', 'ginger', 'garlic', 'lemon'],
    allergens: ['dairy'],
    prepTimeMins: 35,
    serves: 2,
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'medium',
    tags: ['starter', 'popular', 'grilled'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'meal-5',
    cookId: 'cook-1',
    name: 'Masala Dosa',
    description: 'Crispy golden crepe filled with spiced potato masala, served with chutney and sambar.',
    category: 'veg',
    cuisine: 'indian',
    price: 120,
    originalPrice: 150,
    imageUrl: '',
    ingredients: ['rice', 'urad dal', 'potato', 'onion', 'spices', 'coconut'],
    allergens: [],
    prepTimeMins: 25,
    serves: 1,
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'mild',
    tags: ['breakfast', 'south-indian', 'healthy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* =========================================================
   DEMO AVAILABILITY
   ========================================================= */

export const demoAvailabilities: Availability[] = [
  { id: 'avail-0', cookId: 'cook-1', dayOfWeek: 0, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-1', cookId: 'cook-1', dayOfWeek: 1, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-2', cookId: 'cook-1', dayOfWeek: 2, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-3', cookId: 'cook-1', dayOfWeek: 3, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-4', cookId: 'cook-1', dayOfWeek: 4, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-5', cookId: 'cook-1', dayOfWeek: 5, startTime: '09:00', endTime: '21:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'avail-6', cookId: 'cook-1', dayOfWeek: 6, startTime: '10:00', endTime: '22:00', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/* =========================================================
   DEMO ORDERS
   ========================================================= */

export const demoOrders: CookOrder[] = [
  {
    id: 'ORD123456',
    cookId: 'cook-1',
    userId: 'demo-customer-1',
    mealId: 'meal-1',
    quantity: 2,
    unitPrice: 250,
    totalPrice: 500,
    status: 'pending',
    deliveryType: 'delivery',
    deliveryAddress: {
      type: 'Point',
      coordinates: [77.2200, 28.6200],
      address: '45, Hauz Khas Village, New Delhi',
    },
    notes: 'Extra spicy please!',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ORD123457',
    cookId: 'cook-1',
    userId: 'demo-customer-1',
    mealId: 'meal-2',
    quantity: 1,
    unitPrice: 180,
    totalPrice: 180,
    status: 'accepted',
    deliveryType: 'pickup',
    notes: '',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'ORD123458',
    cookId: 'cook-1',
    userId: 'demo-customer-1',
    mealId: 'meal-3',
    quantity: 3,
    unitPrice: 150,
    totalPrice: 450,
    status: 'preparing',
    deliveryType: 'delivery',
    deliveryAddress: {
      type: 'Point',
      coordinates: [77.2100, 28.6300],
      address: '8, Saket, New Delhi',
    },
    notes: 'Please pack separately.',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'ORD123459',
    cookId: 'cook-1',
    userId: 'demo-customer-1',
    mealId: 'meal-4',
    quantity: 2,
    unitPrice: 220,
    totalPrice: 440,
    status: 'ready',
    deliveryType: 'pickup',
    notes: '',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ORD123460',
    cookId: 'cook-1',
    userId: 'demo-customer-1',
    mealId: 'meal-5',
    quantity: 4,
    unitPrice: 120,
    totalPrice: 480,
    status: 'delivered',
    deliveryType: 'delivery',
    deliveryAddress: {
      type: 'Point',
      coordinates: [77.2000, 28.6100],
      address: '23, Lajpat Nagar, New Delhi',
    },
    notes: '',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
];

/* =========================================================
   DEMO NEARBY COOKS
   ========================================================= */

export const demoNearbyCooks: Cook[] = [
  {
    id: 'cook-1',
    userId: 'demo-cook-user-1',
    displayName: 'Priya Sharma',
    bio: 'Home chef specializing in authentic Indian cuisine. Cooking with love for over 10 years!',
    profileImage: '',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: '12, Green Park Extension, New Delhi',
    },
    serviceRadiusKm: 10,
    isActive: true,
    rating: 4.8,
    totalOrders: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cook-2',
    userId: 'demo-cook-user-2',
    displayName: 'Rahul Verma',
    bio: 'Wok-tossed Chinese and Indo-Chinese dishes made fresh to order.',
    profileImage: '',
    location: {
      type: 'Point',
      coordinates: [77.2200, 28.6200],
      address: '78, Hauz Khas Village, New Delhi',
    },
    serviceRadiusKm: 8,
    isActive: true,
    rating: 4.6,
    totalOrders: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cook-3',
    userId: 'demo-cook-user-3',
    displayName: 'Meera Patel',
    bio: 'Authentic Italian pastas, pizzas and risottos with a homely touch.',
    profileImage: '',
    location: {
      type: 'Point',
      coordinates: [77.2000, 28.6100],
      address: '34, Lajpat Nagar, New Delhi',
    },
    serviceRadiusKm: 12,
    isActive: true,
    rating: 4.7,
    totalOrders: 210,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cook-4',
    userId: 'demo-cook-user-4',
    displayName: 'Amit Singh',
    bio: 'Hearty North Indian thalis and home-style comfort food.',
    profileImage: '',
    location: {
      type: 'Point',
      coordinates: [77.2300, 28.6300],
      address: '5, Saket, New Delhi',
    },
    serviceRadiusKm: 6,
    isActive: false,
    rating: 4.5,
    totalOrders: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* =========================================================
   DEMO CHAT DATA
   ========================================================= */

export const demoChatResponses: Record<string, { response: string; ingredients: any[] }> = {
  dalChawal: {
    response: "Perfect choice! Dal Chawal is wholesome comfort food. Customize the ingredients below, then confirm your meal.",
    ingredients: [
      { id: 'dal-rice', name: 'Rice', selected: true, note: 'Steamed rice', price: 30 },
      { id: 'dal-pulses', name: 'Pulses', selected: true, note: 'Protein-rich dal', price: 40 },
      { id: 'dal-salt', name: 'Salt', selected: true, note: 'To taste', price: 5 },
      { id: 'dal-chilli', name: 'Chilli', selected: true, note: 'Mild heat', price: 10 },
      { id: 'dal-oil', name: 'Oil', selected: true, note: 'For tadka', price: 15 },
      { id: 'dal-onion', name: 'Onion', selected: true, note: 'Freshly chopped', price: 10 },
      { id: 'dal-tomato', name: 'Tomato', selected: true, note: 'Fresh and ripe', price: 10 },
      { id: 'dal-spices', name: 'Spices', selected: true, note: 'Homestyle spice blend', price: 20 },
    ],
  },
  default: {
    response: "Excellent choice! Let me find the perfect ingredients for that dish.",
    ingredients: [
      { id: 'ing-1', name: 'Basmati Rice', selected: true, note: 'Premium aged rice', price: 80 },
      { id: 'ing-2', name: 'Chicken/Paneer', selected: true, note: 'Fresh cut', price: 200 },
      { id: 'ing-3', name: 'Indian Spices', selected: true, note: 'Whole & ground', price: 60 },
      { id: 'ing-4', name: 'Onions & Garlic', selected: true, note: 'Fresh', price: 40 },
      { id: 'ing-5', name: 'Yogurt', selected: true, note: 'Creamy', price: 35 },
    ],
  },
  biryani: {
    response: "Great choice! Biryani needs the perfect rice and aromatic spices. Here are the ingredients I recommend:",
    ingredients: [
      { id: 'ing-1', name: 'Basmati Rice', selected: true, note: 'Aged 2 years', price: 120 },
      { id: 'ing-2', name: 'Chicken/Paneer', selected: true, note: 'Fresh marinated', price: 220 },
      { id: 'ing-3', name: 'Biryani Masala', selected: true, note: 'House blend', price: 80 },
      { id: 'ing-4', name: 'Saffron', selected: true, note: 'Kashmiri', price: 150 },
      { id: 'ing-5', name: 'Mint & Coriander', selected: true, note: 'Fresh herbs', price: 30 },
      { id: 'ing-6', name: 'Fried Onions', selected: true, note: 'Crispy', price: 50 },
    ],
  },
  pizza: {
    response: "Yummy choice! Here are the fresh ingredients for a perfect homemade pizza:",
    ingredients: [
      { id: 'ing-1', name: 'Pizza Dough', selected: true, note: 'Freshly made', price: 90 },
      { id: 'ing-2', name: 'Mozzarella Cheese', selected: true, note: 'Shredded', price: 150 },
      { id: 'ing-3', name: 'Tomato Sauce', selected: true, note: 'Homemade', price: 60 },
      { id: 'ing-4', name: 'Italian Herbs', selected: true, note: 'Oregano & basil', price: 45 },
      { id: 'ing-5', name: 'Olive Oil', selected: true, note: 'Extra virgin', price: 55 },
    ],
  },
  burger: {
    response: "Perfect! Here are the ingredients for a juicy homemade burger:",
    ingredients: [
      { id: 'ing-1', name: 'Burger Buns', selected: true, note: 'Brioche', price: 40 },
      { id: 'ing-2', name: 'Beef/Chicken Patty', selected: true, note: 'Fresh ground', price: 180 },
      { id: 'ing-3', name: 'Cheese Slices', selected: true, note: 'Cheddar', price: 60 },
      { id: 'ing-4', name: 'Fresh Vegetables', selected: true, note: 'Lettuce, tomato, onion', price: 70 },
      { id: 'ing-5', name: 'Sauces', selected: true, note: 'Mayo & ketchup', price: 30 },
    ],
  },
  pasta: {
    response: "That sounds delicious! Here are the ingredients for a creamy pasta:",
    ingredients: [
      { id: 'ing-1', name: 'Pasta', selected: true, note: 'Penne or spaghetti', price: 90 },
      { id: 'ing-2', name: 'Mozzarella Cheese', selected: true, note: 'Shredded', price: 150 },
      { id: 'ing-3', name: 'Tomato Sauce', selected: true, note: 'Rich & tangy', price: 60 },
      { id: 'ing-4', name: 'Italian Herbs', selected: true, note: 'Basil & oregano', price: 45 },
      { id: 'ing-5', name: 'Olive Oil', selected: true, note: 'Extra virgin', price: 55 },
    ],
  },
  dosa: {
    response: "Great idea! Here are the ingredients for a crispy dosa:",
    ingredients: [
      { id: 'ing-1', name: 'Rice', selected: true, note: 'Idli rice', price: 60 },
      { id: 'ing-2', name: 'Urad Dal', selected: true, note: 'Whole black gram', price: 70 },
      { id: 'ing-3', name: 'Potato', selected: true, note: 'For masala filling', price: 40 },
      { id: 'ing-4', name: 'Onion', selected: true, note: 'Finely chopped', price: 25 },
      { id: 'ing-5', name: 'Coconut', selected: true, note: 'For chutney', price: 35 },
    ],
  },
  curry: {
    response: "Excellent! Here are the ingredients for a rich, flavorful curry:",
    ingredients: [
      { id: 'ing-1', name: 'Chicken/Paneer', selected: true, note: 'Fresh cut', price: 200 },
      { id: 'ing-2', name: 'Tomato', selected: true, note: 'Ripe & juicy', price: 40 },
      { id: 'ing-3', name: 'Onion', selected: true, note: 'Finely chopped', price: 30 },
      { id: 'ing-4', name: 'Ginger & Garlic', selected: true, note: 'Fresh paste', price: 35 },
      { id: 'ing-5', name: 'Garam Masala', selected: true, note: 'House blend', price: 50 },
      { id: 'ing-6', name: 'Cream', selected: true, note: 'Fresh', price: 60 },
    ],
  },
};

export const getDemoChatResponse = (message: string) => {
  const lower = message.toLowerCase();
  
  if (lower.includes('dal chawal') || lower.includes('daal chawal')) return demoChatResponses.dalChawal;
  if (lower.includes('biryani')) return demoChatResponses.biryani;
  if (lower.includes('pizza')) return demoChatResponses.pizza;
  if (lower.includes('burger')) return demoChatResponses.burger;
  if (lower.includes('pasta') || lower.includes('spaghetti')) return demoChatResponses.pasta;
  if (lower.includes('dosa')) return demoChatResponses.dosa;
  if (lower.includes('curry') || lower.includes('chicken') || lower.includes('paneer')) return demoChatResponses.curry;
  
  return demoChatResponses.default;
};