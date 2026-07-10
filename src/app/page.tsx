import Link from "next/link";
import { ArrowRight, Heart, PackageCheck, ShoppingCart, Sparkles } from "lucide-react";
import { ROUTES } from "@/shared/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HIGHLIGHTS = [
  {
    icon: PackageCheck,
    title: "Browse the catalog",
    body: "Filter by category, price range, and search across a seeded product catalog.",
  },
  {
    icon: Heart,
    title: "Save favorites",
    body: "Toggle favorites that persist to the database across page refreshes.",
  },
  {
    icon: ShoppingCart,
    title: "Cart & checkout",
    body: "Add items, watch the cart counter update, then place an order.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 shadow-sm sm:px-12">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            QA training storefront
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A tiny online store, built for practicing Playwright
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Shop the catalog, manage a cart and favorites, and check out. Every element carries a
            stable data-testid so you can write reliable end-to-end tests against it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={ROUTES.products}>
                Shop products
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={ROUTES.login}>Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.title} className="gap-3 py-5">
            <CardContent className="space-y-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <item.icon className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
