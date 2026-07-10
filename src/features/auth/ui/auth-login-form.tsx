"use client";

// Deviation: CONTRACT bans TanStack Form standalone; using simple controlled state instead.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TESTIDS } from "@/shared/testids";
import { ROUTES } from "@/shared/routes";
import { AUTH_CONFIG } from "../auth-config";
import { authLoginSchema } from "../auth-schemas";
import { authFirstIssue } from "../lib/auth-first-issue";

const CFG = AUTH_CONFIG.login;

export function AuthLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = authLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(authFirstIssue(parsed.error).message);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(CFG.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        router.push(ROUTES.products);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? AUTH_CONFIG.messages.invalidCredentials);
    } catch {
      setError(AUTH_CONFIG.messages.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form data-testid={TESTIDS.loginForm} onSubmit={handleSubmit} className="space-y-4">
      <Box className="space-y-1.5">
        <Label htmlFor="login-email">{CFG.emailLabel}</Label>
        <Input
          id="login-email"
          data-testid={TESTIDS.loginEmailInput}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </Box>

      <Box className="space-y-1.5">
        <Label htmlFor="login-password">{CFG.passwordLabel}</Label>
        <Input
          id="login-password"
          data-testid={TESTIDS.loginPasswordInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </Box>

      {error ? (
        <Text
          data-testid={TESTIDS.loginError}
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
        >
          {error}
        </Text>
      ) : null}

      <Button data-testid={TESTIDS.loginBtn} type="submit" disabled={submitting} className="w-full">
        {submitting ? CFG.submitting : CFG.submit}
      </Button>
    </form>
  );
}
