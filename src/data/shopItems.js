// Shop items — prices in US cents, all multiples of 5
export const ITEM_POOL = [
  // Food & Drinks
  { id: 'apple',         name: 'Apple',           emoji: '🍎', category: 'food',   priceRange: [25,  75]  },
  { id: 'banana',        name: 'Banana',           emoji: '🍌', category: 'food',   priceRange: [25,  50]  },
  { id: 'cookie',        name: 'Cookie',           emoji: '🍪', category: 'food',   priceRange: [25,  75]  },
  { id: 'juice_box',     name: 'Juice Box',        emoji: '🧃', category: 'food',   priceRange: [50,  125] },
  { id: 'water_bottle',  name: 'Water Bottle',     emoji: '💧', category: 'food',   priceRange: [75,  150] },
  { id: 'chocolate',     name: 'Chocolate Bar',    emoji: '🍫', category: 'food',   priceRange: [75,  200] },
  { id: 'ice_cream',     name: 'Ice Cream',        emoji: '🍦', category: 'food',   priceRange: [100, 250] },
  { id: 'lollipop',      name: 'Lollipop',         emoji: '🍭', category: 'food',   priceRange: [25,  75]  },
  { id: 'muffin',        name: 'Muffin',           emoji: '🧁', category: 'food',   priceRange: [100, 200] },
  { id: 'sandwich',      name: 'Sandwich',         emoji: '🥪', category: 'food',   priceRange: [150, 350] },
  // School supplies
  { id: 'pencil',        name: 'Pencil',           emoji: '✏️', category: 'school', priceRange: [25,  75]  },
  { id: 'eraser',        name: 'Eraser',           emoji: '🧹', category: 'school', priceRange: [25,  75]  },
  { id: 'ruler',         name: 'Ruler',            emoji: '📏', category: 'school', priceRange: [50,  150] },
  { id: 'notebook',      name: 'Notebook',         emoji: '📓', category: 'school', priceRange: [100, 300] },
  { id: 'crayons',       name: 'Crayons',          emoji: '🖍️', category: 'school', priceRange: [150, 400] },
  { id: 'glue_stick',    name: 'Glue Stick',       emoji: '🖊️', category: 'school', priceRange: [75,  150] },
  { id: 'sharpener',     name: 'Pencil Sharpener', emoji: '🔑', category: 'school', priceRange: [50,  100] },
  // Toys & Fun
  { id: 'sticker_pack',  name: 'Sticker Pack',     emoji: '⭐', category: 'fun',    priceRange: [75,  250] },
  { id: 'balloon',       name: 'Balloon',          emoji: '🎈', category: 'fun',    priceRange: [25,  75]  },
  { id: 'yo_yo',         name: 'Yo-Yo',            emoji: '🪀', category: 'fun',    priceRange: [100, 300] },
  { id: 'toy_car',       name: 'Toy Car',          emoji: '🚗', category: 'fun',    priceRange: [200, 500] },
  { id: 'bookmark',      name: 'Bookmark',         emoji: '🔖', category: 'fun',    priceRange: [25,  100] },
  // Grocery
  { id: 'bread',         name: 'Bread Loaf',       emoji: '🍞', category: 'grocery', priceRange: [200, 400] },
  { id: 'biscuits',      name: 'Biscuit Pack',     emoji: '🍘', category: 'grocery', priceRange: [100, 250] },
  { id: 'sweets_bag',    name: 'Sweets Bag',       emoji: '🍬', category: 'grocery', priceRange: [75,  200] },
  { id: 'tissue_pack',   name: 'Tissue Pack',      emoji: '🧻', category: 'grocery', priceRange: [100, 200] },
];

export function roundToFiveCents(amount) {
  return Math.round(amount / 5) * 5;
}

export function getRandomItem(rng, usedIds = new Set()) {
  const available = ITEM_POOL.filter(i => !usedIds.has(i.id));
  const pool = available.length > 0 ? available : ITEM_POOL;
  const item = pool[Math.floor(rng() * pool.length)];
  const [min, max] = item.priceRange;
  const steps = Math.floor((max - min) / 5);
  const rawPrice = min + Math.floor(rng() * (steps + 1)) * 5;
  return { ...item, price: Math.min(rawPrice, 995) };
}
