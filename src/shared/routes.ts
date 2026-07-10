// Route + API path constants.
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  products: "/products",
  favorites: "/favorites",
  cart: "/cart",
  orders: "/orders",
} as const;

// Detail path for a single product. Kept as a separate helper so ROUTES stays a
// flat `as const` string map.
export const productDetailPath = (id: string) => `/products/${id}`;

export const API = {
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  products: "/api/products",
  favorites: "/api/favorites",
  cart: "/api/cart",
  cartItem: (productId: string) => `/api/cart/${productId}`,
  orders: "/api/orders",
  testSeed: "/api/test/seed",
} as const;
