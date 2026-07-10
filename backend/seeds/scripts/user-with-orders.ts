import { clearUsers, ensureCatalog, createUser, addOrder } from "../helpers";
import { E2E_USER } from "../e2e-fixtures";
import { PRODUCTS } from "../catalog";

// The two products that make up the seeded order (curated ids, stable prices).
const ORDER_PRODUCT_IDS = ["p-elec-2", "p-book-1"] as const;

function catalogPrice(productId: string): number {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) throw new Error(`user-with-orders references unknown product id: ${productId}`);
  return product.price;
}

// user-with-orders: e2e user, catalog, ONE confirmed order with two curated
// items (priced at catalog price), empty cart, no favorites.
export function seedUserWithOrders(): void {
  clearUsers();
  ensureCatalog();
  const userId = createUser({ ...E2E_USER });
  addOrder(
    userId,
    ORDER_PRODUCT_IDS.map((productId) => ({
      productId,
      qty: 1,
      price: catalogPrice(productId),
    })),
    { status: "confirmed" }
  );
}
