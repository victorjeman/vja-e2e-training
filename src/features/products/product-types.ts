import type { Category, Product } from "@backend/db/schema";

export type ProductItem = Product;
export type ProductCategory = Category;

export type ProductSortValue = "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest";

export interface ProductFilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  q: string;
  brands: string[];
  colors: string[];
  minRating: number;
  inStockOnly: boolean;
  sort: ProductSortValue;
  page: number;
}
