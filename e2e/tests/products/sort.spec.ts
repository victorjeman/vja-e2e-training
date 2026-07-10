import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Wide price spread (~$6 to ~$2497) so sort order is observable.
 * TestIds:   sort-select (options: featured, price-asc, price-desc, rating-desc,
 *            newest), results-count (text: number of products matching the
 *            current filters). Sorting does not change the count, only the order;
 *            it resets pagination to page 1.
 */

test.describe("sort", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("orders products by price ascending", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("orders products by price descending", async ({ page }) => {
    /* TODO: students write steps */
  });
});
