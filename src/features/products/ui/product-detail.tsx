"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/shared/routes";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";
import { productFormatPrice } from "../lib/product-format-price";
import type { ProductCategory, ProductItem } from "../product-types";
import { ProductRatingStars } from "./product-rating-stars";

interface ProductDetailProps {
  product: ProductItem;
  category?: ProductCategory;
  isFavorite: boolean;
}

// Static copy for the detail page. No bare text in the markup.
const DETAIL_TEXT = {
  back: "Back to products",
  brandLabel: "Brand",
  colorLabel: "Color",
  inStock: "In stock",
} as const;

// Original "compare at" price a discount is applied to (compareAt > price).
// Mirrors product-card.tsx.
function compareAtPrice(price: number, discountPercent: number): number {
  return price / (1 - discountPercent / 100);
}

export function ProductDetail({ product, category, isFavorite }: ProductDetailProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const outOfStock = product.inStock !== 1;
  const hasDiscount = product.discountPercent > 0;
  const wasPrice = hasDiscount ? compareAtPrice(product.price, product.discountPercent) : null;

  async function handleAddToCart() {
    setBusy(true);
    try {
      await fetch(PRODUCT_CONFIG.api.cart, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      // Refresh so the server-rendered header cart-count updates.
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function handleToggleFavorite() {
    // Optimistic toggle, then reconcile with the server. Revert on failure so the
    // heart never lies about the persisted state (mirrors product-list.tsx).
    const snapshot = favorite;
    setFavorite(!snapshot);
    fetch(PRODUCT_CONFIG.api.favorites, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          setFavorite(snapshot);
          return;
        }
        const data = (await res.json()) as { productIds: string[] };
        setFavorite(data.productIds.includes(product.id));
      })
      .catch(() => setFavorite(snapshot));
  }

  return (
    <Box data-testid={TESTIDS.productDetail} data-product-id={product.id} className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href={ROUTES.products} data-testid={TESTIDS.productDetailBack}>
          <ArrowLeft />
          {DETAIL_TEXT.back}
        </Link>
      </Button>

      <Card className="overflow-hidden p-0">
        <Box className="grid gap-0 md:grid-cols-2">
          {/* Image side. */}
          <Box className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={cn("size-full object-cover", outOfStock && "opacity-60 grayscale")}
            />
            <span
              className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-8xl opacity-40"
              aria-hidden
            >
              {product.image}
            </span>
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                -{product.discountPercent}%
              </span>
            )}
          </Box>

          {/* Info side. */}
          <CardContent className="space-y-4 p-6">
            <Box className="flex items-center justify-between gap-2">
              <Badge variant="muted" className="uppercase tracking-wide">
                {category?.name ?? product.categoryId}
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {product.brand}
              </span>
            </Box>

            <h1
              data-testid={TESTIDS.productDetailName}
              className="text-2xl font-bold tracking-tight text-foreground"
            >
              {product.name}
            </h1>

            <ProductRatingStars rating={product.rating} reviewCount={product.reviewCount} />

            <Box className="flex items-baseline gap-2">
              <p
                data-testid={TESTIDS.productDetailPrice}
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                {productFormatPrice(product.price)}
              </p>
              {wasPrice && (
                <p className="text-base font-medium text-muted-foreground line-through">
                  {productFormatPrice(wasPrice)}
                </p>
              )}
            </Box>

            <Separator />

            <p
              data-testid={TESTIDS.productDetailDescription}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {product.description}
            </p>

            <Box className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Box className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {DETAIL_TEXT.colorLabel}
                </span>
                <span className="text-foreground">{product.color}</span>
              </Box>
              <Badge variant={outOfStock ? "muted" : "secondary"}>
                {outOfStock ? PRODUCT_CONFIG.text.outOfStock : DETAIL_TEXT.inStock}
              </Badge>
            </Box>

            <Separator />

            <Box className="flex items-center gap-3">
              <Button
                data-testid={TESTIDS.addToCartBtn}
                data-product-id={product.id}
                onClick={handleAddToCart}
                disabled={busy || outOfStock}
                className="flex-1"
              >
                <ShoppingCart />
                {outOfStock ? PRODUCT_CONFIG.text.outOfStock : PRODUCT_CONFIG.text.addToCart}
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid={TESTIDS.favoriteBtn}
                data-product-id={product.id}
                data-active={favorite ? "true" : "false"}
                aria-pressed={favorite}
                aria-label={PRODUCT_CONFIG.text.favorite}
                onClick={handleToggleFavorite}
                className={cn("size-10 rounded-full", favorite && "text-rose-500")}
              >
                <Heart className={cn("size-4", favorite && "fill-rose-500")} />
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
