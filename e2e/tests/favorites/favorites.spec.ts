import { test, expect } from "../../fixtures/test";

/*
 * CONNECTION DOC (read before writing steps)
 * Seeds:     user-no-favorites   (e2e user, catalog, favorites empty) -> empty
 *                                 state + toggling a product into favorites.
 *            user-has-favorites  (e2e user, catalog, "p-elec-1" Gaming Laptop
 *                                 already favorited) -> viewing the list.
 *            Pick the seed per describe block below.
 * Route:     /favorites  (login-guarded; log in as the e2e user first). Reach it
 *            via the header favorites-link.
 * Fixtures:  e2e user -> email "e2e@test.com", password "123456".
 *            Pre-favorited product = "p-elec-1" (Gaming Laptop).
 * TestIds:   favorites-link (header nav), favorites-page (container),
 *            favorites-list (the favorited product cards), favorites-empty
 *            (shown when none), favorite-btn (on each card; carries
 *            data-product-id and data-active="true|false").
 * Rules:     favorites are DB-backed and persist after a page refresh.
 */

test.describe("favorites page — empty and toggling", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("user-no-favorites");
  });

  test("shows the empty state when there are no favorites", async ({ page }) => {
    /* TODO: students write steps */
  });

  test("adds a product to favorites and shows it on the favorites page", async ({ page }) => {
    /* TODO: students write steps */
  });
});

test.describe("favorites page — viewing existing favorites", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("user-has-favorites");
  });

  test("lists the already-favorited product", async ({ page }) => {
    /* TODO: students write steps */
  });
});
