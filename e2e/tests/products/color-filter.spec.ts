import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seed:      catalog-default  (e2e user, full 500-product catalog, clean filter state)
 * Route:     /products  (log in as the e2e user first)
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Colors are from a fixed palette: Black, White, Silver, Blue, Red,
 *            Green, Beige, Gray. Curated examples: "p-elec-1" (Gaming Laptop, Black),
 *            "p-elec-6" (Bluetooth Speaker, Blue), "p-cloth-3" (Running Shoes, Red).
 * TestIds:   color-filter (the panel), color-option (one per color, each carries
 *            data-color="<name>"). Color filtering is multi-select and combines
 *            with the other filters; changing it resets pagination to page 1.
 */

test.describe("color filter", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default");
  });

  test("filters products by a selected color", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("supports selecting multiple colors at once", async ({ page }) => {
    /* TODO: students write steps */
  });
});
