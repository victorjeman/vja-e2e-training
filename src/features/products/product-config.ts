import { API } from "@/shared/routes";

// All product-feature text + API paths in one place (as const).
export const PRODUCT_CONFIG = {
  text: {
    heading: "Products",
    subtitle: "Browse the catalog, filter and search, then add items to your cart.",
    filtersLabel: "Filters",
    searchPlaceholder: "Search products...",
    categoryLabel: "Category",
    categoryAll: "All",
    priceLabel: "Price range",
    priceMinLabel: "Min price",
    priceMaxLabel: "Max price",
    priceMinPlaceholder: "Min",
    priceMaxPlaceholder: "Max",
    clearFilters: "Clear filters",
    noResultsTitle: "No products found",
    noResults: "No products match your filters.",
    addToCart: "Add to cart",
    favorite: "Favorite",
  },
  categoryAllValue: "all",
  api: {
    products: API.products,
    favorites: API.favorites,
    cart: API.cart,
  },
} as const;
