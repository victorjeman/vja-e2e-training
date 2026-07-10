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

interface ProductCardProps {
  product: ProductItem;
  category?: ProductCategory;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export function ProductCard({ product, category, isFavorite, onToggleFavorite }: ProductCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

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
      className="group gap-0 overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <Box className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-accent/70 to-muted">
        <span className="text-6xl transition-transform duration-300 group-hover:scale-110" aria-hidden>
          {product.image}
        </span>
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
            "absolute right-3 top-3 size-9 rounded-full bg-background/90 backdrop-blur",
            isFavorite && "border-primary/40 text-primary"
          )}
        >
          <Heart className={cn("size-4", isFavorite && "fill-primary")} />
        </Button>
      </Box>

      <CardContent className="space-y-3 p-4">
        <Box className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
          <Badge variant="muted">{category?.name ?? product.categoryId}</Badge>
        </Box>
        <p className="text-xl font-bold tracking-tight text-foreground">
          {productFormatPrice(product.price)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          data-testid={TESTIDS.addToCartBtn}
          data-product-id={product.id}
          onClick={handleAddToCart}
          disabled={busy}
          className="w-full"
        >
          <ShoppingCart />
          {PRODUCT_CONFIG.text.addToCart}
        </Button>
      </CardFooter>
    </Card>
  );
}
