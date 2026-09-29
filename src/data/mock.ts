import type { Restaurant, MenuItem, Coupon, Location, User, Order, AnalyticsData, AdminUser } from '../types';

// ─── Locations ───────────────────────────────────────
export const locations: Location[] = [
  { id: 'l1', area: 'Koramangala', city: 'Bengaluru', full: 'Koramangala 4th Block, Bengaluru', pincode: '560034' },
  { id: 'l2', area: 'Indiranagar', city: 'Bengaluru', full: 'Indiranagar 100 Feet Road, Bengaluru', pincode: '560038' },
  { id: 'l3', area: 'HSR Layout', city: 'Bengaluru', full: 'HSR Layout Sector 2, Bengaluru', pincode: '560102' },
  { id: 'l4', area: 'Whitefield', city: 'Bengaluru', full: 'Whitefield Main Road, Bengaluru', pincode: '560066' },
  { id: 'l5', area: 'JP Nagar', city: 'Bengaluru', full: 'JP Nagar 6th Phase, Bengaluru', pincode: '560078' },
  { id: 'l6', area: 'Marathahalli', city: 'Bengaluru', full: 'Marathahalli Bridge, Bengaluru', pincode: '560037' },
];

// ─── Restaurants ─────────────────────────────────────
export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Spice Garden',
    slug: 'spice-garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
    cuisine: ['North Indian', 'Mughlai', 'Biryani'],
    rating: 4.3,
    reviewCount: 1847,
    priceForTwo: 550,
    deliveryTime: 35,
    pickupTime: 15,
    distance: '2.1 km',
    address: '23, 4th Block, Koramangala, Bengaluru 560034',
    area: 'Koramangala',
    isOpen: true,
    isVeg: false,
    hasQuickPick: true,
    pickupCounter: 'Counter 2',
    offer: '20% off above ₹499',
    tags: ['Popular', 'Quick Pickup'],
  },
  {
    id: 'r2',
    name: 'Burger Blast',
    slug: 'burger-blast',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&h=400&fit=crop',
    cuisine: ['Burgers', 'American', 'Fast Food'],
    rating: 4.1,
    reviewCount: 2134,
    priceForTwo: 450,
    deliveryTime: 25,
    pickupTime: 10,
    distance: '1.3 km',
    address: '56, 100 Feet Rd, Indiranagar, Bengaluru 560038',
    area: 'Indiranagar',
    isOpen: true,
    isVeg: false,
    hasQuickPick: true,
    pickupCounter: 'Window 1',
    offer: 'Buy 1 Get 1 on classic burgers',
    tags: ['Fast Delivery', 'Quick Pickup'],
  },
  {
    id: 'r3',
    name: 'Momo Junction',
    slug: 'momo-junction',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&h=400&fit=crop',
    cuisine: ['Tibetan', 'Chinese', 'Street Food'],
    rating: 4.5,
    reviewCount: 956,
    priceForTwo: 300,
    deliveryTime: 30,
    pickupTime: 12,
    distance: '3.5 km',
    address: 'Food Truck Zone, HSR Layout, Bengaluru 560102',
    area: 'HSR Layout',
    isOpen: true,
    isVeg: false,
    hasQuickPick: true,
    pickupCounter: 'Truck Window',
    tags: ['Food Truck', 'Quick Pickup'],
  },
  {
    id: 'r4',
    name: 'Dosa Corner',
    slug: 'dosa-corner',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=1200&h=400&fit=crop',
    cuisine: ['South Indian', 'Breakfast', 'Tiffins'],
    rating: 4.4,
    reviewCount: 3201,
    priceForTwo: 250,
    deliveryTime: 30,
    pickupTime: 8,
    distance: '0.8 km',
    address: '12, 5th Cross, Koramangala, Bengaluru 560034',
    area: 'Koramangala',
    isOpen: true,
    isVeg: true,
    hasQuickPick: true,
    pickupCounter: 'Counter 1',
    offer: 'Flat ₹50 off on first order',
    tags: ['Pure Veg', 'Quick Pickup', 'Budget'],
  },
  {
    id: 'r5',
    name: 'The Biryani House',
    slug: 'the-biryani-house',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&h=400&fit=crop',
    cuisine: ['Biryani', 'Hyderabadi', 'Kebabs'],
    rating: 4.6,
    reviewCount: 4521,
    priceForTwo: 650,
    deliveryTime: 40,
    pickupTime: 20,
    distance: '4.2 km',
    address: '78, Main Rd, Whitefield, Bengaluru 560066',
    area: 'Whitefield',
    isOpen: true,
    isVeg: false,
    hasQuickPick: false,
    offer: '15% off on orders above ₹599',
    tags: ['Premium', 'Top Rated'],
  },
  {
    id: 'r6',
    name: 'Brew & Bites',
    slug: 'brew-and-bites',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop',
    cuisine: ['Cafe', 'Continental', 'Beverages'],
    rating: 4.2,
    reviewCount: 1122,
    priceForTwo: 500,
    deliveryTime: 35,
    pickupTime: 10,
    distance: '1.8 km',
    address: '34, 12th Main, Indiranagar, Bengaluru 560038',
    area: 'Indiranagar',
    isOpen: true,
    isVeg: false,
    hasQuickPick: true,
    pickupCounter: 'Coffee Bar',
    tags: ['Cafe', 'Quick Pickup'],
  },
  {
    id: 'r7',
    name: 'Tandoori Trails',
    slug: 'tandoori-trails',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&h=400&fit=crop',
    cuisine: ['North Indian', 'Tandoor', 'Kebabs'],
    rating: 4.0,
    reviewCount: 789,
    priceForTwo: 700,
    deliveryTime: 45,
    pickupTime: 25,
    distance: '5.1 km',
    address: '90, Brigade Rd, JP Nagar, Bengaluru 560078',
    area: 'JP Nagar',
    isOpen: false,
    isVeg: false,
    hasQuickPick: false,
    tags: ['Premium'],
  },
  {
    id: 'r8',
    name: 'Green Bowl',
    slug: 'green-bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop',
    cuisine: ['Salads', 'Healthy', 'Bowls'],
    rating: 4.3,
    reviewCount: 654,
    priceForTwo: 400,
    deliveryTime: 25,
    pickupTime: 10,
    distance: '2.0 km',
    address: '45, Sector 2, HSR Layout, Bengaluru 560102',
    area: 'HSR Layout',
    isOpen: true,
    isVeg: true,
    hasQuickPick: true,
    pickupCounter: 'Counter 1',
    offer: '10% off on all bowls',
    tags: ['Healthy', 'Pure Veg', 'Quick Pickup'],
  },
];

// ─── Menu Items ──────────────────────────────────────
export const menuItems: MenuItem[] = [
  // Spice Garden
  {
    id: 'm1', restaurantId: 'r1', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with tender chicken, slow-cooked with aromatic spices and saffron.', price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', category: 'Biryani', isVeg: false, rating: 4.5, ratingCount: 342, prepTime: 20, isAvailable: true, isBestseller: true,
    customizations: [
      { id: 'c1', name: 'Portion Size', required: true, maxSelect: 1, options: [{ id: 'o1', name: 'Half', price: 0, isDefault: true }, { id: 'o2', name: 'Full', price: 120 }] },
      { id: 'c2', name: 'Extra', required: false, maxSelect: 2, options: [{ id: 'o3', name: 'Extra Raita', price: 30 }, { id: 'o4', name: 'Extra Gravy', price: 40 }, { id: 'o5', name: 'Boiled Egg', price: 20 }] },
    ],
  },
  {
    id: 'm2', restaurantId: 'r1', name: 'Paneer Butter Masala', description: 'Soft cottage cheese cubes in a rich, creamy tomato-butter gravy with aromatic spices.', price: 249, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', category: 'Main Course', isVeg: true, rating: 4.3, ratingCount: 218, prepTime: 15, isAvailable: true, isBestseller: true,
    customizations: [
      { id: 'c3', name: 'Spice Level', required: true, maxSelect: 1, options: [{ id: 'o6', name: 'Mild', price: 0 }, { id: 'o7', name: 'Medium', price: 0, isDefault: true }, { id: 'o8', name: 'Spicy', price: 0 }] },
    ],
  },
  {
    id: 'm3', restaurantId: 'r1', name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter and cream, rich and hearty.', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', category: 'Main Course', isVeg: true, rating: 4.4, ratingCount: 186, prepTime: 12, isAvailable: true,
  },
  {
    id: 'm4', restaurantId: 'r1', name: 'Garlic Naan', description: 'Soft tandoor-baked flatbread topped with garlic and butter.', price: 59, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', category: 'Breads', isVeg: true, prepTime: 8, isAvailable: true,
  },
  {
    id: 'm5', restaurantId: 'r1', name: 'Chicken Tikka', description: 'Succulent boneless chicken marinated in yogurt and spices, chargrilled in the tandoor.', price: 279, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&h=300&fit=crop', category: 'Starters', isVeg: false, rating: 4.6, ratingCount: 421, prepTime: 18, isAvailable: true, isBestseller: true,
  },
  {
    id: 'm6', restaurantId: 'r1', name: 'Gulab Jamun', description: 'Golden fried milk dumplings soaked in cardamom-infused sugar syrup. Served warm.', price: 99, image: 'https://images.unsplash.com/photo-1666190923928-698a29ea40e0?w=400&h=300&fit=crop', category: 'Desserts', isVeg: true, prepTime: 5, isAvailable: true,
  },
  {
    id: 'm7', restaurantId: 'r1', name: 'Mango Lassi', description: 'Chilled yogurt drink blended with fresh Alphonso mango pulp.', price: 89, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop', category: 'Beverages', isVeg: true, prepTime: 3, isAvailable: true,
  },
  {
    id: 'm8', restaurantId: 'r1', name: 'Mutton Rogan Josh', description: 'Tender mutton pieces cooked in a rich Kashmiri-style red chili and yogurt gravy.', price: 399, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7, ratingCount: 156, prepTime: 25, isAvailable: true,
  },

  // Burger Blast
  {
    id: 'm9', restaurantId: 'r2', name: 'Classic Smash Burger', description: 'Double-smashed beef patty with American cheese, pickles, lettuce, and house sauce.', price: 229, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', category: 'Burgers', isVeg: false, rating: 4.4, ratingCount: 567, prepTime: 12, isAvailable: true, isBestseller: true,
    customizations: [
      { id: 'c4', name: 'Patty', required: true, maxSelect: 1, options: [{ id: 'o9', name: 'Single', price: 0, isDefault: true }, { id: 'o10', name: 'Double', price: 80 }] },
      { id: 'c5', name: 'Add-ons', required: false, maxSelect: 3, options: [{ id: 'o11', name: 'Extra Cheese', price: 30 }, { id: 'o12', name: 'Bacon', price: 50 }, { id: 'o13', name: 'Jalapenos', price: 20 }] },
    ],
  },
  {
    id: 'm10', restaurantId: 'r2', name: 'Crispy Chicken Burger', description: 'Crispy fried chicken thigh with coleslaw and spicy mayo in a brioche bun.', price: 199, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop', category: 'Burgers', isVeg: false, rating: 4.2, ratingCount: 312, prepTime: 10, isAvailable: true,
  },
  {
    id: 'm11', restaurantId: 'r2', name: 'Loaded Fries', description: 'Crispy French fries topped with cheese sauce, bacon bits, and green onions.', price: 149, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', category: 'Sides', isVeg: false, prepTime: 8, isAvailable: true,
  },
  {
    id: 'm12', restaurantId: 'r2', name: 'Oreo Milkshake', description: 'Thick vanilla milkshake blended with crushed Oreo cookies and whipped cream.', price: 159, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', category: 'Beverages', isVeg: true, prepTime: 5, isAvailable: true,
  },
  {
    id: 'm13', restaurantId: 'r2', name: 'Veggie Supreme Burger', description: 'Grilled veggie patty with lettuce, tomato, onion rings, and ranch dressing.', price: 179, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', category: 'Burgers', isVeg: true, rating: 4.0, ratingCount: 145, prepTime: 10, isAvailable: true,
  },

  // Momo Junction
  {
    id: 'm14', restaurantId: 'r3', name: 'Steamed Chicken Momos', description: 'Hand-folded dumplings stuffed with minced chicken and ginger, served with spicy chutney.', price: 149, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop', category: 'Momos', isVeg: false, rating: 4.6, ratingCount: 389, prepTime: 12, isAvailable: true, isBestseller: true,
    customizations: [
      { id: 'c6', name: 'Quantity', required: true, maxSelect: 1, options: [{ id: 'o14', name: '6 pieces', price: 0, isDefault: true }, { id: 'o15', name: '12 pieces', price: 120 }] },
      { id: 'c7', name: 'Dip', required: false, maxSelect: 2, options: [{ id: 'o16', name: 'Extra Chutney', price: 15 }, { id: 'o17', name: 'Mayo Dip', price: 25 }] },
    ],
  },
  {
    id: 'm15', restaurantId: 'r3', name: 'Fried Veg Momos', description: 'Crispy fried vegetable dumplings with a crunchy golden coating.', price: 139, image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop', category: 'Momos', isVeg: true, rating: 4.3, ratingCount: 201, prepTime: 15, isAvailable: true,
  },
  {
    id: 'm16', restaurantId: 'r3', name: 'Thukpa Noodle Soup', description: 'Hearty Tibetan noodle soup with vegetables, chicken, and warming spices.', price: 179, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', category: 'Soups', isVeg: false, prepTime: 18, isAvailable: true,
  },

  // Dosa Corner
  {
    id: 'm17', restaurantId: 'r4', name: 'Masala Dosa', description: 'Crispy golden crepe filled with spiced potato filling, served with sambar and chutney.', price: 99, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', category: 'Dosa', isVeg: true, rating: 4.5, ratingCount: 892, prepTime: 8, isAvailable: true, isBestseller: true,
  },
  {
    id: 'm18', restaurantId: 'r4', name: 'Ghee Roast Dosa', description: 'Extra crispy dosa roasted in pure ghee until golden and crunchy.', price: 119, image: 'https://images.unsplash.com/photo-1668236543090-82eb5eadfeea?w=400&h=300&fit=crop', category: 'Dosa', isVeg: true, rating: 4.4, ratingCount: 567, prepTime: 10, isAvailable: true,
  },
  {
    id: 'm19', restaurantId: 'r4', name: 'Filter Coffee', description: 'Traditional South Indian filter coffee, strong and aromatic.', price: 39, image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop', category: 'Beverages', isVeg: true, prepTime: 3, isAvailable: true,
  },
  {
    id: 'm20', restaurantId: 'r4', name: 'Idli Sambar', description: 'Soft steamed rice cakes with piping hot lentil sambar and coconut chutney.', price: 79, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', category: 'Tiffins', isVeg: true, rating: 4.3, ratingCount: 445, prepTime: 5, isAvailable: true,
  },
  {
    id: 'm21', restaurantId: 'r4', name: 'Medu Vada', description: 'Crispy deep-fried lentil donuts, crunchy outside and fluffy inside.', price: 69, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop', category: 'Tiffins', isVeg: true, prepTime: 8, isAvailable: true,
  },

  // The Biryani House
  {
    id: 'm22', restaurantId: 'r5', name: 'Hyderabadi Dum Biryani', description: 'Slow-cooked Hyderabadi biryani with tender goat meat, fragrant basmati, and whole spices.', price: 399, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', category: 'Biryani', isVeg: false, rating: 4.8, ratingCount: 1230, prepTime: 25, isAvailable: true, isBestseller: true,
    customizations: [
      { id: 'c8', name: 'Size', required: true, maxSelect: 1, options: [{ id: 'o18', name: 'Regular', price: 0, isDefault: true }, { id: 'o19', name: 'Family Pack', price: 250 }] },
    ],
  },
  {
    id: 'm23', restaurantId: 'r5', name: 'Veg Biryani', description: 'Aromatic vegetable biryani with mixed vegetables and paneer pieces.', price: 249, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop', category: 'Biryani', isVeg: true, rating: 4.2, ratingCount: 345, prepTime: 20, isAvailable: true,
  },
  {
    id: 'm24', restaurantId: 'r5', name: 'Seekh Kebab', description: 'Minced lamb kebabs with fresh herbs and spices, grilled on skewers.', price: 329, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&h=300&fit=crop', category: 'Starters', isVeg: false, rating: 4.5, ratingCount: 198, prepTime: 18, isAvailable: true,
  },

  // Brew & Bites
  {
    id: 'm25', restaurantId: 'r6', name: 'Cappuccino', description: 'Rich espresso with steamed milk and a thick layer of velvety foam.', price: 179, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', category: 'Coffee', isVeg: true, rating: 4.3, ratingCount: 234, prepTime: 5, isAvailable: true,
    customizations: [
      { id: 'c9', name: 'Size', required: true, maxSelect: 1, options: [{ id: 'o20', name: 'Regular', price: 0, isDefault: true }, { id: 'o21', name: 'Large', price: 40 }] },
      { id: 'c10', name: 'Milk', required: false, maxSelect: 1, options: [{ id: 'o22', name: 'Oat Milk', price: 30 }, { id: 'o23', name: 'Almond Milk', price: 35 }] },
    ],
  },
  {
    id: 'm26', restaurantId: 'r6', name: 'Avocado Toast', description: 'Sourdough toast with smashed avocado, cherry tomatoes, feta, and chili flakes.', price: 249, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop', category: 'All Day Breakfast', isVeg: true, rating: 4.1, ratingCount: 167, prepTime: 10, isAvailable: true, isBestseller: true,
  },
  {
    id: 'm27', restaurantId: 'r6', name: 'Club Sandwich', description: 'Triple-decker sandwich with grilled chicken, bacon, lettuce, tomato, and mayo.', price: 229, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', category: 'Sandwiches', isVeg: false, prepTime: 12, isAvailable: true,
  },
  {
    id: 'm28', restaurantId: 'r6', name: 'Blueberry Cheesecake', description: 'New York-style baked cheesecake with a blueberry compote topping.', price: 199, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5, ratingCount: 289, prepTime: 3, isAvailable: true,
  },

  // Green Bowl
  {
    id: 'm29', restaurantId: 'r8', name: 'Buddha Bowl', description: 'Quinoa, roasted chickpeas, avocado, sweet potato, kale, and tahini dressing.', price: 279, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', category: 'Bowls', isVeg: true, rating: 4.4, ratingCount: 178, prepTime: 10, isAvailable: true, isBestseller: true,
  },
  {
    id: 'm30', restaurantId: 'r8', name: 'Smoothie Bowl', description: 'Acai and mixed berry smoothie topped with granola, banana, and chia seeds.', price: 229, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', category: 'Bowls', isVeg: true, rating: 4.2, ratingCount: 134, prepTime: 8, isAvailable: true,
  },
];

// ─── Coupons ─────────────────────────────────────────
export const coupons: Coupon[] = [
  { code: 'WELCOME50', description: 'Flat ₹50 off on your first order', discountType: 'flat', discountValue: 50, minOrder: 199 },
  { code: 'QUICKPICK20', description: '20% off on QuickPick orders', discountType: 'percentage', discountValue: 20, minOrder: 299, maxDiscount: 100 },
  { code: 'FOODCART100', description: '₹100 off on orders above ₹499', discountType: 'flat', discountValue: 100, minOrder: 499 },
  { code: 'SAVE15', description: '15% off up to ₹75', discountType: 'percentage', discountValue: 15, minOrder: 249, maxDiscount: 75 },
];

// ─── Sample Orders ───────────────────────────────────
export const sampleOrders: Order[] = [
  {
    id: 'ord1',
    orderNumber: 'FC-4821',
    restaurant: restaurants[0],
    items: [],
    fulfillmentType: 'pickup',
    status: 'preparing',
    subtotal: 548,
    deliveryFee: 0,
    platformFee: 10,
    discount: 50,
    total: 508,
    paymentMethod: 'upi',
    createdAt: '2026-09-26T10:30:00',
    estimatedTime: '12:35 PM',
    pickupCounter: 'Counter 2',
    pickupOtp: '438912',
    qrCode: 'FC-4821-438912',
    statusHistory: [
      { status: 'placed', timestamp: '2026-09-26T10:30:00', message: 'Order placed successfully' },
      { status: 'confirmed', timestamp: '2026-09-26T10:31:00', message: 'Restaurant confirmed your order' },
      { status: 'preparing', timestamp: '2026-09-26T10:33:00', message: 'Your food is being prepared' },
    ],
  },
  {
    id: 'ord2',
    orderNumber: 'FC-4820',
    restaurant: restaurants[1],
    items: [],
    fulfillmentType: 'delivery',
    status: 'delivered',
    subtotal: 428,
    deliveryFee: 35,
    platformFee: 10,
    discount: 0,
    total: 473,
    paymentMethod: 'card',
    createdAt: '2026-09-25T19:15:00',
    estimatedTime: '7:50 PM',
    deliveryAddress: 'Flat 302, Coral Apartments, Koramangala 4th Block',
    statusHistory: [
      { status: 'placed', timestamp: '2026-09-25T19:15:00', message: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-09-25T19:16:00', message: 'Order confirmed' },
      { status: 'preparing', timestamp: '2026-09-25T19:18:00', message: 'Preparing your food' },
      { status: 'out_for_delivery', timestamp: '2026-09-25T19:35:00', message: 'Rider picked up your order' },
      { status: 'delivered', timestamp: '2026-09-25T19:48:00', message: 'Order delivered' },
    ],
  },
  {
    id: 'ord3',
    orderNumber: 'FC-4815',
    restaurant: restaurants[3],
    items: [],
    fulfillmentType: 'pickup',
    status: 'ready',
    subtotal: 218,
    deliveryFee: 0,
    platformFee: 10,
    discount: 50,
    total: 178,
    paymentMethod: 'upi',
    createdAt: '2026-09-26T09:45:00',
    estimatedTime: '10:00 AM',
    pickupCounter: 'Counter 1',
    pickupOtp: '762541',
    qrCode: 'FC-4815-762541',
    statusHistory: [
      { status: 'placed', timestamp: '2026-09-26T09:45:00', message: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-09-26T09:46:00', message: 'Order confirmed' },
      { status: 'preparing', timestamp: '2026-09-26T09:48:00', message: 'Preparing' },
      { status: 'ready', timestamp: '2026-09-26T09:58:00', message: 'Ready for pickup' },
    ],
  },
];

// ─── Sample User ─────────────────────────────────────
export const sampleUser: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@email.com',
  phone: '+91 98765 43210',
  role: 'customer',
  addresses: [
    { id: 'a1', label: 'Home', full: 'Flat 302, Coral Apartments, 4th Block, Koramangala', area: 'Koramangala', city: 'Bengaluru', pincode: '560034', isDefault: true },
    { id: 'a2', label: 'Work', full: '5th Floor, WeWork Galaxy, Residency Rd, Ashok Nagar', area: 'Ashok Nagar', city: 'Bengaluru', pincode: '560025', isDefault: false },
  ],
};

// ─── Cuisine Categories ──────────────────────────────
export const cuisineCategories = [
  { id: 'biryani', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&h=120&fit=crop' },
  { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop' },
  { id: 'pizza', name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop' },
  { id: 'south-indian', name: 'South Indian', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=120&h=120&fit=crop' },
  { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=120&h=120&fit=crop' },
  { id: 'beverages', name: 'Beverages', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&h=120&fit=crop' },
  { id: 'chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=120&h=120&fit=crop' },
  { id: 'healthy', name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop' },
];

// ─── Analytics Data ──────────────────────────────────
export const analyticsData: AnalyticsData[] = [
  { date: 'Mon', orders: 45, revenue: 18500, delivery: 28, pickup: 17 },
  { date: 'Tue', orders: 52, revenue: 21200, delivery: 30, pickup: 22 },
  { date: 'Wed', orders: 48, revenue: 19800, delivery: 25, pickup: 23 },
  { date: 'Thu', orders: 61, revenue: 25400, delivery: 35, pickup: 26 },
  { date: 'Fri', orders: 78, revenue: 32100, delivery: 42, pickup: 36 },
  { date: 'Sat', orders: 95, revenue: 41200, delivery: 50, pickup: 45 },
  { date: 'Sun', orders: 88, revenue: 37800, delivery: 48, pickup: 40 },
];

// ─── Admin Users ─────────────────────────────────────
export const adminUsers: AdminUser[] = [
  { id: 'au1', name: 'Arjun Mehta', email: 'arjun@email.com', role: 'Customer', status: 'active', joinedDate: '2026-01-15', orders: 34 },
  { id: 'au2', name: 'Priya Sharma', email: 'priya@email.com', role: 'Customer', status: 'active', joinedDate: '2026-02-20', orders: 22 },
  { id: 'au3', name: 'Rahul Das', email: 'rahul@email.com', role: 'Partner', status: 'active', joinedDate: '2025-11-10', orders: 0 },
  { id: 'au4', name: 'Sneha Patel', email: 'sneha@email.com', role: 'Customer', status: 'suspended', joinedDate: '2026-03-05', orders: 8 },
  { id: 'au5', name: 'Vikram Singh', email: 'vikram@email.com', role: 'Customer', status: 'active', joinedDate: '2026-04-18', orders: 56 },
  { id: 'au6', name: 'Anita Nair', email: 'anita@email.com', role: 'Partner', status: 'active', joinedDate: '2025-09-25', orders: 0 },
];

// ─── Popular Items (cross-restaurant) ────────────────
export const popularItems = menuItems.filter((m) => m.isBestseller);

// ─── Helper: get menu items for a restaurant ─────────
export const getMenuByRestaurant = (restaurantId: string) =>
  menuItems.filter((m) => m.restaurantId === restaurantId);

export const getMenuCategories = (restaurantId: string) => {
  const items = getMenuByRestaurant(restaurantId);
  const categories = [...new Set(items.map((i) => i.category))];
  return categories;
};

export const getRestaurant = (id: string) =>
  restaurants.find((r) => r.id === id);
