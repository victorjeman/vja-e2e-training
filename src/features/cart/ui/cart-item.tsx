"use client";

import { Trash2 } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { TESTIDS } from "@/shared/testids";
import { CART_CONFIG } from "../cart-config";
import type { CartLine } from "../cart-types";

interface CartItemProps {
  line: CartLine;
  onRemove: (productId: string) => void;
}

// A single cart row: product thumbnail/name/price/qty + remove button.
export function CartItem({ line, onRemove }: CartItemProps) {
  const { product, qty } = line;
  return (
    <Box className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <Box className="flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-accent/70 text-3xl">
          {product.image}
        </span>
        <Box className="space-y-0.5">
          <Text className="font-medium text-foreground">{product.name}</Text>
          <Text className="text-xs">
            ${product.price.toFixed(2)} · {CART_CONFIG.text.qtyLabel} {qty}
          </Text>
        </Box>
      </Box>
      <Box className="flex items-center gap-4">
        <span className="hidden text-sm font-semibold text-foreground sm:inline">
          ${(product.price * qty).toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          data-testid={TESTIDS.removeCartItemBtn}
          data-product-id={product.id}
          aria-label={CART_CONFIG.text.remove}
          onClick={() => onRemove(product.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </Box>
    </Box>
  );
}
