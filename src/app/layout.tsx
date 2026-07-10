import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import "./globals.css";
import { TESTIDS } from "@/shared/testids";
import { ROUTES } from "@/shared/routes";
import { Container } from "@/components/ui/container";
import { AuthLogoutButton } from "@/features/auth/ui/auth-logout-button";
import { getSessionUserId } from "@backend/session";
import { getCartCount } from "@backend/services/cart-service";

export const metadata: Metadata = {
  title: "VJA Store (QA Training)",
  description: "A QA training mini online store for writing Playwright e2e tests.",
};

// Root layout renders a session-aware store header. The cart count is rendered
// server-side; product/cart mutations call router.refresh() so this re-renders
// with the new count (CONTRACT §4).
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId();
  const cartCount = userId ? getCartCount(userId) : 0;

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <Container className="flex h-16 items-center justify-between gap-4">
            <Link href={ROUTES.home} className="flex items-center gap-2 font-bold text-foreground">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <ShoppingBag className="size-5" />
              </span>
              <span className="text-lg tracking-tight">VJA Store</span>
            </Link>

            <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
              <Link
                href={ROUTES.products}
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Products
              </Link>

              {/* Favorites nav link, logged-in only, next to Products. */}
              {userId && (
                <Link
                  href={ROUTES.favorites}
                  data-testid={TESTIDS.favoritesLink}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Heart className="size-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Link>
              )}

              <Link
                href={ROUTES.cart}
                data-testid={TESTIDS.cartLink}
                className="relative inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ShoppingCart className="size-4" />
                <span className="hidden sm:inline">Cart</span>
                <span
                  data-testid={TESTIDS.cartCount}
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {cartCount}
                </span>
              </Link>

              {userId ? (
                <AuthLogoutButton />
              ) : (
                <>
                  <Link
                    href={ROUTES.login}
                    className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.register}
                    className="rounded-md bg-primary px-3 py-2 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </Container>
        </header>

        <main className="py-10">
          <Container>{children}</Container>
        </main>

        <footer className="border-t border-border/70 py-6">
          <Container className="flex flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
            <span>VJA Store, a demo storefront for practicing Playwright e2e tests.</span>
            <nav className="flex items-center gap-4">
              <Link href={ROUTES.products} className="transition-colors hover:text-foreground">
                Products
              </Link>
              {/* Cosmetic demo pages; literal paths since src/shared/routes.ts is off-limits. */}
              <Link href="/checkout" className="transition-colors hover:text-foreground">
                Checkout preview
              </Link>
              <Link href="/orders" className="transition-colors hover:text-foreground">
                Orders
              </Link>
            </nav>
          </Container>
        </footer>
      </body>
    </html>
  );
}
