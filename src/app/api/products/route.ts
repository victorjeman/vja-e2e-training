import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserId } from "@backend/session";
import {
  listBrands,
  listCategories,
  listColors,
  listProducts,
  type ProductSort,
} from "@backend/services/products-service";

const SORTS: ProductSort[] = ["featured", "price-asc", "price-desc", "rating-desc", "newest"];

// Splits repeated and/or comma-separated query params into a clean string array.
function parseMulti(params: URLSearchParams, key: string): string[] | undefined {
  const values = params
    .getAll(key)
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length ? values : undefined;
}

export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const minPriceRaw = params.get("minPrice");
  const maxPriceRaw = params.get("maxPrice");
  const minRatingRaw = params.get("minRating");
  const inStockRaw = params.get("inStock");
  const sortRaw = params.get("sort");
  const sort = sortRaw && SORTS.includes(sortRaw as ProductSort) ? (sortRaw as ProductSort) : undefined;

  const products = listProducts({
    category: params.get("category") ?? undefined,
    minPrice: minPriceRaw != null && minPriceRaw !== "" ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw != null && maxPriceRaw !== "" ? Number(maxPriceRaw) : undefined,
    q: params.get("q") ?? undefined,
    brand: parseMulti(params, "brand"),
    color: parseMulti(params, "color"),
    minRating: minRatingRaw != null && minRatingRaw !== "" ? Number(minRatingRaw) : undefined,
    inStock: inStockRaw === "1" || inStockRaw === "true",
    sort,
  });

  return NextResponse.json({
    products,
    categories: listCategories(),
    brands: listBrands(),
    colors: listColors(),
  });
}
