"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";
import { productFilter } from "../lib/product-filter";
import type { ProductCategory, ProductFilterState, ProductItem } from "../product-types";
import { ProductCard } from "./product-card";
import { ProductCategoryFilter } from "./product-category-filter";
import { ProductPriceFilter } from "./product-price-filter";
import { ProductBrandFilter } from "./product-brand-filter";
import { ProductColorFilter } from "./product-color-filter";
import { ProductRatingFilter } from "./product-rating-filter";
import { ProductInStockFilter } from "./product-instock-filter";
import { ProductSortSelect } from "./product-sort-select";
import { ProductPagination } from "./product-pagination";

interface ProductListProps {
  products: ProductItem[];
  categories: ProductCategory[];
  brands: string[];
  colors: string[];
  favoriteIds: string[];
}

const INITIAL_STATE: ProductFilterState = {
  category: PRODUCT_CONFIG.categoryAllValue,
  minPrice: "",
  maxPrice: "",
  q: "",
  brands: [],
  colors: [],
  minRating: 0,
  inStockOnly: false,
  sort: PRODUCT_CONFIG.defaultSort,
  page: 1,
};

const PAGE_SIZE = PRODUCT_CONFIG.pageSize;

// Toggles a value in a string array (used by brand + color multi-select).
function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ProductList({ products, categories, brands, colors, favoriteIds }: ProductListProps) {
  // Client-side filtering over the full catalog for instant updates (per requirement).
  const [filters, setFilters] = useState<ProductFilterState>(INITIAL_STATE);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds));

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const visible = useMemo(() => productFilter(products, filters), [products, filters]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  // Clamp the page in case a filter change shrank the result set below the current page.
  const page = Math.min(filters.page, totalPages);
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Any filter change (everything but the page itself) resets pagination to page 1.
  function updateFilters(patch: Partial<ProductFilterState>) {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  }

  function handleToggleFavorite(productId: string) {
    // Optimistic toggle, then reconcile with the server response.
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
    fetch(PRODUCT_CONFIG.api.favorites, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).then(async (res) => {
      if (res.ok) {
        const data = (await res.json()) as { productIds: string[] };
        setFavorites(new Set(data.productIds));
      }
    });
  }

  function handleClearFilters() {
    setFilters(INITIAL_STATE);
  }

  const resultsSuffix =
    visible.length === 1
      ? PRODUCT_CONFIG.text.resultsSuffixSingular
      : PRODUCT_CONFIG.text.resultsSuffixPlural;

  return (
    <Box data-testid={TESTIDS.productList} className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
      {/* Filters sidebar (collapsible above the grid on mobile). */}
      <Card className="mb-6 h-fit gap-4 p-4 lg:mb-0">
        <Box className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {PRODUCT_CONFIG.text.filtersLabel}
          </span>
          <Button variant="ghost" size="sm" data-testid={TESTIDS.clearFiltersBtn} onClick={handleClearFilters}>
            {PRODUCT_CONFIG.text.clearFilters}
          </Button>
        </Box>

        <Separator />

        <Box className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {PRODUCT_CONFIG.text.categoryLabel}
          </span>
          <ProductCategoryFilter
            categories={categories}
            selected={filters.category}
            onSelect={(category) => updateFilters({ category })}
          />
        </Box>

        <Separator />

        <ProductPriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinChange={(minPrice) => updateFilters({ minPrice })}
          onMaxChange={(maxPrice) => updateFilters({ maxPrice })}
        />

        <Separator />

        <ProductBrandFilter
          brands={brands}
          selected={filters.brands}
          onToggle={(brand) => updateFilters({ brands: toggleValue(filters.brands, brand) })}
        />

        <Separator />

        <ProductColorFilter
          colors={colors}
          selected={filters.colors}
          onToggle={(color) => updateFilters({ colors: toggleValue(filters.colors, color) })}
        />

        <Separator />

        <ProductRatingFilter
          minRating={filters.minRating}
          onSelect={(minRating) => updateFilters({ minRating })}
        />

        <Separator />

        <ProductInStockFilter
          checked={filters.inStockOnly}
          onChange={(inStockOnly) => updateFilters({ inStockOnly })}
        />
      </Card>

      {/* Main catalog area. */}
      <Box className="space-y-6">
        <Card className="gap-4 p-4">
          <Box className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Box className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-testid={TESTIDS.searchInput}
                aria-label={PRODUCT_CONFIG.text.searchPlaceholder}
                placeholder={PRODUCT_CONFIG.text.searchPlaceholder}
                value={filters.q}
                onChange={(e) => updateFilters({ q: e.target.value })}
                className="w-full pl-9"
              />
            </Box>
            <Box className="flex items-center gap-3">
              <span data-testid={TESTIDS.resultsCount} className="text-sm text-muted-foreground">
                {visible.length} {resultsSuffix}
              </span>
              <ProductSortSelect
                value={filters.sort}
                onChange={(sort) => updateFilters({ sort })}
              />
            </Box>
          </Box>
        </Card>

        {visible.length === 0 ? (
          <Card className="items-center gap-2 px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <PackageSearch className="size-6" />
            </span>
            <p className="text-base font-semibold text-foreground">
              {PRODUCT_CONFIG.text.noResultsTitle}
            </p>
            <p data-testid={TESTIDS.noResultsMessage} className="text-sm text-muted-foreground">
              {PRODUCT_CONFIG.text.noResults}
            </p>
          </Card>
        ) : (
          <>
            <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categoryById.get(product.categoryId)}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </Box>

            <ProductPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(next) => setFilters((f) => ({ ...f, page: next }))}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
