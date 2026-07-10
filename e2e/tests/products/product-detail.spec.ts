import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products/<id>  (log in as the e2e user first). Reach it either by
 *            clicking a card's product-link on /products, or by going directly to
 *            /products/p-elec-1 (curated "Gaming Laptop", brand Dell).
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Curated example: "p-elec-1" (Gaming Laptop, brand Dell).
 * TestIds:   product-link (the card's image link; carries data-product-id),
 *            product-detail (the page container), product-detail-name,
 *            product-detail-price, product-detail-description, add-to-cart-btn
 *            (carries data-product-id), favorite-btn (carries data-active),
 *            product-detail-back (link back to /products).
 */

test.describe("product detail", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("opens a product's detail page from the list", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("adds the product to the cart from its detail page", async ({ page }) => {
    /* TODO: students write steps */
  });
});
