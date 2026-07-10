import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserId } from "@backend/session";
import { getCart, addToCart } from "@backend/services/cart-service";
import { productExists } from "@backend/services/products-service";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(getCart(userId));
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const productId = (body as { productId?: unknown }).productId;
  if (typeof productId !== "string" || !productId) {
    return NextResponse.json({ error: "invalid_product" }, { status: 400 });
  }
  if (!productExists(productId)) {
    return NextResponse.json({ error: "product_not_found" }, { status: 404 });
  }

  addToCart(userId, productId);
  return NextResponse.json(getCart(userId));
}
