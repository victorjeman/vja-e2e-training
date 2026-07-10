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
    reviewsLabel: "reviews",
    brandLabel: "Brand",
    colorLabel: "Color",
    ratingLabel: "Rating",
    inStockLabel: "In stock only",
    sortLabel: "Sort by",
    outOfStock: "Out of stock",
    prev: "Previous",
    next: "Next",
    goToPage: "Go to page",
    // results-count text is built as `${count} ${resultsSuffix}` (singular/plural handled in code).
    resultsSuffixSingular: "product",
    resultsSuffixPlural: "products",
    pageInfo: "Page", // used as `${pageInfo} X of Y`
    ratingAny: "Any rating",
  },
  ratingOptions: [
    { value: 4, label: "4+ stars" },
    { value: 3, label: "3+ stars" },
    { value: 2, label: "2+ stars" },
  ],
  sortOptions: [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Top rated" },
    { value: "newest", label: "Newest" },
  ] as const,
  defaultSort: "featured",
  pageSize: 12,
  badges: {
    new: "New",
    trending: "Trending",
  },
  home: {
    heroBadge: "New season, fresh picks",
    heroTitle: "Everything you need, delivered fast.",
    heroSubtitle:
      "Shop electronics, clothing, books and home essentials in one place, with free shipping on every order.",
    heroCta: "Shop products",
    heroSecondaryCta: "Browse categories",
    heroShipping: "Free shipping and easy 30-day returns.",
    heroImageId: "p-elec-2",
    categoriesTitle: "Shop by category",
    categoriesSubtitle: "Find what you are looking for across four curated departments.",
    popularTitle: "Popular products",
    popularSubtitle: "Trending picks our shoppers love this week.",
    popularCta: "View all products",
  },
  // Representative product photo per category for the home "Shop by category" grid.
  categoryImages: {
    electronics: "p-elec-1",
    clothing: "p-cloth-3",
    books: "p-book-1",
    home: "p-home-1",
  } as Record<string, string>,
  categoryAllValue: "all",
  api: {
    products: API.products,
    favorites: API.favorites,
    cart: API.cart,
  },
} as const;
