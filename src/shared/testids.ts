// All data-testid string constants (CONTRACT §5). Use these exact strings everywhere.
export const TESTIDS = {
  // Auth
  registerForm: "register-form",
  registerNameInput: "register-name-input",
  registerEmailInput: "register-email-input",
  registerPasswordInput: "register-password-input",
  registerBtn: "register-btn",
  emailError: "email-error",
  passwordError: "password-error",
  loginForm: "login-form",
  loginEmailInput: "login-email-input",
  loginPasswordInput: "login-password-input",
  loginBtn: "login-btn",
  loginError: "login-error",
  logoutBtn: "logout-btn",
  // Products
  productList: "product-list",
  productCard: "product-card",
  favoriteBtn: "favorite-btn",
  addToCartBtn: "add-to-cart-btn",
  categoryFilter: "category-filter",
  categoryOptionAll: "category-option-all",
  categoryOptionElectronics: "category-option-electronics",
  categoryOptionClothing: "category-option-clothing",
  categoryOptionBooks: "category-option-books",
  categoryOptionHome: "category-option-home",
  priceFilter: "price-filter",
  priceMinInput: "price-min-input",
  priceMaxInput: "price-max-input",
  searchInput: "search-input",
  clearFiltersBtn: "clear-filters-btn",
  noResultsMessage: "no-results-message",
  // Advanced filters (added in the catalog expansion)
  brandFilter: "brand-filter",
  brandOption: "brand-option", // carries data-brand="<name>"
  colorFilter: "color-filter",
  colorOption: "color-option", // carries data-color="<name>"
  ratingFilter: "rating-filter",
  ratingOption: "rating-option", // carries data-rating="<min>"
  inStockFilter: "in-stock-filter", // checkbox: only in-stock products
  sortSelect: "sort-select",
  resultsCount: "results-count", // text: number of products matching current filters
  // Pagination
  pagination: "pagination",
  paginationPrev: "pagination-prev",
  paginationNext: "pagination-next",
  paginationPage: "pagination-page", // carries data-page="<n>"
  pageInfo: "page-info",
  // Favorites page
  favoritesLink: "favorites-link",
  favoritesPage: "favorites-page",
  favoritesList: "favorites-list",
  favoritesEmpty: "favorites-empty",
  // Cart
  cartLink: "cart-link",
  cartCount: "cart-count",
  cartPage: "cart-page",
  removeCartItemBtn: "remove-cart-item-btn",
  checkoutBtn: "checkout-btn",
  orderSuccessMessage: "order-success-message",
  cartError: "cart-error",
  // Orders
  ordersLink: "orders-link",
  ordersPage: "orders-page",
  ordersList: "orders-list",
  orderCard: "order-card",
  orderTotal: "order-total",
  ordersEmpty: "orders-empty",
} as const;

export type TestId = (typeof TESTIDS)[keyof typeof TESTIDS];
