import { userSessionTable, userTable } from "@/database/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Google } from "arctic";
import { Lucia } from "lucia";
import { db } from "@/database";

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  userSessionTable as any,
  userTable as any,
);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "sessionid",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + "/api/auth/google/callback",
);

export { lucia, googleOAuthClient };
