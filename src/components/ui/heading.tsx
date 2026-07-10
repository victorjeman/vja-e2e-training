import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
}

const SIZES: Record<1 | 2 | 3, string> = {
  1: "text-3xl font-bold tracking-tight",
  2: "text-2xl font-semibold tracking-tight",
  3: "text-lg font-semibold",
};

// Heading primitive (not shadcn). Forwards className + arbitrary props.
export function Heading({ level = 1, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Tag className={cn(SIZES[level], "text-foreground", className)} {...rest}>
      {children}
    </Tag>
  );
}
