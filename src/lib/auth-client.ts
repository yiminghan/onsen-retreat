import { createAuthClient } from "better-auth/react";

// Same-origin — no baseURL needed.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
