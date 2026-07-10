import { PRODUCT_CONFIG } from "../product-config";
import type { ProductFilterState, ProductItem, ProductSortValue } from "../product-types";

// Client-side mirror of the server filter: category, inclusive price range,
// case-insensitive name search, plus brand (any-of), color (any-of), minRating,
// and in-stock-only. Sorting matches the server order.
export function productFilter(items: ProductItem[], state: ProductFilterState): ProductItem[] {
  const q = state.q.trim().toLowerCase();
  const min = state.minPrice.trim() === "" ? null : Number(state.minPrice);
  const max = state.maxPrice.trim() === "" ? null : Number(state.maxPrice);
  const brands = toLowerSet(state.brands);
  const colors = toLowerSet(state.colors);

  const filtered = items.filter((p) => {
    if (state.category !== PRODUCT_CONFIG.categoryAllValue && p.categoryId !== state.category) return false;
    if (min != null && !Number.isNaN(min) && p.price < min) return false;
    if (max != null && !Number.isNaN(max) && p.price > max) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (brands && !brands.has(p.brand.toLowerCase())) return false;
    if (colors && !colors.has(p.color.toLowerCase())) return false;
    if (state.minRating > 0 && p.rating < state.minRating) return false;
    if (state.inStockOnly && p.inStock !== 1) return false;
    return true;
  });

  return productSort(filtered, state.sort);
}

function toLowerSet(values: string[]): Set<string> | null {
  const cleaned = values.map((v) => v.trim().toLowerCase()).filter(Boolean);
  return cleaned.length ? new Set(cleaned) : null;
}

function productSort(list: ProductItem[], sort: ProductSortValue): ProductItem[] {
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
      // Keep catalog order (curated first, then generated).
      break;
  }
  return sorted;
}
