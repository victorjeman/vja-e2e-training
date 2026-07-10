"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { TESTIDS } from "@/shared/testids";
import { PRODUCT_CONFIG } from "../product-config";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Builds a windowed list of page numbers around the current page (with first/last),
// using -1 as an ellipsis marker.
function buildPageWindow(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const withGaps: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) withGaps.push(-1);
    withGaps.push(sorted[i]);
  }
  return withGaps;
}

export function ProductPagination({ page, totalPages, onPageChange }: ProductPaginationProps) {
  const window = buildPageWindow(page, totalPages);

  return (
    <Box
      data-testid={TESTIDS.pagination}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        data-testid={TESTIDS.paginationPrev}
        aria-label={PRODUCT_CONFIG.text.prev}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
        {PRODUCT_CONFIG.text.prev}
      </Button>

      {window.map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "primary" : "outline"}
            size="sm"
            data-testid={TESTIDS.paginationPage}
            data-page={p}
            data-active={p === page ? "true" : "false"}
            aria-label={`${PRODUCT_CONFIG.text.goToPage} ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className="min-w-9"
          >
            {p}
          </Button>
        )
      )}

      <span data-testid={TESTIDS.pageInfo} className="px-2 text-sm text-muted-foreground">
        {PRODUCT_CONFIG.text.pageInfo} {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        data-testid={TESTIDS.paginationNext}
        aria-label={PRODUCT_CONFIG.text.next}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {PRODUCT_CONFIG.text.next}
        <ChevronRight />
      </Button>
    </Box>
  );
}
