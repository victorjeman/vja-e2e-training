import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { sqlite, db } from "../db/client";
import { createAllTables } from "../db/ddl";
import { categories, products } from "../db/schema";
import { CATEGORIES, ALL_PRODUCTS } from "./catalog";

// Tables that hold per-user/session state (safe to wipe between seeds).
// Catalog tables (categories/products) are preserved and re-ensured.
const RESETTABLE = ["order_items", "orders", "cart_items", "favorites", "users"] as const;
export type ResettableTable = (typeof RESETTABLE)[number];

// Password hashing shared with auth-service. Format: `${saltHex}:${hashHex}`.
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const derived = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

// Ensure schema exists before any seed operation.
function ensureSchema(): void {
  createAllTables();
}

export function resetTables(tables: readonly ResettableTable[] = RESETTABLE): void {
  ensureSchema();
  sqlite.pragma("foreign_keys = OFF");
  for (const table of tables) {
    sqlite.exec(`DELETE FROM ${table}`);
  }
  sqlite.pragma("foreign_keys = ON");
}

// Idempotent insert of the base catalog (categories + products).
export function ensureCatalog(): void {
  ensureSchema();
  for (const c of CATEGORIES) {
    db.insert(categories).values(c).onConflictDoNothing().run();
  }
  for (const p of ALL_PRODUCTS) {
    // Each product already carries its imageUrl (curated: /products/<id>.jpg,
    // generated: local pool image), so values(p) inserts every column directly.
    db.insert(products).values(p).onConflictDoNothing().run();
  }
}

export function clearUsers(): void {
  resetTables(["order_items", "orders", "cart_items", "favorites", "users"]);
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export function createUser({ name, email, password }: CreateUserInput): string {
  ensureSchema();
  const id = randomUUID();
  sqlite
    .prepare(
      "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .run(id, name, email, hashPassword(password), new Date().toISOString());
  return id;
}

export function addCartItem(userId: string, productId: string, qty = 1): void {
  ensureSchema();
  sqlite
    .prepare(
      `INSERT INTO cart_items (id, user_id, product_id, qty) VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, product_id) DO UPDATE SET qty = qty + excluded.qty`
    )
    .run(randomUUID(), userId, productId, qty);
}

export function addFavorite(userId: string, productId: string): void {
  ensureSchema();
  sqlite
    .prepare(
      `INSERT INTO favorites (id, user_id, product_id) VALUES (?, ?, ?)
       ON CONFLICT(user_id, product_id) DO NOTHING`
    )
    .run(randomUUID(), userId, productId);
}
