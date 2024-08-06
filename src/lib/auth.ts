import { DrizzlePostgreSQLAdapter, PostgreSQLSessionTable } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "@/db/schema";

import { Google } from "arctic";
import { Lucia } from "lucia";
import { db } from "@/db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable as any, userTable as any);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth_key",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + "/api/auth/google/callback",
);
