import { notFound, redirect } from "next/navigation";
import { ROUTES } from "@/shared/routes";
import { getSessionUser } from "@backend/session";
import { getProductById, listCategories } from "@backend/services/products-service";
import { getFavoriteProductIds } from "@backend/services/favorites-service";
import { ProductDetail } from "@/features/products/ui/product-detail";

interface ProductDetailPageProps {
  // Next 15 passes route params as a promise.
  params: Promise<{ id: string }>;
}

// Server component: a single product is visible only after login. Coexists with the
// /products list page and its ?category= deep-link (App Router resolves the static
// segment before this dynamic one).
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const category = listCategories().find((c) => c.id === product.categoryId);
  const favoriteIds = getFavoriteProductIds(user.id);

  return (
    <ProductDetail
      product={product}
      category={category}
      isFavorite={favoriteIds.includes(product.id)}
    />
  );
}
