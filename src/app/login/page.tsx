import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/shared/routes";
import { DEMO_CREDENTIALS } from "@/shared/demo";
import { AUTH_CONFIG } from "@/features/auth/auth-config";
import { AuthLoginForm } from "@/features/auth/ui/auth-login-form";
import { getSessionUser } from "@backend/session";

const CFG = AUTH_CONFIG.login;

export default async function LoginPage() {
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
          <div className="rounded-lg border border-primary/25 bg-accent/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <KeyRound className="size-4 text-primary" />
              {CFG.demoTitle}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{CFG.demoHint}</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{CFG.demoEmailLabel}</dt>
                <dd>
                  <code className="rounded bg-background px-2 py-0.5 font-mono text-foreground">
                    {DEMO_CREDENTIALS.email}
                  </code>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{CFG.demoPasswordLabel}</dt>
                <dd>
                  <code className="rounded bg-background px-2 py-0.5 font-mono text-foreground">
                    {DEMO_CREDENTIALS.password}
                  </code>
                </dd>
              </div>
            </dl>
          </div>

          <AuthLoginForm />

          <p className="text-center text-sm text-muted-foreground">
            {CFG.registerPrompt}{" "}
            <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
              {CFG.registerLink}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
