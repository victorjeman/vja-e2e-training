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
import { authRegisterSchema } from "../auth-schemas";
import { authFirstIssue } from "../lib/auth-first-issue";

const CFG = AUTH_CONFIG.register;

export function AuthRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");

    const parsed = authRegisterSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const { field, message } = authFirstIssue(parsed.error);
      if (field === "password") setPasswordError(message);
      else setEmailError(message);
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
        router.push(ROUTES.login);
        return;
      }
      const data = await res.json().catch(() => ({}));
      const message = data.error ?? AUTH_CONFIG.messages.genericError;
      if (data.field === "password") setPasswordError(message);
      else setEmailError(message);
    } catch {
      setEmailError(AUTH_CONFIG.messages.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form data-testid={TESTIDS.registerForm} onSubmit={handleSubmit} className="space-y-4">
      <Box className="space-y-1.5">
        <Label htmlFor="register-name">{CFG.nameLabel}</Label>
        <Input
          id="register-name"
          data-testid={TESTIDS.registerNameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </Box>

      <Box className="space-y-1.5">
        <Label htmlFor="register-email">{CFG.emailLabel}</Label>
        <Input
          id="register-email"
          data-testid={TESTIDS.registerEmailInput}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {emailError ? (
          <Text data-testid={TESTIDS.emailError} className="text-sm font-medium text-destructive">
            {emailError}
          </Text>
        ) : null}
      </Box>

      <Box className="space-y-1.5">
        <Label htmlFor="register-password">{CFG.passwordLabel}</Label>
        <Input
          id="register-password"
          data-testid={TESTIDS.registerPasswordInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {passwordError ? (
          <Text data-testid={TESTIDS.passwordError} className="text-sm font-medium text-destructive">
            {passwordError}
          </Text>
        ) : null}
      </Box>

      <Button data-testid={TESTIDS.registerBtn} type="submit" disabled={submitting} className="w-full">
        {submitting ? CFG.submitting : CFG.submit}
      </Button>
    </form>
  );
}
