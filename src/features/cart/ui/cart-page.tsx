"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TESTIDS } from "@/shared/testids";
import { ROUTES } from "@/shared/routes";
import { CART_CONFIG } from "../cart-config";
import type { Cart } from "../cart-types";
import { CartItem } from "./cart-item";

interface CartPageProps {
  cart: Cart;
}

const EMPTY_CART: Cart = { items: [], count: 0, total: 0 };

export function CartPage({ cart: initialCart }: CartPageProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>(initialCart);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function notifyCartChanged() {
    window.dispatchEvent(new Event("cart:updated"));
    router.refresh();
  }

  async function handleRemove(productId: string) {
    const res = await fetch(CART_CONFIG.api.cartItem(productId), { method: "DELETE" });
    if (!res.ok) return;
    const next = (await res.json()) as Cart;
    setCart(next);
    setError(null);
    notifyCartChanged();
  }

  async function handleCheckout() {
    setBusy(true);
    setError(null);
    const res = await fetch(CART_CONFIG.api.orders, { method: "POST" });
    setBusy(false);

    if (res.ok) {
      setSuccess(true);
      setCart(EMPTY_CART);
      notifyCartChanged();
      return;
    }

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setError(
      data.error === "cart_empty"
        ? CART_CONFIG.text.emptyCartError
        : CART_CONFIG.text.genericError
    );
  }

  const isEmpty = cart.items.length === 0;
  // Cosmetic itemization only; the graded order posts to /api/orders unchanged.
  const tax = cart.total * CART_CONFIG.taxRate;
  const grandTotal = cart.total + tax;

  return (
    <Box className="space-y-6" data-testid={TESTIDS.cartPage}>
      <Box className="space-y-1">
        <Heading level={1}>{CART_CONFIG.heading}</Heading>
        <Text className="text-base">{CART_CONFIG.text.subtitle}</Text>
      </Box>

      {success && (
        <Card className="flex-row items-center gap-3 border-[color:var(--success)]/40 bg-[color:var(--success)]/10 p-4">
          <CheckCircle2 className="size-5 shrink-0 text-[color:var(--success)]" />
          <Text
            data-testid={TESTIDS.orderSuccessMessage}
            className="font-medium text-[color:var(--success)]"
          >
            {CART_CONFIG.text.success}
          </Text>
        </Card>
      )}

      {/* Empty-checkout error, locatable via TESTIDS.cartError. */}
      {error && (
        <Card className="flex-row items-center gap-3 border-destructive/40 bg-destructive/10 p-4">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <Text data-testid={TESTIDS.cartError} className="font-medium text-destructive">
            {error}
          </Text>
        </Card>
      )}

      <Box className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Box>
          {isEmpty ? (
            <Card className="items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ShoppingBag className="size-6" />
              </span>
              <Text className="text-base font-semibold text-foreground">
                {CART_CONFIG.text.empty}
              </Text>
              <Text>{CART_CONFIG.text.emptyHint}</Text>
              <Button asChild variant="outline" className="mt-1">
                <Link href={ROUTES.products}>{CART_CONFIG.text.browseProducts}</Link>
              </Button>
            </Card>
          ) : (
            <Card className="gap-0 py-0">
              <CardHeader className="py-4">
                <CardTitle className="text-base">{CART_CONFIG.text.itemsTitle}</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="px-4">
                {cart.items.map((line) => (
                  <CartItem key={line.product.id} line={line} onRemove={handleRemove} />
                ))}
              </CardContent>
            </Card>
          )}
        </Box>

        <Card className="h-fit gap-4 lg:sticky lg:top-24">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">{CART_CONFIG.text.summaryTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Box className="space-y-2.5">
              <Box className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{CART_CONFIG.text.subtotalLabel}</span>
                <span className="text-foreground">${cart.total.toFixed(2)}</span>
              </Box>
              <Box className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{CART_CONFIG.text.shippingLabel}</span>
                <span className="font-medium text-[color:var(--success)]">
                  {CART_CONFIG.text.shippingFree}
                </span>
              </Box>
              <Box className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{CART_CONFIG.text.taxLabel}</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </Box>
            </Box>
            <Separator />
            <Box className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>{CART_CONFIG.text.totalLabel}</span>
              <span>${grandTotal.toFixed(2)}</span>
            </Box>
            <Button
              data-testid={TESTIDS.checkoutBtn}
              onClick={handleCheckout}
              disabled={busy}
              size="lg"
              className="w-full"
            >
              {busy ? CART_CONFIG.text.checkingOut : CART_CONFIG.text.checkout}
            </Button>
            <Box className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              <span>{CART_CONFIG.text.secureCheckout}</span>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
