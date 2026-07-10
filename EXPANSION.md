# Catalog Expansion Contract (addendum to CONTRACT.md)

Goal: grow the store to ~500 products with rich attributes and real-store-style multi-attribute
filtering + a Favorites page + pagination, WITHOUT breaking any graded feature, seed, or testid.

## Non-negotiable invariants
- The **24 curated products keep their exact ids, names, prices, categoryId** (p-elec-1 "Gaming Laptop",
  p-elec-2, p-book-1 "Mystery Novel", p-book-2 "Science Fiction Novel", etc.). `backend/seeds/e2e-fixtures.ts`
  guards these ids. New products are ADDITIVE (ids `p-gen-0001` ...).
- All existing testids + behaviors stay: `category-filter`/`category-option-*`, `price-filter`/`price-min-input`/
  `price-max-input`, `search-input`, `clear-filters-btn`, `no-results-message`, `product-card`(+`data-product-id`),
  `favorite-btn`(+`data-active`), `add-to-cart-btn`, cart + checkout ids. `clear-filters-btn` must reset EVERY
  filter (category, price, brand, color, rating, in-stock, search, sort, page).
- Granular seeds keep working unchanged.

## Schema additions (`backend/db/schema.ts` products table + `backend/db/ddl.ts`)
Add columns (all NOT NULL with sensible defaults in the generator):
- `brand TEXT` — e.g. per-category brand pool.
- `rating REAL` — 3.0..5.0 (one decimal).
- `reviewCount INTEGER` — 0..5000.
- `color TEXT` — one of a small palette (Black, White, Silver, Blue, Red, Green, Beige, Gray).
- `inStock INTEGER` — 0 or 1 (most in stock; ~12% out of stock).
- `discountPercent INTEGER` — 0, 10, 15, 20, 25, 30 (0 = no discount).
Keep existing `image` (emoji) + `imageUrl`. Curated products: give them plausible attribute values too.

## Data generation (`backend/seeds/catalog.ts`)
- Keep the existing 24 `PRODUCTS` array; ADD attributes to each (brand/rating/reviewCount/color/inStock/discountPercent).
- Generate ~476 more (total 500) spread across the 4 categories. Deterministic (no Math.random at module load;
  use an index-seeded pseudo-random helper). **Wide price spread**: roughly $5 to $2500, varied per category
  (books cheap, electronics wide/high, home mid-high, clothing mid). Names like `${brand} ${adjective} ${noun}`
  per category so search has variety. Assign `imageUrl` from the local pool cyclically:
  `/products/pool-<categorySlug maps: electronics|clothing|books|home>-<1..15>.jpg` (60 pool images exist), and the
  24 curated keep their own `/products/<id>.jpg`. Emoji `image` = a category-appropriate glyph.
- Brand pools (examples, extend freely): electronics [Sony, Apple, Samsung, Dell, Logitech, Anker, Bose],
  clothing [Nike, Adidas, Levi's, Uniqlo, Zara, Puma], books [Penguin, O'Reilly, Vintage, Harper],
  home [IKEA, Cuisinart, KitchenAid, Philips, Dyson].

## Services + API (`products-service.ts`, `/api/products`)
- `listProducts` accepts: category, minPrice, maxPrice, q (existing) + brand (multi, comma), color (multi),
  minRating, inStock (bool), sort (`featured|price-asc|price-desc|rating-desc|newest`). Filter server-side.
- Return the full filtered list (client still paginates for display). Also expose distinct `brands` and `colors`
  present in the catalog so the UI can render filter options.
- Keep `getFavoriteProductIds` / `toggleFavorite` as-is.

## Frontend (`src/features/products/*`, new `/favorites`)
- Product list keeps client-side filtering over the fetched catalog (500 items is fine) + adds:
  - **Advanced filters** (a sidebar or collapsible panel): brand (`brand-filter` with `brand-option`+`data-brand`),
    color (`color-filter`/`color-option`+`data-color`), rating (`rating-filter`/`rating-option`+`data-rating`,
    e.g. 4 = "4+ stars"), in-stock only (`in-stock-filter` checkbox), sort (`sort-select`).
  - **Results count** (`results-count`) = number matching current filters.
  - **Pagination** (`pagination`, `pagination-prev`, `pagination-next`, `pagination-page`+`data-page`, `page-info`),
    default 12 per page. Filters operate on the full set; pagination shows the current page slice. Changing any
    filter resets to page 1. `no-results-message` shows when 0 match (and no pagination).
- Product cards can now show brand, real rating (from DB), an "Out of stock" state, discount badge from
  `discountPercent`. Add-to-cart on out-of-stock may be disabled (keep the button present with testid; if disabled,
  keep it a real button). Favorite + add-to-cart behaviors unchanged.
- **Favorites page** `/favorites` (server component, login-guarded): header nav link (`favorites-link`), a
  `favorites-page` container, `favorites-list` of the user's favorited products as product cards, and a
  `favorites-empty` message when none. Reachable from the header.
- `clear-filters-btn` resets category+price+search AND brand+color+rating+in-stock+sort+page.

## Verification expectations (internal)
- Filtering by category still yields only that category (counts change; assert via `results-count` or by checking
  visible cards' category, not a hard 24/6).
- Search for "Gaming Laptop" still finds the curated product; bogus term → `no-results-message`.
- Favorites toggled on products page appear on `/favorites` and persist after refresh.
