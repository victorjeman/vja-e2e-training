import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { orders, orderItems, cartItems } from "../db/schema";
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
