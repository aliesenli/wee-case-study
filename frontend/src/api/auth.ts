import { createAuthClient } from "better-auth/react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  basePath: "/api/auth",
});

export type { Session } from "better-auth";
