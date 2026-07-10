import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            500 products, 12 shown per page, so there are many pages.
 * TestIds:   pagination (the control), pagination-prev, pagination-next,
 *            pagination-page (each carries data-page="<n>"), page-info (text like
 *            "Page 1 of N"). Applying any filter resets to page 1.
 */

test.describe("pagination", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("shows 12 products per page", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("moves to the next page", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("jumps to a specific page via its page number", async ({ page }) => {
    /* TODO: students write steps */
  });
});
