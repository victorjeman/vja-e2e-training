import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Neutral layout primitive (not shadcn). Forwards className + arbitrary props.
export function Box({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
