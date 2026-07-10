# VJA E2E Training Store

An educational **Mini Online Store QA App** for learning **Playwright**. The app is
finished: it ships a working e-commerce UI with stable `data-testid`s and granular
per-test seed scripts. You (the student) write the end-to-end test bodies. Every spec
under `e2e/tests/` is an empty stub wired to a seed, so you can focus on the Playwright
steps instead of app setup. Browse a 500-product catalog, register, log in, filter and
sort, manage a cart and favorites, and check out.

## Tech stack

- **Next.js 15** (App Router, standalone) + **React 19** + **TypeScript** (strict).
- **Tailwind CSS v4** + **shadcn/ui** components (a small local UI kit).
- **Drizzle ORM** + **better-sqlite3**, a single local file `./data/app.db` (no container).
- Backend logic in `backend/`, exposed through route handlers under `src/app/api/*`.
- **Playwright** for the e2e tests you write.

## Prerequisites

- **Node.js 18+** (built and verified on newer LTS releases).
- npm.

## Quick start

```bash
npm install                      # 1. install dependencies
npx playwright install chromium  # 2. one-time: download the test browser
npm run db:reset                 # 3. create ./data/app.db, tables, and the catalog
npm run dev                      # 4. start the app on http://localhost:3000
```

Open http://localhost:3000 and log in with the demo account below.

## Demo account

Seeded by `npm run db:reset` and shown on the login page:

- **Email:** `e2e@test.com`
- **Password:** `123456`

## Features and `data-testid` reference

Target elements by their `data-testid`. The full registry lives in
`src/shared/testids.ts` — the exact strings below come from it. Some ids repeat per item
and carry a `data-*` attribute so you can target a specific one (for example
`[data-testid="product-card"][data-product-id="p-elec-1"]`).

### Auth

| Feature | `data-testid` |
|---|---|
| Register form | `register-form` |
| Register name / email / password inputs | `register-name-input`, `register-email-input`, `register-password-input` |
| Register submit | `register-btn` |
| Register validation errors | `email-error`, `password-error` |
| Login form | `login-form` |
| Login email / password inputs | `login-email-input`, `login-password-input` |
| Login submit | `login-btn` |
| Login error | `login-error` |
| Logout | `logout-btn` |

### Products and filters

| Feature | `data-testid` |
|---|---|
| Product list container | `product-list` |
| Product card (repeats; carries `data-product-id`) | `product-card` |
| Favorite toggle (per card; carries `data-product-id`, `data-active="true\|false"`) | `favorite-btn` |
| Add to cart (per card; carries `data-product-id`) | `add-to-cart-btn` |
| Category filter + options | `category-filter`, `category-option-all`, `category-option-electronics`, `category-option-clothing`, `category-option-books`, `category-option-home` |
| Price range filter | `price-filter`, `price-min-input`, `price-max-input` |
| Brand filter (options carry `data-brand`) | `brand-filter`, `brand-option` |
| Color filter (options carry `data-color`) | `color-filter`, `color-option` |
| Rating filter (options carry `data-rating`, e.g. `4` = 4+ stars) | `rating-filter`, `rating-option` |
| In-stock-only checkbox | `in-stock-filter` |
| Sort select (featured, price-asc, price-desc, rating-desc, newest) | `sort-select` |
| Results count (matching current filters) | `results-count` |
| Search input | `search-input` |
| Clear all filters | `clear-filters-btn` |
| No-results message | `no-results-message` |

### Cart

| Feature | `data-testid` |
|---|---|
| Cart link (header) | `cart-link` |
| Cart item count badge | `cart-count` |
| Cart page container | `cart-page` |
| Remove cart item (per row; carries `data-product-id`) | `remove-cart-item-btn` |
| Checkout | `checkout-btn` |
| Order success message | `order-success-message` |
| Cart error (e.g. empty checkout) | `cart-error` |

### Favorites

| Feature | `data-testid` |
|---|---|
| Favorites link (header) | `favorites-link` |
| Favorites page container | `favorites-page` |
| Favorites list | `favorites-list` |
| Favorites empty message | `favorites-empty` |
| Favorite toggle (shared with product cards) | `favorite-btn` |

### Orders

| Feature | `data-testid` |
|---|---|
| Orders link (header) | `orders-link` |
| Orders page container | `orders-page` |
| Orders list | `orders-list` |
| Order card (per order; carries `data-order-id`) | `order-card` |
| Order total (per card) | `order-total` |
| Orders empty message | `orders-empty` |

### Pagination

| Feature | `data-testid` |
|---|---|
| Pagination control | `pagination` |
| Previous / next | `pagination-prev`, `pagination-next` |
| Page number (carries `data-page`) | `pagination-page` |
| Page info (e.g. "Page 1 of N") | `page-info` |

## How the seed system works

Each test starts from a **known database state** produced by a **seed**, so tests are
deterministic and independent of each other.

- Seeds live in `backend/seeds/scripts/` (one concern each) and are registered by name
  in `backend/seeds/registry.ts` (name -> function).
- Every seed first resets the tables it owns, then guarantees the catalog with
  `ensureCatalog()`, then sets exactly its state (who is logged in, what is in the
  cart/favorites).
- Deterministic fixture data (the demo user, curated product ids) is exported from
  `backend/seeds/e2e-fixtures.ts` so your specs can assert on exact values.

In a spec, the `seed` fixture (from `e2e/fixtures/test.ts`) POSTs to
`POST /api/test/seed` with `{ name }`. That endpoint runs the named seed against the
running app's database. It is enabled only when `NODE_ENV !== 'production'`.

```ts
test.beforeEach(async ({ seed }) => {
  await seed("catalog-default");
});
```

For a full wipe and rebuild (all tables plus the base catalog), run `npm run db:reset`.
See **`SEED-MAP.md`** for the complete test-to-seed map, what each seed guarantees, and
how to add a new test + seed pair.

## How to write a test

Import `test` and `expect` from the fixtures, seed your state in `beforeEach`, then drive
the UI by `data-testid`. A minimal worked example:

```ts
import { test, expect } from "../../fixtures/test";

test.describe("product list", () => {
  test.beforeEach(async ({ seed }) => {
    await seed("catalog-default"); // e2e user + full catalog
  });

  test("shows the product list after login", async ({ page }) => {
    // log in as the demo user
    await page.goto("/login");
    await page.getByTestId("login-email-input").fill("e2e@test.com");
    await page.getByTestId("login-password-input").fill("123456");
    await page.getByTestId("login-btn").click();

    // the guarded product list is now visible
    await expect(page.getByTestId("product-list")).toBeVisible();
    await expect(page.getByTestId("product-card").first()).toBeVisible();
  });
});
```

The stub specs already give you the `describe`, the `beforeEach` seeding, and a
connection-doc comment naming the seed, fixture data, and testids. You fill in the body.

## Project structure

```
vja-e2e-training/
  CONTRACT.md  README.md  SEED-MAP.md  EXPANSION.md
  data/                      # sqlite file (gitignored)
  src/
    app/                     # App Router pages + api route handlers
      login/  register/  products/  cart/  favorites/  checkout/  orders/
      api/                   # auth, products, favorites, cart, orders, test/seed
    shared/                  # testids.ts (the id registry), routes.ts
    components/ui/           # local shadcn/ui-based kit
    features/                # auth / products / cart feature modules
  backend/
    db/                      # schema, client, reset
    services/                # auth, products, cart, favorites, orders
    seeds/
      catalog.ts             # 500 products, 4 categories (source of truth)
      e2e-fixtures.ts        # deterministic ids used by seeds + specs
      registry.ts            # seed name -> fn
      scripts/               # one file per granular seed
  e2e/
    playwright.config.ts
    fixtures/                # seed.ts + test.ts (the `seed` fixture)
    tests/                   # the spec stubs you complete
      auth/  products/  cart/  favorites/
```

## Running the tests

```bash
npm run e2e       # run Playwright (headless); auto-starts the app on port 3100
npm run e2e:ui    # Playwright UI mode
```

The Playwright config starts the app on **port 3100** for tests (and reuses an already
running one). Note the **serial** constraint: all specs share one SQLite database and
each seeds it in `beforeEach`, so the suite runs with a single worker
(`fullyParallel: false`, `workers: 1`). Parallel workers would reset each other's data
mid-test.

To list the tests without running them:

```bash
npx playwright test --list -c e2e/playwright.config.ts
```

## Available seeds

Full details in `SEED-MAP.md`. Short list:

- `base` — reset everything, ensure catalog, no users.
- `reset-users` — catalog present; users/favorites/cart/orders empty.
- `user-registered` — catalog + demo user; empty cart/favorites.
- `user-empty-cart` — demo user; catalog; cart and favorites empty.
- `user-cart-has-items` — demo user; cart holds `p-elec-2` and `p-book-1`.
- `user-no-favorites` — demo user; catalog; favorites empty.
- `user-has-favorites` — demo user; `p-elec-1` already favorited.
- `user-with-orders` — demo user; one confirmed order of `p-elec-2` + `p-book-1`; empty cart, no favorites.
- `catalog-default` — demo user; full catalog; clean filter state.
- `catalog-search-match` — catalog guaranteed to contain the search-test product.
- `catalog-no-match` — catalog for the search-yields-nothing / no-results test.

## Troubleshooting

- **`better-sqlite3` fails to build on install.** It is a native module and needs build
  tools. Ensure a supported Node version (18+), then re-run `npm install`. On macOS
  install the Xcode command line tools (`xcode-select --install`); on Linux install
  `build-essential` and `python3`. Deleting `node_modules` and reinstalling often fixes a
  half-built binary.
- **Port already in use (3000 or 3100).** Stop the other process, or free the port. The
  Playwright config reuses an app already running on 3100, so a stale dev server there is
  usually fine. If it is broken, kill it and let Playwright start a fresh one.
- **Weird or stale data.** Run `npm run db:reset` to drop and recreate all tables and the
  base catalog. Individual tests reseed their own slice in `beforeEach`.
- **Playwright can't find a browser.** Run `npx playwright install chromium` (a one-time
  download). Re-run it after upgrading `@playwright/test`.

## Notes / intentional simplifications

This app is standalone (no monorepo, no workspace deps), so it deliberately deviates from
the vja-fed reference stack to stay simple and easy to debug:

- **Local UI kit** in `src/components/ui/` (shadcn/ui components) instead of a shared
  package that can't exist standalone.
- **Route handlers + server components** instead of TanStack Query / TanStack Form.
- **SQLite + Drizzle ORM** (`better-sqlite3`, single file `./data/app.db`) instead of
  Prisma.
- Password hashing via Node `crypto.scrypt`; session via a signed httpOnly cookie.
- Product images are generated / Creative-Commons assets stored in `public/products`.

`CONTRACT.md` (base spec) and `EXPANSION.md` (the 500-product catalog + advanced filters)
are the authoritative specs behind this app.
