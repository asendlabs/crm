import { userSessionTable, userTable } from "@/database/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Google } from "arctic";
import { Lucia } from "lucia";
import { db } from "@/database/connection";
import { env } from "@/env";

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  userSessionTable as any,
  userTable as any,
);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "sessionid",
    attributes: {
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    },
  },
});

const googleOAuthClient = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.NEXT_PUBLIC_URL + "/api/auth/google/callback",
);

export { lucia, googleOAuthClient };
