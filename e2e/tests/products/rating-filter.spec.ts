import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Products carry a rating from 3.0 to 5.0. Curated examples:
 *            "p-elec-3" (Smartphone, 4.8), "p-home-6" (Stand Mixer, 4.8),
 *            "p-cloth-4" (Wool Sweater, 4.0).
 * TestIds:   rating-filter (the panel), rating-option (each carries
 *            data-rating="<min>", e.g. data-rating="4" means "4+ stars").
 *            Selecting a minimum rating keeps only products at or above it;
 *            it combines with the other filters and resets pagination to page 1.
 */

test.describe("rating filter", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("keeps only products at or above the selected rating", async ({ page }) => {
    /* TODO: students write steps */
  });
});
