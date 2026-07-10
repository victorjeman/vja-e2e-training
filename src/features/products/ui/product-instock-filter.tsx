"use client";

import { PRODUCT_CONFIG } from "../product-config";
import { TESTIDS } from "@/shared/testids";

interface ProductInStockFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Real checkbox: when on, only in-stock products are shown.
export function ProductInStockFilter({ checked, onChange }: ProductInStockFilterProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
      <input
        type="checkbox"
        data-testid={TESTIDS.inStockFilter}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-primary"
      />
      <span>{PRODUCT_CONFIG.text.inStockLabel}</span>
    </label>
  );
}
