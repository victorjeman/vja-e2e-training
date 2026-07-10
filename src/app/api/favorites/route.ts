import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserId } from "@backend/session";
import { getFavoriteProductIds, toggleFavorite } from "@backend/services/favorites-service";
import { productExists } from "@backend/services/products-service";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  return NextResponse.json({ productIds: getFavoriteProductIds(userId) });
}

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { productId?: string } | null;
  if (!body?.productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  if (!productExists(body.productId)) {
    return NextResponse.json({ error: "product_not_found" }, { status: 404 });
  }

  return NextResponse.json({ productIds: toggleFavorite(userId, body.productId) });
}
