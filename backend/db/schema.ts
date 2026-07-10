import { sqliteTable, text, real, integer, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  image: text("image").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  // Rich attributes for multi-attribute filtering (all NOT NULL).
  brand: text("brand").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  color: text("color").notNull(),
  inStock: integer("in_stock").notNull(),
  discountPercent: integer("discount_percent").notNull(),
});

export const favorites = sqliteTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
  },
  (t) => ({
    uniqUserProduct: unique().on(t.userId, t.productId),
  })
);

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    qty: integer("qty").notNull().default(1),
  },
  (t) => ({
    uniqUserProduct: unique().on(t.userId, t.productId),
  })
);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  total: real("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: text("created_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  qty: integer("qty").notNull(),
  price: real("price").notNull(),
});

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
