import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/shared/routes";
import { AUTH_CONFIG } from "@/features/auth/auth-config";
import { AuthRegisterForm } from "@/features/auth/ui/auth-register-form";
import { getSessionUser } from "@backend/session";

const CFG = AUTH_CONFIG.register;

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(ROUTES.products);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-6">
      <Card className="shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{CFG.heading}</CardTitle>
          <CardDescription>{CFG.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <AuthRegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            {CFG.loginPrompt}{" "}
            <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
              {CFG.loginLink}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
