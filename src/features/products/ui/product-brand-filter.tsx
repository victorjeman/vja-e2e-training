"use client";

import { Box } from "@/components/ui/box";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";

interface ProductBrandFilterProps {
  brands: string[];
  selected: string[];
  onToggle: (brand: string) => void;
}

// Multi-select brand list. Each option is a real checkbox carrying data-brand.
export function ProductBrandFilter({ brands, selected, onToggle }: ProductBrandFilterProps) {
  const active = new Set(selected);

  return (
    <Box className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {PRODUCT_CONFIG.text.brandLabel}
      </span>
      <Box
        data-testid={TESTIDS.brandFilter}
        className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1"
      >
        {brands.map((brand) => (
          <label
            key={brand}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              type="checkbox"
              data-testid={TESTIDS.brandOption}
              data-brand={brand}
              checked={active.has(brand)}
              onChange={() => onToggle(brand)}
              className="size-4 accent-primary"
            />
            <span>{brand}</span>
          </label>
        ))}
      </Box>
    </Box>
  );
}
