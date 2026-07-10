import { API } from "@/shared/routes";

// All cart/checkout text + api paths. No bare text in components.
export const CART_CONFIG = {
  heading: "Your Cart",
  text: {
    subtitle: "Review your items and place your order.",
    empty: "Your cart is empty.",
    emptyHint: "Browse the catalog and add a few items to get started.",
    browseProducts: "Browse products",
    itemsTitle: "Items",
    summaryTitle: "Order summary",
    subtotalLabel: "Subtotal",
    totalLabel: "Total",
    qtyLabel: "Qty",
    remove: "Remove",
    checkout: "Checkout",
    checkingOut: "Placing order...",
    successTitle: "Order placed!",
    success: "Order placed successfully!",
    emptyCartError: "Your cart is empty. Add items before checking out.",
    genericError: "Something went wrong. Please try again.",
  },
  api: {
    cart: API.cart,
    cartItem: API.cartItem,
    orders: API.orders,
  },
} as const;
