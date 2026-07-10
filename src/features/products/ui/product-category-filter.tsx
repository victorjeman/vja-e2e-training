"use client";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";
import type { ProductCategory } from "../product-types";

// Maps a category id to its exact testid from the registry.
const CATEGORY_TESTID: Record<string, string> = {
  all: TESTIDS.categoryOptionAll,
  electronics: TESTIDS.categoryOptionElectronics,
  clothing: TESTIDS.categoryOptionClothing,
  books: TESTIDS.categoryOptionBooks,
  home: TESTIDS.categoryOptionHome,
};

interface ProductCategoryFilterProps {
  categories: ProductCategory[];
  selected: string;
  onSelect: (categoryId: string) => void;
}

export function ProductCategoryFilter({ categories, selected, onSelect }: ProductCategoryFilterProps) {
  const options = [
    { id: PRODUCT_CONFIG.categoryAllValue, name: PRODUCT_CONFIG.text.categoryAll },
    ...categories,
  ];

  return (
    <Box data-testid={TESTIDS.categoryFilter} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.id}
          data-testid={CATEGORY_TESTID[option.id]}
          size="sm"
          variant={selected === option.id ? "primary" : "outline"}
          data-active={selected === option.id ? "true" : "false"}
          onClick={() => onSelect(option.id)}
          className="rounded-full"
        >
          {option.name}
        </Button>
      ))}
    </Box>
  );
}
