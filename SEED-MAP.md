# SEED-MAP — the seed ↔ test connection

This is the student-facing map between each e2e spec and the seed that
puts the database into the exact state that spec needs. Every spec calls
its seed in `beforeEach`, so tests are deterministic and independent.

## How it wires together

- Seeds live in `backend/seeds/scripts/*.ts` and are registered in
  `backend/seeds/registry.ts` (name → function).
- A spec calls `await seed('<name>')` (the `seed` fixture in
  `e2e/fixtures/test.ts`), which POSTs to `/api/test/seed` with `{ name }`.
- The endpoint runs `seedRegistry[name]()` on the running app's DB.
- App and tests both run on `http://localhost:3100` (CONTRACT §7).

## Test → seed map (CONTRACT §7)

| spec file | seed | key testids |
|---|---|---|
| `tests/auth/register.spec.ts` | `reset-users` | register-form, email-error, password-error |
| `tests/auth/login.spec.ts` | `user-registered` | login-form, login-error |
| `tests/products/product-list.spec.ts` | `catalog-default` | product-list, product-card |
| `tests/products/favorites.spec.ts` | `user-no-favorites` | favorite-btn |
| `tests/products/category-filter.spec.ts` | `catalog-default` | category-filter, category-option-* |
| `tests/products/category-deep-link.spec.ts` | `catalog-default` | results-count, product-card (via `/products?category=<id>`) |
| `tests/products/price-filter.spec.ts` | `catalog-default` | price-filter, price-min-input, price-max-input |
| `tests/products/search.spec.ts` | `catalog-search-match` | search-input, no-results-message |
| `tests/products/clear-filters.spec.ts` | `catalog-default` | clear-filters-btn |
| `tests/cart/add-to-cart.spec.ts` | `user-empty-cart` | add-to-cart-btn, cart-count |
| `tests/cart/remove-from-cart.spec.ts` | `user-cart-has-items` | remove-cart-item-btn |
| `tests/cart/checkout.spec.ts` | `user-cart-has-items` | checkout-btn, order-success-message |
| `tests/cart/empty-checkout.spec.ts` | `user-empty-cart` | checkout-btn (→ error) |
| `tests/products/brand-filter.spec.ts` | `catalog-default` | brand-filter, brand-option (+data-brand) |
| `tests/products/product-detail.spec.ts` | `catalog-default` | product-link, product-detail, product-detail-name, product-detail-price, product-detail-description, product-detail-back |
| `tests/products/color-filter.spec.ts` | `catalog-default` | color-filter, color-option (+data-color) |
| `tests/products/rating-filter.spec.ts` | `catalog-default` | rating-filter, rating-option (+data-rating) |
| `tests/products/in-stock-filter.spec.ts` | `catalog-default` | in-stock-filter |
| `tests/products/sort.spec.ts` | `catalog-default` | sort-select, results-count |
| `tests/products/pagination.spec.ts` | `catalog-default` | pagination, pagination-prev, pagination-next, pagination-page (+data-page), page-info |
| `tests/favorites/favorites.spec.ts` | `user-no-favorites` (empty + toggle), `user-has-favorites` (viewing) | favorites-link, favorites-page, favorites-list, favorites-empty, favorite-btn (+data-active) |
| `tests/orders/order-history.spec.ts` | `user-with-orders` | orders-link, orders-page, orders-list, order-card (+data-order-id), order-total, orders-empty |

## Seeds (CONTRACT §6) — what each guarantees

Every seed first resets the tables it owns, then `ensureCatalog()`
(4 categories + 500 products, incl. the 24 fixed curated ones, idempotent),
then sets exactly its state.

| seed | guarantees |
|---|---|
| `base` | reset everything, ensure catalog, no users |
| `reset-users` | catalog present; users/favorites/cart/orders empty |
| `user-registered` | catalog + e2e user exists; empty cart/favorites |
| `user-empty-cart` | e2e user; catalog; cart empty; favorites empty |
| `user-cart-has-items` | e2e user; cart holds the 2 known products; favorites empty |
| `user-no-favorites` | e2e user; catalog; favorites empty |
| `user-has-favorites` | e2e user; catalog; 1 known product already favorited |
| `user-with-orders` | e2e user; catalog; 1 confirmed order of `p-elec-2` + `p-book-1` (qty 1 each, catalog price); cart empty; favorites empty |
| `catalog-default` | e2e user; full catalog; clean filter state |
| `catalog-search-match` | e2e user; catalog guaranteed to contain the search-test product |
| `catalog-no-match` | e2e user; catalog (for search-yields-nothing / no-results) |

## Deterministic fixture data

Exported from `backend/seeds/e2e-fixtures.ts` — rely on these exact values.

- **e2e user** (`E2E_USER`) — email `e2e@test.com`, password `123456`, name `E2E User`.
- **Cart seed products** (`CART_SEED_PRODUCT_IDS`) — `p-elec-2` (Wireless
  Headphones), `p-book-1` (Mystery Novel).
- **Favorite seed product** (`FAVORITE_SEED_PRODUCT_ID`) — `p-elec-1` (Gaming Laptop).
- **Search match** (`SEARCH_MATCH_PRODUCT_ID` = `p-elec-1`, `SEARCH_MATCH_TERM` =
  `Laptop`) — searching `Laptop` matches "Gaming Laptop".
- **Search no-match** (`SEARCH_NO_MATCH_TERM` = `zzzznomatch`) — yields zero results.

Product catalog (source of truth): `backend/seeds/catalog.ts` — 500 products
across 4 categories (Electronics / Clothing / Books / Home & Kitchen). The 24
**curated** products keep fixed ids and attributes (e.g. `p-elec-1` "Gaming Laptop"
brand Dell, Black, rating 4.7; `p-book-1` "Mystery Novel"; `p-home-2` "Chef's Knife");
generated products use ids `p-gen-0001`... . Prices span roughly $6..$2497, 16 brands,
8 colors, ~11% out of stock, some discounted. Seeds reference only the curated ids.

## How to add a new test + seed pair

1. **Pick the exact state** your test needs (who is logged in, what's in the
   cart/favorites, which products must exist).
2. **Add a seed script** `backend/seeds/scripts/<name>.ts` exporting one fn
   `seed<Name>()`. First reset the tables it owns (`clearUsers()` or
   `resetTables([...])`), then `ensureCatalog()`, then set exactly that state
   using `createUser`, `addCartItem`, `addFavorite`. Keep it tiny and single-concern.
3. **Reuse deterministic ids** from `e2e-fixtures.ts` (add a new exported const
   there if your test needs a specific product), so the spec can assert on them.
4. **Register it** in `backend/seeds/registry.ts`: `"<name>": seed<Name>`.
5. **Verify** it runs: `npx tsx backend/seeds/run.ts <name>`.
6. **Add the spec** under `e2e/tests/...`, import `{ test, expect }` from the
   fixtures, `beforeEach(async ({ seed }) => { await seed('<name>') })`, and a
   top comment naming the seed, fixture data, and testids.
7. **Update the tables** in this file.

## Running

- Seeds (CLI): `npx tsx backend/seeds/run.ts <name>`
- e2e list: `npx playwright test --list -c e2e/playwright.config.ts`
- e2e run:  `npx playwright test -c e2e/playwright.config.ts`
  (the `npm run e2e` script is bare `playwright test`; it needs the
  `-c e2e/playwright.config.ts` flag to find this config.)
