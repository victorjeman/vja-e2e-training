import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Page-width container (not shadcn). Forwards className + arbitrary props.
export function Container({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...rest}>
      {children}
    </div>
  );
}
