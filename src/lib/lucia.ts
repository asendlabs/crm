import { userSessionTable, userTable } from "@database/models";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "@database";
import { env } from "@/env";

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  userSessionTable as any,
  userTable as any,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "asgnid",
    attributes: {
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    },
  },
});
