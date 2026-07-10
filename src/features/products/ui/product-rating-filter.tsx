"use client";

import { Star } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";

interface ProductRatingFilterProps {
  minRating: number;
  onSelect: (minRating: number) => void;
}

// Single-select "N+ stars" toggle group. Clicking the active option clears it (back to 0).
export function ProductRatingFilter({ minRating, onSelect }: ProductRatingFilterProps) {
  return (
    <Box className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {PRODUCT_CONFIG.text.ratingLabel}
      </span>
      <Box data-testid={TESTIDS.ratingFilter} className="flex flex-col gap-1.5">
        {PRODUCT_CONFIG.ratingOptions.map((option) => {
          const isActive = minRating === option.value;
          return (
            <Button
              key={option.value}
              data-testid={TESTIDS.ratingOption}
              data-rating={option.value}
              data-active={isActive ? "true" : "false"}
              variant={isActive ? "primary" : "outline"}
              size="sm"
              onClick={() => onSelect(isActive ? 0 : option.value)}
              className="justify-start"
            >
              <Star className={cn("size-3.5", isActive ? "fill-current" : "fill-amber-400 text-amber-400")} />
              {option.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
