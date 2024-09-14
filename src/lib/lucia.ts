import { sessionTable, userTable } from "@database/tables";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, Session, User } from "lucia";
import { db } from "@database";
import { env } from "@/env";
import { cookies } from "next/headers";
import { ckAuthSession } from "@/utils/cookie-names";

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable as any,
  userTable as any,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: ckAuthSession,
    attributes: {
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    },
  },
});

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
};
