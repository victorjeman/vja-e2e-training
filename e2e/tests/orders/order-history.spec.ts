import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      user-with-orders  (e2e user, catalog, ONE confirmed order with two
 *            curated items: p-elec-2 "Wireless Headphones" + p-book-1 "Mystery
 *            Novel", each qty 1 at catalog price; empty cart, no favorites)
 * Route:     /orders  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 * TestIds:   orders-page (the container), orders-list (the list wrapper),
 *            order-card (one per order, each carries data-order-id="<order.id>"),
 *            order-total (per-card total), orders-empty (empty-state, links to /products).
 */

test.describe("order history", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("user-with-orders");
  });

  test("lists the user's placed orders", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("shows each order's items and total", async ({ page }) => {
    /* TODO: students write steps */
  });
});
