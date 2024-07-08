import { sessionTable, userTable } from "@/db/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import {db} from "@/db";
import { eq } from "drizzle-orm";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "authentication_key_ascendcrm_secure",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUser = async () => {
  const sessionCookieId =
    cookies().get("authentication_key_ascendcrm_secure")?.value || null;
  if (!sessionCookieId) return null;

  const { session, user } = await lucia.validateSession(sessionCookieId);

  try {
    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {}

  const dbUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, user?.id as string),
  });

  return dbUser;
};
