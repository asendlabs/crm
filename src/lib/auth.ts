import { sessionTable, userTable } from "@/db/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "@/db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "authentication_key_ascendcrm_secure",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});
