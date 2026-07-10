import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ROUTES } from "@/shared/routes";
import { TESTIDS } from "@/shared/testids";
import { getSessionUser } from "@backend/session";
import { listCategories, listProducts } from "@backend/services/products-service";
import { getFavoriteProductIds } from "@backend/services/favorites-service";
import { FAVORITES_CONFIG } from "@/features/favorites/favorites-config";
import { FavoritesGrid } from "@/features/favorites/ui/favorites-grid";

// Server component: favorites are visible only after login (products-only-after-login rule).
export default async function FavoritesPage() {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  const favoriteIds = getFavoriteProductIds(user.id);
  const categories = listCategories();
  // Keep favorite order; drop any id whose product no longer exists.
  const byId = new Map(listProducts().map((p) => [p.id, p]));
  const favorites = favoriteIds.map((id) => byId.get(id)).filter((p) => p != null);

  return (
    <Box data-testid={TESTIDS.favoritesPage} className="space-y-8">
      <Box className="space-y-1">
        <Heading level={1}>{FAVORITES_CONFIG.text.heading}</Heading>
        <Text className="text-base">{FAVORITES_CONFIG.text.subtitle}</Text>
      </Box>

      {favorites.length === 0 ? (
        <Card
          data-testid={TESTIDS.favoritesEmpty}
          className="items-center gap-2 px-6 py-16 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Heart className="size-6" />
          </span>
          <p className="text-base font-semibold text-foreground">
            {FAVORITES_CONFIG.text.emptyTitle}
          </p>
          <Text>{FAVORITES_CONFIG.text.emptyMessage}</Text>
          <Button asChild className="mt-2">
            <Link href={FAVORITES_CONFIG.routes.products}>
              {FAVORITES_CONFIG.text.browseCta}
            </Link>
          </Button>
        </Card>
      ) : (
        <FavoritesGrid products={favorites} categories={categories} favoriteIds={favoriteIds} />
      )}
    </Box>
  );
}
