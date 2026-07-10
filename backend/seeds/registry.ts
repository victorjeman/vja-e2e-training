import { seedBase } from "./scripts/base";
import { seedResetUsers } from "./scripts/reset-users";
import { seedUserRegistered } from "./scripts/user-registered";
import { seedUserEmptyCart } from "./scripts/user-empty-cart";
import { seedUserCartHasItems } from "./scripts/user-cart-has-items";
import { seedUserNoFavorites } from "./scripts/user-no-favorites";
import { seedUserHasFavorites } from "./scripts/user-has-favorites";
import { seedUserWithOrders } from "./scripts/user-with-orders";
import { seedCatalogDefault } from "./scripts/catalog-default";
import { seedCatalogSearchMatch } from "./scripts/catalog-search-match";
import { seedCatalogNoMatch } from "./scripts/catalog-no-match";

// Maps seed name -> seed fn. Keep entries easy to extend.
export const seedRegistry: Record<string, () => void> = {
  base: seedBase,
  "reset-users": seedResetUsers,
  "user-registered": seedUserRegistered,
  "user-empty-cart": seedUserEmptyCart,
  "user-cart-has-items": seedUserCartHasItems,
  "user-no-favorites": seedUserNoFavorites,
  "user-has-favorites": seedUserHasFavorites,
  "user-with-orders": seedUserWithOrders,
  "catalog-default": seedCatalogDefault,
  "catalog-search-match": seedCatalogSearchMatch,
  "catalog-no-match": seedCatalogNoMatch,
};
