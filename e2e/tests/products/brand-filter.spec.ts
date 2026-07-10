import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Brands are drawn from per-category pools (e.g. electronics: Sony,
 *            Apple, Samsung, Dell, Logitech, Anker, Bose). Curated examples:
 *            "p-elec-1" (Gaming Laptop, brand Dell), "p-elec-3" (Smartphone, brand Apple).
 * TestIds:   brand-filter (the panel), brand-option (one per brand, each carries
 *            data-brand="<name>"). Brand filtering is multi-select and combines
 *            with the other filters; changing it resets pagination to page 1.
 */

test.describe("brand filter", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("filters products by a selected brand", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("supports selecting multiple brands at once", async ({ page }) => {
    /* TODO: students write steps */
  });
});
