import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { orders, orderItems, cartItems, products, type Product } from "../db/schema";
import { getCart } from "./cart-service";

export interface CheckoutSuccess {
  orderId: string;
}

export interface CheckoutError {
  error: "cart_empty";
}

export type CheckoutResult = CheckoutSuccess | CheckoutError;

// Turn the current cart into an order, then clear the cart.
// Returns { error: 'cart_empty' } when the cart is empty (no order created).
// better-sqlite3 is synchronous, so this stays a plain sync function.
export function checkout(userId: string): CheckoutResult {
  const cart = getCart(userId);
  if (cart.items.length === 0) return { error: "cart_empty" };

  const orderId = randomUUID();
  // All three writes (order + its items + clearing the cart) must succeed or none
  // should: wrap them in a single transaction so a failure can't leave a confirmed
  // order with partial items and an un-cleared cart.
  db.transaction((tx) => {
    tx.insert(orders)
      .values({
        id: orderId,
        userId,
        total: cart.total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      })
      .run();

    for (const line of cart.items) {
      tx.insert(orderItems)
        .values({
          id: randomUUID(),
          orderId,
          productId: line.product.id,
          qty: line.qty,
          price: line.product.price,
        })
        .run();
    }

    tx.delete(cartItems).where(eq(cartItems.userId, userId)).run();
  });
  return { orderId };
}

// A single order line: the joined product row, its quantity, and the price paid.
export interface OrderLine {
  product: Product;
  qty: number;
  price: number;
}

// One order plus its joined line items, shape returned to the orders page.
export interface OrderWithItems {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderLine[];
}

// The user's orders, newest first, each with its line items joined to products.
// better-sqlite3 is synchronous, so this stays a plain sync function.
export function listOrdersWithItems(userId: string): OrderWithItems[] {
  const orderRows = db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .all();

  return orderRows.map((order) => {
    const lineRows = db
      .select({ product: products, qty: orderItems.qty, price: orderItems.price })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id))
      .all();

    const items: OrderLine[] = lineRows.map((r) => ({
      product: r.product,
      qty: r.qty,
      price: r.price,
    }));

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items,
    };
  });
}
