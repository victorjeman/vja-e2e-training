// SOURCE OF TRUTH for catalog data. Imported by helpers/seeds/services.
// 4 categories. 24 curated products (guarded ids/names/prices) + generated ones
// to reach 500 total. Generation is deterministic (index-seeded RNG, no
// Math.random/Date.now at module load) so seeds are reproducible.

export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SeedProduct {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  image: string;
  imageUrl: string;
  description: string;
  brand: string;
  rating: number;
  reviewCount: number;
  color: string;
  inStock: number; // 0 | 1
  discountPercent: number; // 0,10,15,20,25,30
}

export const CATEGORIES: SeedCategory[] = [
  { id: "electronics", name: "Electronics", slug: "electronics" },
  { id: "clothing", name: "Clothing", slug: "clothing" },
  { id: "books", name: "Books", slug: "books" },
  { id: "home", name: "Home & Kitchen", slug: "home" },
];

export const COLORS = ["Black", "White", "Silver", "Blue", "Red", "Green", "Beige", "Gray"] as const;

// The 24 curated products. Ids/names/prices/categoryId are guarded by e2e-fixtures.
// Attributes below are plausible fixed values; imageUrl points to the local photo.
export const PRODUCTS: SeedProduct[] = [
  // Electronics
  { id: "p-elec-1", name: "Gaming Laptop", price: 1199, categoryId: "electronics", image: "💻", imageUrl: "/products/p-elec-1.jpg", description: "High-performance laptop for gaming and work.", brand: "Dell", rating: 4.7, reviewCount: 1842, color: "Black", inStock: 1, discountPercent: 10 },
  { id: "p-elec-2", name: "Wireless Headphones", price: 149, categoryId: "electronics", image: "🎧", imageUrl: "/products/p-elec-2.jpg", description: "Noise-cancelling over-ear headphones.", brand: "Bose", rating: 4.5, reviewCount: 980, color: "Black", inStock: 1, discountPercent: 15 },
  { id: "p-elec-3", name: "Smartphone", price: 799, categoryId: "electronics", image: "📱", imageUrl: "/products/p-elec-3.jpg", description: "Latest-generation smartphone.", brand: "Apple", rating: 4.8, reviewCount: 3251, color: "Silver", inStock: 1, discountPercent: 0 },
  { id: "p-elec-4", name: "USB-C Cable", price: 12, categoryId: "electronics", image: "🔌", imageUrl: "/products/p-elec-4.jpg", description: "Durable braided charging cable.", brand: "Anker", rating: 4.3, reviewCount: 540, color: "White", inStock: 1, discountPercent: 0 },
  { id: "p-elec-5", name: "Smart Watch", price: 249, categoryId: "electronics", image: "⌚", imageUrl: "/products/p-elec-5.jpg", description: "Fitness and notifications on your wrist.", brand: "Samsung", rating: 4.4, reviewCount: 1120, color: "Black", inStock: 1, discountPercent: 20 },
  { id: "p-elec-6", name: "Bluetooth Speaker", price: 89, categoryId: "electronics", image: "🔊", imageUrl: "/products/p-elec-6.jpg", description: "Portable speaker with deep bass.", brand: "Sony", rating: 4.2, reviewCount: 760, color: "Blue", inStock: 1, discountPercent: 0 },
  // Clothing
  { id: "p-cloth-1", name: "Cotton T-Shirt", price: 19, categoryId: "clothing", image: "👕", imageUrl: "/products/p-cloth-1.jpg", description: "Soft everyday cotton tee.", brand: "Uniqlo", rating: 4.1, reviewCount: 430, color: "White", inStock: 1, discountPercent: 0 },
  { id: "p-cloth-2", name: "Denim Jeans", price: 59, categoryId: "clothing", image: "👖", imageUrl: "/products/p-cloth-2.jpg", description: "Classic slim-fit denim jeans.", brand: "Levi's", rating: 4.4, reviewCount: 890, color: "Blue", inStock: 1, discountPercent: 15 },
  { id: "p-cloth-3", name: "Running Shoes", price: 99, categoryId: "clothing", image: "👟", imageUrl: "/products/p-cloth-3.jpg", description: "Lightweight cushioned running shoes.", brand: "Nike", rating: 4.6, reviewCount: 1540, color: "Red", inStock: 1, discountPercent: 10 },
  { id: "p-cloth-4", name: "Wool Sweater", price: 79, categoryId: "clothing", image: "🧥", imageUrl: "/products/p-cloth-4.jpg", description: "Warm knitted wool sweater.", brand: "Zara", rating: 4.0, reviewCount: 210, color: "Gray", inStock: 1, discountPercent: 0 },
  { id: "p-cloth-5", name: "Baseball Cap", price: 15, categoryId: "clothing", image: "🧢", imageUrl: "/products/p-cloth-5.jpg", description: "Adjustable cotton cap.", brand: "Adidas", rating: 4.2, reviewCount: 320, color: "Black", inStock: 1, discountPercent: 0 },
  { id: "p-cloth-6", name: "Winter Jacket", price: 189, categoryId: "clothing", image: "🧥", imageUrl: "/products/p-cloth-6.jpg", description: "Insulated waterproof winter jacket.", brand: "Puma", rating: 4.5, reviewCount: 670, color: "Green", inStock: 1, discountPercent: 25 },
  // Books
  { id: "p-book-1", name: "Mystery Novel", price: 14, categoryId: "books", image: "📕", imageUrl: "/products/p-book-1.jpg", description: "A gripping detective mystery novel.", brand: "Penguin", rating: 4.3, reviewCount: 1230, color: "Red", inStock: 1, discountPercent: 0 },
  { id: "p-book-2", name: "Science Fiction Novel", price: 18, categoryId: "books", image: "📘", imageUrl: "/products/p-book-2.jpg", description: "An epic space-faring sci-fi novel.", brand: "Vintage", rating: 4.6, reviewCount: 2010, color: "Blue", inStock: 1, discountPercent: 10 },
  { id: "p-book-3", name: "Cookbook", price: 29, categoryId: "books", image: "📗", imageUrl: "/products/p-book-3.jpg", description: "Recipes for everyday home cooking.", brand: "Harper", rating: 4.4, reviewCount: 560, color: "Green", inStock: 1, discountPercent: 0 },
  { id: "p-book-4", name: "History Textbook", price: 65, categoryId: "books", image: "📚", imageUrl: "/products/p-book-4.jpg", description: "Comprehensive world history reference.", brand: "O'Reilly", rating: 4.1, reviewCount: 180, color: "Beige", inStock: 1, discountPercent: 0 },
  { id: "p-book-5", name: "Poetry Collection", price: 11, categoryId: "books", image: "📖", imageUrl: "/products/p-book-5.jpg", description: "A curated collection of modern poetry.", brand: "Penguin", rating: 4.0, reviewCount: 95, color: "White", inStock: 1, discountPercent: 0 },
  { id: "p-book-6", name: "Programming Guide", price: 45, categoryId: "books", image: "📙", imageUrl: "/products/p-book-6.jpg", description: "Hands-on guide to software development.", brand: "O'Reilly", rating: 4.7, reviewCount: 1470, color: "Black", inStock: 1, discountPercent: 20 },
  // Home & Kitchen
  { id: "p-home-1", name: "Coffee Maker", price: 89, categoryId: "home", image: "☕", imageUrl: "/products/p-home-1.jpg", description: "Drip coffee maker with timer.", brand: "Philips", rating: 4.3, reviewCount: 640, color: "Black", inStock: 1, discountPercent: 15 },
  { id: "p-home-2", name: "Chef's Knife", price: 49, categoryId: "home", image: "🔪", imageUrl: "/products/p-home-2.jpg", description: "Stainless steel all-purpose knife.", brand: "Cuisinart", rating: 4.5, reviewCount: 820, color: "Silver", inStock: 1, discountPercent: 0 },
  { id: "p-home-3", name: "Cookware Set", price: 199, categoryId: "home", image: "🍳", imageUrl: "/products/p-home-3.jpg", description: "Non-stick pots and pans set.", brand: "KitchenAid", rating: 4.4, reviewCount: 510, color: "Gray", inStock: 1, discountPercent: 20 },
  { id: "p-home-4", name: "Table Lamp", price: 39, categoryId: "home", image: "💡", imageUrl: "/products/p-home-4.jpg", description: "Adjustable LED desk lamp.", brand: "IKEA", rating: 4.1, reviewCount: 300, color: "White", inStock: 1, discountPercent: 0 },
  { id: "p-home-5", name: "Throw Pillow", price: 25, categoryId: "home", image: "🛋️", imageUrl: "/products/p-home-5.jpg", description: "Soft decorative throw pillow.", brand: "IKEA", rating: 4.0, reviewCount: 150, color: "Beige", inStock: 1, discountPercent: 0 },
  { id: "p-home-6", name: "Stand Mixer", price: 349, categoryId: "home", image: "🍰", imageUrl: "/products/p-home-6.jpg", description: "Powerful kitchen stand mixer.", brand: "KitchenAid", rating: 4.8, reviewCount: 2230, color: "Red", inStock: 1, discountPercent: 25 },
];

// --- Deterministic generator (adds products up to TARGET_TOTAL) ---

// Small seeded RNG (LCG). Seeded per product index so output is reproducible.
function makeRng(seed: number): () => number {
  let s = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const DISCOUNTS = [0, 0, 0, 0, 0, 10, 15, 20, 25, 30]; // weighted toward no discount

interface CategoryMeta {
  slug: string;
  emojis: string[];
  brands: string[];
  adjectives: string[];
  nouns: string[];
  priceMin: number;
  priceMax: number;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  electronics: {
    slug: "electronics",
    emojis: ["💻", "📱", "🎧", "⌚", "🔊", "🖥️", "🖱️", "⌨️"],
    brands: ["Sony", "Apple", "Samsung", "Dell", "Logitech", "Anker", "Bose"],
    adjectives: ["Pro", "Ultra", "Wireless", "Compact", "Smart", "Portable", "HD", "Max"],
    nouns: ["Monitor", "Keyboard", "Mouse", "Charger", "Earbuds", "Tablet", "Webcam", "Router", "Drive", "Power Bank", "Speaker", "Headset"],
    priceMin: 15,
    priceMax: 2500,
  },
  clothing: {
    slug: "clothing",
    emojis: ["👕", "👖", "👟", "🧥", "🧢", "🧦", "👗", "🩳"],
    brands: ["Nike", "Adidas", "Levi's", "Uniqlo", "Zara", "Puma"],
    adjectives: ["Classic", "Slim", "Relaxed", "Vintage", "Athletic", "Cozy", "Everyday", "Premium"],
    nouns: ["T-Shirt", "Hoodie", "Jacket", "Sneakers", "Shorts", "Sweater", "Cap", "Socks", "Dress", "Jeans", "Coat", "Scarf"],
    priceMin: 10,
    priceMax: 320,
  },
  books: {
    slug: "books",
    emojis: ["📕", "📘", "📗", "📚", "📖", "📙", "📔", "📓"],
    brands: ["Penguin", "O'Reilly", "Vintage", "Harper"],
    adjectives: ["Illustrated", "Annotated", "Collected", "Essential", "Complete", "Pocket", "Modern", "Classic"],
    nouns: ["Novel", "Guide", "Textbook", "Cookbook", "Biography", "Anthology", "Handbook", "Journal", "Atlas", "Memoir", "Thriller", "Reference"],
    priceMin: 5,
    priceMax: 95,
  },
  home: {
    slug: "home",
    emojis: ["☕", "🔪", "🍳", "💡", "🛋️", "🍰", "🧹", "🪑"],
    brands: ["IKEA", "Cuisinart", "KitchenAid", "Philips", "Dyson"],
    adjectives: ["Deluxe", "Compact", "Nonstick", "Cordless", "Ceramic", "Stainless", "Ergonomic", "Premium"],
    nouns: ["Blender", "Toaster", "Kettle", "Lamp", "Vacuum", "Cutlery Set", "Cookware Set", "Air Fryer", "Cushion", "Organizer", "Mixer", "Grill"],
    priceMin: 20,
    priceMax: 600,
  },
};

const TARGET_TOTAL = 500;
const GENERATED_COUNT = TARGET_TOTAL - PRODUCTS.length; // 476

function generateProducts(): SeedProduct[] {
  const out: SeedProduct[] = [];
  const categoryIds = CATEGORIES.map((c) => c.id);
  // Spread generated products evenly across categories, round-robin so ids stay
  // globally sequential and category assignment is deterministic.
  for (let i = 0; i < GENERATED_COUNT; i++) {
    const n = i + 1; // 1-based
    const rng = makeRng(n * 2654435761);
    const categoryId = categoryIds[i % categoryIds.length];
    const meta = CATEGORY_META[categoryId];
    const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

    const brand = pick(meta.brands);
    const adjective = pick(meta.adjectives);
    const noun = pick(meta.nouns);
    const price = Math.round(meta.priceMin + rng() * (meta.priceMax - meta.priceMin));
    const rating = Math.round((3 + rng() * 2) * 10) / 10;
    const reviewCount = Math.floor(rng() * 5001);
    const color = pick(COLORS);
    const inStock = rng() < 0.12 ? 0 : 1; // ~12% out of stock
    const discountPercent = pick(DISCOUNTS);
    const emoji = pick(meta.emojis);
    // Local pool image, cycled 1..15 within the category.
    const poolIndex = (i % 15) + 1;
    const id = `p-gen-${String(n).padStart(4, "0")}`;

    out.push({
      id,
      name: `${brand} ${adjective} ${noun}`,
      price,
      categoryId,
      image: emoji,
      imageUrl: `/products/pool-${meta.slug}-${poolIndex}.jpg`,
      description: `${adjective} ${noun.toLowerCase()} by ${brand}.`,
      brand,
      rating,
      reviewCount,
      color,
      inStock,
      discountPercent,
    });
  }
  return out;
}

export const GENERATED_PRODUCTS: SeedProduct[] = generateProducts();

// The full catalog inserted by ensureCatalog. Curated first, then generated.
export const ALL_PRODUCTS: SeedProduct[] = [...PRODUCTS, ...GENERATED_PRODUCTS];
