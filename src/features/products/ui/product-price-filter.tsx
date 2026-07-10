"use client";

import { Box } from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";

interface ProductPriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function ProductPriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange }: ProductPriceFilterProps) {
  return (
    <Box data-testid={TESTIDS.priceFilter} className="flex flex-col gap-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {PRODUCT_CONFIG.text.priceLabel}
      </Label>
      <Box className="flex items-center gap-2">
        <Input
          type="number"
          data-testid={TESTIDS.priceMinInput}
          aria-label={PRODUCT_CONFIG.text.priceMinLabel}
          placeholder={PRODUCT_CONFIG.text.priceMinPlaceholder}
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="number"
          data-testid={TESTIDS.priceMaxInput}
          aria-label={PRODUCT_CONFIG.text.priceMaxLabel}
          placeholder={PRODUCT_CONFIG.text.priceMaxPlaceholder}
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-24"
        />
      </Box>
    </Box>
  );
}
