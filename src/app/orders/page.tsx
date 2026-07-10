import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { getSessionUser } from "@backend/session";
import { listOrdersWithItems } from "@backend/services/orders-service";
import { ROUTES } from "@/shared/routes";
import { TESTIDS } from "@/shared/testids";
import { Box } from "@/components/ui/box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { productFormatPrice } from "@/features/products/lib/product-format-price";

// All static copy for the real order-history page. No bare text in the markup.
const ORDERS_TEXT = {
  badge: "History",
  title: "Order history",
  subtitle: "Every order you have placed, newest first.",
  itemsLabel: "items",
  itemLabel: "item",
  totalLabel: "Total",
  qtyLabel: "Qty",
  empty: "You have not placed any orders yet.",
  emptyHint: "Browse the catalog and place your first order.",
  browseProducts: "Browse products",
} as const;

// Format an ISO timestamp as a short, stable date label (e.g. "Jun 28, 2026").
function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Real, DB-backed order history for the logged-in user. Protected route.
export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  const orders = listOrdersWithItems(user.id);

  return (
    <Box className="space-y-6" data-testid={TESTIDS.ordersPage}>
      <Box className="space-y-2">
        <Badge variant="secondary">{ORDERS_TEXT.badge}</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{ORDERS_TEXT.title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{ORDERS_TEXT.subtitle}</p>
      </Box>

      {orders.length === 0 ? (
        <Card
          data-testid={TESTIDS.ordersEmpty}
          className="items-center gap-3 px-6 py-16 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ShoppingBag className="size-6" />
          </span>
          <p className="text-base font-semibold text-foreground">{ORDERS_TEXT.empty}</p>
          <p className="text-sm text-muted-foreground">{ORDERS_TEXT.emptyHint}</p>
          <Button asChild variant="outline" className="mt-1">
            <Link href={ROUTES.products}>{ORDERS_TEXT.browseProducts}</Link>
          </Button>
        </Card>
      ) : (
        <Box className="space-y-4" data-testid={TESTIDS.ordersList}>
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, line) => sum + line.qty, 0);
            return (
              <Card key={order.id} data-testid={TESTIDS.orderCard} data-order-id={order.id}>
                <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
                  <Box className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Package className="size-4" />
                    </span>
                    <Box>
                      <p className="text-sm font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)} · {itemCount}{" "}
                        {itemCount === 1 ? ORDERS_TEXT.itemLabel : ORDERS_TEXT.itemsLabel}
                      </p>
                    </Box>
                  </Box>
                  <Badge variant="muted" className="gap-1 text-[color:var(--success)]">
                    <CheckCircle2 className="size-3" />
                    {order.status}
                  </Badge>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3 pt-2">
                  {order.items.map((line) => (
                    <Box key={line.product.id} className="flex items-center gap-3">
                      <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={line.product.imageUrl}
                          alt={line.product.name}
                          className="size-full object-cover"
                        />
                      </span>
                      <span className="flex-1 text-sm text-foreground">{line.product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ORDERS_TEXT.qtyLabel} {line.qty}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {productFormatPrice(line.price)}
                      </span>
                    </Box>
                  ))}
                  <Separator />
                  <Box className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {ORDERS_TEXT.totalLabel}
                    </span>
                    <span
                      data-testid={TESTIDS.orderTotal}
                      className="text-sm font-semibold text-foreground"
                    >
                      {productFormatPrice(order.total)}
                    </span>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
