import { redirect } from "next/navigation";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ROUTES } from "@/shared/routes";
import { getSessionUser } from "@backend/session";
import { listCategories, listProducts } from "@backend/services/products-service";
import { getFavoriteProductIds } from "@backend/services/favorites-service";
import { PRODUCT_CONFIG } from "@/features/products/product-config";
import { ProductList } from "@/features/products/ui/product-list";

// Server component: products are visible only after login.
export default async function ProductsPage() {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  const products = listProducts();
  const categories = listCategories();
  const favoriteIds = getFavoriteProductIds(user.id);

  return (
    <Box className="space-y-8">
      <Box className="space-y-1">
        <Heading level={1}>{PRODUCT_CONFIG.text.heading}</Heading>
        <Text className="text-base">{PRODUCT_CONFIG.text.subtitle}</Text>
      </Box>
      <ProductList products={products} categories={categories} favoriteIds={favoriteIds} />
    </Box>
  );
}
