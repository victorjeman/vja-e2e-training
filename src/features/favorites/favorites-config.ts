import { ROUTES } from "@/shared/routes";

// All favorites-page display copy + routes in one place (as const).
export const FAVORITES_CONFIG = {
  text: {
    heading: "My Favorites",
    subtitle: "Products you have favorited. Toggle the heart to remove one.",
    navLabel: "Favorites",
    emptyTitle: "No favorites yet",
    emptyMessage: "You have not favorited any products. Browse the catalog and tap the heart to save one.",
    browseCta: "Browse products",
  },
  routes: {
    products: ROUTES.products,
  },
} as const;
