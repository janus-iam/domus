import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import type { Database } from "@domus/db";
import * as schema from "@domus/db/schema/auth";
import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";

export type AuthConfig = {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  CORS_ORIGIN: string;
  KEYCLOAK_ISSUER: string;
  KEYCLOAK_CLIENT_ID: string;
};

export function createAuth(
  env: AuthConfig,
  database: Database,
  desktopOrigins: readonly string[] = [],
) {
  return betterAuth({
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN, ...desktopOrigins],
    emailAndPassword: { enabled: true },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    user: {
      additionalFields: {
        plainEmail: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [
      genericOAuth({
        config: [
          {
            ...keycloak({
              clientId: env.KEYCLOAK_CLIENT_ID,
              issuer: env.KEYCLOAK_ISSUER,
              postLogoutRedirectURI: env.CORS_ORIGIN,
              pkce: true,
              overrideUserInfo: true,
            }),
            scopes: ["address", "microprofile-jwt", "phone", "picture", "plain_email"],
            mapProfileToUser: (profile) => ({
              name: profile.username as string | undefined,
              image: profile.picture as string | undefined,
              plainEmail: profile.plain_email as string | undefined,
            }),
          },
        ],
      }),
    ],
  });
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
