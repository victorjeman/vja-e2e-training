import { db } from "../db/client";
import { categories, products, type Category, type Product } from "../db/schema";

export type ProductSort = "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest";

export interface ListProductsFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  brand?: string[]; // multi-select, OR within
  color?: string[]; // multi-select, OR within
  minRating?: number;
  inStock?: boolean;
  sort?: ProductSort;
}

function toLowerSet(values?: string[]): Set<string> | null {
  if (!values || values.length === 0) return null;
  const cleaned = values.map((v) => v.trim().toLowerCase()).filter(Boolean);
  return cleaned.length ? new Set(cleaned) : null;
}

// Filters the full catalog server-side, then sorts. All filters combine with AND;
// brand/color are OR within themselves.
export function listProducts(filter: ListProductsFilter = {}): Product[] {
  const all = db.select().from(products).all();
  const q = filter.q?.trim().toLowerCase();
  const brands = toLowerSet(filter.brand);
  const colors = toLowerSet(filter.color);

  const filtered = all.filter((p) => {
    if (filter.category && filter.category !== "all" && p.categoryId !== filter.category) return false;
    if (filter.minPrice != null && p.price < filter.minPrice) return false;
    if (filter.maxPrice != null && p.price > filter.maxPrice) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (brands && !brands.has(p.brand.toLowerCase())) return false;
    if (colors && !colors.has(p.color.toLowerCase())) return false;
    if (filter.minRating != null && p.rating < filter.minRating) return false;
    if (filter.inStock && p.inStock !== 1) return false;
    return true;
  });

  return sortProducts(filtered, filter.sort ?? "featured");
}

function sortProducts(list: Product[], sort: ProductSort): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      // Generated ids sort after curated; reverse id order approximates "newest".
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case "featured":
    default:
      // Stable: keep catalog order (curated first, then generated).
      break;
  }
  return sorted;
}

export function listCategories(): Category[] {
  return db.select().from(categories).all();
}

// Distinct brand values present in the catalog, alphabetically sorted.
export function listBrands(): string[] {
  const rows = db.select({ brand: products.brand }).from(products).all();
  return [...new Set(rows.map((r) => r.brand))].sort((a, b) => a.localeCompare(b));
}

// Distinct color values present in the catalog, alphabetically sorted.
export function listColors(): string[] {
  const rows = db.select({ color: products.color }).from(products).all();
  return [...new Set(rows.map((r) => r.color))].sort((a, b) => a.localeCompare(b));
}
