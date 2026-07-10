import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            About 11% of the catalog is out of stock; out-of-stock cards show an
 *            "Out of stock" state. The 24 curated products are all in stock.
 * TestIds:   in-stock-filter (a checkbox). When checked, only in-stock products
 *            remain; it combines with the other filters and resets pagination
 *            to page 1.
 */

test.describe("in-stock filter", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("shows only in-stock products when checked", async ({ page }) => {
    /* TODO: students write steps */
  });
});
