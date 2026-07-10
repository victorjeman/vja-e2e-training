import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { users, type User } from "./db/schema";

const COOKIE_NAME = "session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

function verify(value: string, signature: string): boolean {
  const expected = sign(value);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Cookie value format: `${userId}.${signature}`.
export async function createSession(userId: string): Promise<void> {
  const token = `${userId}.${sign(userId)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const idx = raw.lastIndexOf(".");
  if (idx < 0) return null;
  const userId = raw.slice(0, idx);
  const signature = raw.slice(idx + 1);
  if (!verify(userId, signature)) return null;
  // Confirm the user still exists. Seeds re-mint user ids between runs, so a cookie
  // from a prior seed can carry a valid signature over a since-deleted userId. Treating
  // that as logged-out (rather than trusting it) prevents foreign-key 500s on later
  // cart/favorite/order writes and keeps guards redirecting cleanly to /login.
  const exists = db.select({ id: users.id }).from(users).where(eq(users.id, userId)).get();
  if (!exists) return null;
  return userId;
}

export async function getSessionUser(): Promise<User | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  // better-sqlite3 is synchronous under the hood.
  const row = db.select().from(users).where(eq(users.id, userId)).get();
  return row ?? null;
}
