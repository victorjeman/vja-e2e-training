import { API } from "@/shared/routes";

// All auth text/labels/messages/api paths. No bare text in components.
export const AUTH_CONFIG = {
  register: {
    heading: "Create your account",
    subtitle: "Sign up to start shopping.",
    nameLabel: "Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Create account",
    submitting: "Registering...",
    loginPrompt: "Already have an account?",
    loginLink: "Sign in",
    api: API.authRegister,
  },
  login: {
    heading: "Welcome back",
    subtitle: "Sign in to continue shopping.",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Sign in",
    submitting: "Signing in...",
    demoTitle: "Demo account",
    demoHint: "Sign in instantly with the seeded demo credentials:",
    demoEmailLabel: "email",
    demoPasswordLabel: "password",
    registerPrompt: "New here?",
    registerLink: "Create an account",
    api: API.authLogin,
  },
  logout: {
    label: "Logout",
    api: API.authLogout,
  },
  messages: {
    nameRequired: "Name is required",
    emailInvalid: "Enter a valid email",
    passwordTooShort: "Password must be at least 6 characters",
    passwordRequired: "Password is required",
    emailTaken: "Email is already registered",
    invalidCredentials: "Invalid email or password",
    genericError: "Something went wrong. Please try again.",
  },
} as const;
