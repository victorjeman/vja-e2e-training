"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TESTIDS } from "@/shared/testids";
import { ROUTES } from "@/shared/routes";
import { AUTH_CONFIG } from "../auth-config";

export function AuthLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch(AUTH_CONFIG.logout.api, { method: "POST" });
    router.push(ROUTES.login);
    router.refresh();
  }

  return (
    <Button
      data-testid={TESTIDS.logoutBtn}
      variant="outline"
      size="sm"
      onClick={handleLogout}
    >
      <LogOut />
      {AUTH_CONFIG.logout.label}
    </Button>
  );
}
