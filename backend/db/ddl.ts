import type Database from "better-sqlite3";
import { sqlite } from "./client";

// Raw DDL kept alongside the drizzle schema so reset/seeds can (re)build the
// SQLite file without a migration step. Keep columns in sync with schema.ts.
const CREATE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id),
    image TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    brand TEXT NOT NULL,
    rating REAL NOT NULL,
    review_count INTEGER NOT NULL,
    color TEXT NOT NULL,
    in_stock INTEGER NOT NULL,
    discount_percent INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    UNIQUE(user_id, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    qty INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    qty INTEGER NOT NULL,
    price REAL NOT NULL
  )`,
];

// Order matters for drops due to FK references.
const DROP_ORDER = [
  "order_items",
  "orders",
  "cart_items",
  "favorites",
  "products",
  "categories",
  "users",
];

export function createAllTables(handle: Database.Database = sqlite): void {
  for (const stmt of CREATE_STATEMENTS) handle.exec(stmt);
}

export function dropAllTables(handle: Database.Database = sqlite): void {
  handle.pragma("foreign_keys = OFF");
  for (const table of DROP_ORDER) handle.exec(`DROP TABLE IF EXISTS ${table}`);
  handle.pragma("foreign_keys = ON");
}
