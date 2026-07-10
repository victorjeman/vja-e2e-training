"use client";

import { Box } from "@/components/ui/box";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";

interface ProductColorFilterProps {
  colors: string[];
  selected: string[];
  onToggle: (color: string) => void;
}

// Maps a palette color name to a css swatch color.
const SWATCH: Record<string, string> = {
  black: "#111827",
  white: "#ffffff",
  silver: "#c0c0c0",
  blue: "#2563eb",
  red: "#dc2626",
  green: "#16a34a",
  beige: "#e8dcc0",
  gray: "#6b7280",
};

// Multi-select color list. Each option is a real checkbox carrying data-color.
export function ProductColorFilter({ colors, selected, onToggle }: ProductColorFilterProps) {
  const active = new Set(selected);

  return (
    <Box className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {PRODUCT_CONFIG.text.colorLabel}
      </span>
      <Box data-testid={TESTIDS.colorFilter} className="flex flex-col gap-1.5">
        {colors.map((color) => (
          <label
            key={color}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              type="checkbox"
              data-testid={TESTIDS.colorOption}
              data-color={color}
              checked={active.has(color)}
              onChange={() => onToggle(color)}
              className="size-4 accent-primary"
            />
            <span
              aria-hidden
              className="inline-block size-3.5 rounded-full border border-border"
              style={{ backgroundColor: SWATCH[color.toLowerCase()] ?? color.toLowerCase() }}
            />
            <span>{color}</span>
          </label>
        ))}
      </Box>
    </Box>
  );
}
