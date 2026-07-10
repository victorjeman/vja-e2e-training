# vja-e2e-training — Build Contract (single source of truth)

An educational **Mini Online Store QA App**. Students write Playwright e2e tests against it.
Priority: a **working UI with stable `data-testid`s** and **granular per-test seed scripts**.
Front/back-end code quality is secondary — keep it simple, readable, easy to debug.

Every agent MUST read this file and conform to it exactly (routes, testids, API shapes, seed names, schema).
Deviations require a one-line code comment naming what and why.

---

## 1. Stack (pinned, standalone — no monorepo, no workspace deps)

- Next.js **15.x** (App Router), React **19**, TypeScript strict.
- Tailwind CSS **v4** (`@tailwindcss/postcss`).
- Drizzle ORM + **better-sqlite3** (single local file `./data/app.db`, no container).
- `zod` for validation. `drizzle-kit` for schema push.
- No TanStack Query / TanStack Form / `@vja-start/ui` (can't exist standalone). Use server components + route handlers + a tiny local UI kit. Document this deviation from vja-fed in README.
- Password hashing via Node `crypto.scrypt` (no extra dep). Session via signed httpOnly cookie.

`package.json` scripts:
```
dev        next dev
build      next build
start      next start
type-check tsc --noEmit
db:push    drizzle-kit push
db:reset   tsx backend/db/reset.ts        # drop+recreate all tables, then base catalog
db:seed    tsx backend/seeds/run.ts base  # run the base catalog seed
e2e        playwright test
e2e:ui     playwright test --ui
```

---

## 2. Folder structure

```
vja-e2e-training/
  CONTRACT.md  README.md  SEED-MAP.md
  package.json  tsconfig.json  next.config.ts  postcss.config.mjs  drizzle.config.ts
  .env.example  .gitignore
  data/                      # sqlite file lives here (gitignored)
  src/
    app/
      layout.tsx  page.tsx  globals.css
      login/page.tsx  register/page.tsx
      products/page.tsx      # product list (guarded)
      cart/page.tsx          # cart (guarded)
      api/
        auth/register/route.ts
        auth/login/route.ts
        auth/logout/route.ts
        products/route.ts
        favorites/route.ts
        cart/route.ts
        cart/[productId]/route.ts   # DELETE remove one line
        orders/route.ts             # POST checkout
        test/seed/route.ts          # POST { name } -> run a seed (DEV/TEST only)
    shared/
      testids.ts             # ALL data-testid string constants (see §5)
      routes.ts              # route + api path constants
    components/ui/           # tiny local kit: box, text, heading, button, input, card, badge
    features/
      auth/       (auth-config.ts, auth-types.ts, auth-schemas.ts, lib/, ui/)
      products/   (product-config.ts, product-types.ts, lib/, ui/)
      cart/       (cart-config.ts, cart-types.ts, ui/)
  backend/
    db/
      schema.ts   client.ts   reset.ts
    services/     auth-service.ts products-service.ts cart-service.ts favorites-service.ts orders-service.ts
    session.ts    # getSessionUser(), createSession(), clearSession(), signing
    seeds/
      catalog.ts  # base data: 4 categories + ~24 products (SOURCE OF TRUTH for products)
      registry.ts # name -> seed fn
      run.ts      # CLI: tsx backend/seeds/run.ts <name>
      helpers.ts  # resetTables(), ensureCatalog(), createUser(), addCartItem(), addFavorite()
      scripts/    # one file per granular seed (see §6)
  e2e/
    playwright.config.ts
    fixtures/seed.ts  fixtures/test.ts
    tests/...         # spec stubs, see §7
```

Naming: kebab-case files, singular feature prefix on every file+symbol in a feature (vja-fed rule). Function declarations for components. Named exports except App Router `page/layout/route` (default export).

---

## 3. Database schema (`backend/db/schema.ts`, drizzle sqlite)

- **users**: id (text/uuid pk), name, email (unique), password_hash, created_at.
- **categories**: id (text pk, e.g. `electronics`), name, slug.
- **products**: id (text pk), name, price (real, in currency units), category_id (fk), image (text placeholder url/emoji), description.
- **favorites**: id (text pk), user_id (fk), product_id (fk), unique(user_id, product_id).
- **cart_items**: id (text pk), user_id (fk), product_id (fk), qty (int default 1), unique(user_id, product_id).
- **orders**: id (text pk), user_id (fk), total (real), status (text: 'confirmed'), created_at.
- **order_items**: id (text pk), order_id (fk), product_id (fk), qty, price.

Categories (4): `electronics` (Electronics), `clothing` (Clothing), `books` (Books), `home` (Home & Kitchen).
Products: ~24, 6 per category, varied prices (e.g. 5–1200) so price-range filtering is testable. Use emoji or `https://placehold.co/...` for image. Catalog is defined ONCE in `backend/seeds/catalog.ts` and imported everywhere.

---

## 4. API contracts

All JSON. Auth endpoints set/clear the `session` cookie. Product/cart/favorites/orders require a session (401 if none).

- `POST /api/auth/register` body `{name,email,password}` → 201 `{user:{id,name,email}}`; 400 validation `{error, field}`; 409 email taken.
- `POST /api/auth/login` body `{email,password}` → 200 `{user}` + set cookie; 401 `{error}` wrong creds.
- `POST /api/auth/logout` → 200, clears cookie.
- `GET /api/products?category=&minPrice=&maxPrice=&q=` → `{products:[...]}` filtered server-side (also fine to filter client-side; expose full list too).
- `GET /api/favorites` → `{productIds:[...]}`. `POST /api/favorites` `{productId}` toggles. 
- `GET /api/cart` → `{items:[{product, qty}], count, total}`. `POST /api/cart` `{productId}` adds. `DELETE /api/cart/:productId` removes.
- `POST /api/orders` → 200 `{orderId}` if cart non-empty (clears cart); 400 `{error:'cart_empty'}` if empty.
- `POST /api/test/seed` body `{name}` → runs `registry[name]()`; 200 `{ok:true}`. **Guard: only when `NODE_ENV!=='production'`** (returns 403 otherwise).

Requirements to honor: email format validated; password ≥6 chars; wrong login → error; products only after login; favorites persist after refresh (DB-backed); cart counter updates; remove from cart; checkout only if non-empty; empty checkout error; successful checkout clears cart; category filter; price-range filter; search by name; search works WITH filters; clear filters resets all; no-results message.

---

## 5. data-testid registry (`src/shared/testids.ts`) — use these EXACT strings

```
// Auth
register-form  register-name-input  register-email-input  register-password-input  register-btn
email-error  password-error
login-form  login-email-input  login-password-input  login-btn  login-error
logout-btn
// Products
product-list  product-card  favorite-btn  add-to-cart-btn
category-filter  category-option-all  category-option-electronics  category-option-clothing
category-option-books  category-option-home
price-filter  price-min-input  price-max-input
search-input  clear-filters-btn  no-results-message
// Cart
cart-link  cart-count  cart-page  remove-cart-item-btn  checkout-btn  order-success-message
```
Notes: `product-card` repeats per product — add `data-product-id={id}` too so students can target a specific one. `favorite-btn` / `add-to-cart-btn` / `remove-cart-item-btn` live inside each card/row; also carry `data-product-id`. `favorite-btn` reflects state via `data-active="true|false"`. `cart-count` shows the item count.

---

## 6. Seeds — granular, one concern each (`backend/seeds/scripts/`)

Every seed FIRST calls `resetTables()` for the tables it owns, then sets exactly the state named. `ensureCatalog()` guarantees the 4 categories + products exist (idempotent). The known e2e user: **email `e2e@test.com`, password `123456`, name `E2E User`**.

| seed name | what it guarantees |
|---|---|
| `base` | reset everything, ensure catalog, no users |
| `reset-users` | catalog present, users/favorites/cart/orders empty (for register tests) |
| `user-registered` | catalog + the e2e user exists, empty cart/favorites (for login tests) |
| `user-empty-cart` | e2e user logged-out-ready, catalog, cart empty, favorites empty |
| `user-cart-has-items` | e2e user, catalog, cart has 2 known products (ids in file), favorites empty |
| `user-no-favorites` | e2e user, catalog, favorites empty |
| `user-has-favorites` | e2e user, catalog, 1 known product already favorited |
| `catalog-default` | e2e user, full catalog, clean filters state (nothing user-specific) |
| `catalog-search-match` | e2e user, catalog guaranteed to contain a product named for search test |
| `catalog-no-match` | e2e user, catalog (for search-yields-nothing / no-results test) |

Each script exports one named fn `seed<Name>()`; `registry.ts` maps the string → fn. `run.ts` = `tsx backend/seeds/run.ts <name>`. Add each known product/id the seed relies on as an exported const so specs can reference deterministic data. Keep each script SMALL and focused.

---

## 7. e2e project (`e2e/`) — stubs only, wired to seeds

`fixtures/seed.ts`: `export async function seed(request, name)` → `request.post('/api/test/seed', {data:{name}})`.
`fixtures/test.ts`: extend Playwright `test` with a `seed` fixture bound to the running server so specs call `await seed('cart-has-items')`.
`playwright.config.ts`: `baseURL http://localhost:3100` (app run on 3100 for tests), `webServer` starts `npm run dev` with a test DB, retries 0, `use.trace`.

Each spec = a `describe` with `beforeEach(async ({ seed }) => { await seed('<name>') })` and **empty `test()` stubs** (student writes body). Put a top comment: which seed runs, which testids to use. Mapping:

```
tests/auth/register.spec.ts        seed reset-users        (register-form, email-error, password-error)
tests/auth/login.spec.ts           seed user-registered    (login-form, login-error)
tests/products/product-list.spec.ts seed catalog-default   (product-list, product-card)
tests/products/favorites.spec.ts   seed user-no-favorites  (favorite-btn)
tests/products/category-filter.spec.ts seed catalog-default (category-filter, category-option-*)
tests/products/price-filter.spec.ts seed catalog-default   (price-filter, price-min/max-input)
tests/products/search.spec.ts      seed catalog-search-match (search-input, no-results-message)
tests/products/clear-filters.spec.ts seed catalog-default  (clear-filters-btn)
tests/cart/add-to-cart.spec.ts     seed user-empty-cart    (add-to-cart-btn, cart-count)
tests/cart/remove-from-cart.spec.ts seed user-cart-has-items (remove-cart-item-btn)
tests/cart/checkout.spec.ts        seed user-cart-has-items (checkout-btn, order-success-message)
tests/cart/empty-checkout.spec.ts  seed user-empty-cart    (checkout-btn -> error)
```

Also `SEED-MAP.md` at repo root documents this table for students + how to add a new test+seed pair.

---

## 8. Auth / session details

- `createSession(userId)`: set cookie `session` = `userId.signature` (HMAC-SHA256 with `SESSION_SECRET` from env, default dev secret). httpOnly, sameSite lax, path /.
- `getSessionUser()` (server, reads cookies) → user row or null. Verifies signature.
- `/products` and `/cart` pages: server-side `getSessionUser()`; if null → `redirect('/login')`.
- Register does NOT auto-login (student logs in explicitly in the login flow) — but returning 201 is fine. Login sets the cookie.

Keep everything minimal and synchronous where possible. Better-sqlite3 is synchronous — services can be plain sync functions.
