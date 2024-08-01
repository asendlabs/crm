import { sessionTable, userTable } from "@/db/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Google } from "arctic";
import { Lucia } from "lucia";
import { db } from "@/db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

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
  process.env.NEXT_PUBLIC_URL + "/api/auth/google/callback"
);