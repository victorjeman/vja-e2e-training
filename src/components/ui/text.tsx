import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Body text primitive (not shadcn). Forwards className + arbitrary props.
export function Text({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...rest}>
      {children}
    </p>
  );
}
