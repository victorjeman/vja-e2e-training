"use client";

import { PRODUCT_CONFIG } from "../product-config";
import { TESTIDS } from "@/shared/testids";
import type { ProductSortValue } from "../product-types";

interface ProductSortSelectProps {
  value: ProductSortValue;
  onChange: (value: ProductSortValue) => void;
}

// Native select carrying the sort-select testid, with the 5 sort options.
export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
  return (
    <select
      data-testid={TESTIDS.sortSelect}
      aria-label={PRODUCT_CONFIG.text.sortLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as ProductSortValue)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {PRODUCT_CONFIG.sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
