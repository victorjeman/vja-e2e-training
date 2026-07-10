"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";
import { productFormatPrice } from "../lib/product-format-price";
import type { ProductCategory, ProductItem } from "../product-types";
import { ProductRatingStars } from "./product-rating-stars";

interface ProductCardProps {
  product: ProductItem;
  category?: ProductCategory;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

// Original "compare at" price a discount is applied to (compareAt > price).
function compareAtPrice(price: number, discountPercent: number): number {
  return price / (1 - discountPercent / 100);
}

export function ProductCard({ product, category, isFavorite, onToggleFavorite }: ProductCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

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

  return (
    <Card
      data-testid={TESTIDS.productCard}
      data-product-id={product.id}
      className="group gap-0 overflow-hidden py-0 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <Box className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={cn(
            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
            outOfStock && "opacity-60 grayscale"
          )}
        />
        {/* Emoji fallback kept subtle behind the photo. */}
        <span className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-6xl opacity-40" aria-hidden>
          {product.image}
        </span>

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            -{product.discountPercent}%
          </span>
        )}

        {outOfStock && (
          <span className="absolute left-3 bottom-3 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-semibold text-background shadow-sm">
            {PRODUCT_CONFIG.text.outOfStock}
          </span>
        )}

        <Button
          variant="outline"
          size="icon"
          data-testid={TESTIDS.favoriteBtn}
          data-product-id={product.id}
          data-active={isFavorite ? "true" : "false"}
          aria-pressed={isFavorite}
          aria-label={PRODUCT_CONFIG.text.favorite}
          onClick={() => onToggleFavorite(product.id)}
          className={cn(
            "absolute right-3 top-3 size-9 rounded-full border-transparent bg-background/90 shadow-sm backdrop-blur hover:bg-background",
            isFavorite && "text-rose-500"
          )}
        >
          <Heart className={cn("size-4", isFavorite && "fill-rose-500")} />
        </Button>
      </Box>

      <CardContent className="space-y-2.5 p-4">
        <Box className="flex items-center justify-between gap-2">
          <Badge variant="muted" className="uppercase tracking-wide">
            {category?.name ?? product.categoryId}
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
        </Box>
        <h3 className="text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
        <ProductRatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <Box className="flex items-baseline gap-2">
          <p className="text-xl font-bold tracking-tight text-foreground">
            {productFormatPrice(product.price)}
          </p>
          {wasPrice && (
            <p className="text-sm font-medium text-muted-foreground line-through">
              {productFormatPrice(wasPrice)}
            </p>
          )}
        </Box>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          data-testid={TESTIDS.addToCartBtn}
          data-product-id={product.id}
          onClick={handleAddToCart}
          disabled={busy || outOfStock}
          className="w-full"
        >
          <ShoppingCart />
          {outOfStock ? PRODUCT_CONFIG.text.outOfStock : PRODUCT_CONFIG.text.addToCart}
        </Button>
      </CardFooter>
    </Card>
  );
}
