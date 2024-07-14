"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/lucia";
import { userTable } from "@/db/schema";

export const useUser = async () => {
  const sessionCookieId =
    cookies().get("authentication_key_ascendcrm_secure")?.value || null;
  if (sessionCookieId === undefined) return null;
  if (!sessionCookieId) return null;

  const { session, user } = await lucia.validateSession(sessionCookieId);

  try {
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {
    console.log(error);
  }

  const dbUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, (user?.id as string) || ""),
  });

  return dbUser;
};
