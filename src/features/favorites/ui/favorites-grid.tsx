"use client";

import { useMemo, useState } from "react";
import { Box } from "@/components/ui/box";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "@/features/products/product-config";
import { ProductCard } from "@/features/products/ui/product-card";
import type { ProductCategory, ProductItem } from "@/features/products/product-types";

interface FavoritesGridProps {
  products: ProductItem[];
  categories: ProductCategory[];
  favoriteIds: string[];
}

// Client grid reusing ProductCard so favorite/add-to-cart/testids all work.
export function FavoritesGrid({ products, categories, favoriteIds }: FavoritesGridProps) {
  // Seed initial favorite state so hearts render active on first paint.
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds));

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  async function handleToggleFavorite(productId: string) {
    // Optimistic toggle, then reconcile with the server response (mirrors ProductList).
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
    const res = await fetch(PRODUCT_CONFIG.api.favorites, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      const data = (await res.json()) as { productIds: string[] };
      setFavorites(new Set(data.productIds));
    }
  }

  return (
    <Box
      data-testid={TESTIDS.favoritesList}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categoryById.get(product.categoryId)}
          isFavorite={favorites.has(product.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </Box>
  );
}
