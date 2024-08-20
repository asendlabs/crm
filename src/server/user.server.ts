"use server";

import { User } from "@/database/schema/user";
import { cookies } from "next/headers";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { lucia } from "../lib/lucia";
import { userTable } from "@/database/schema";

export const getLoggedInUser = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    return null;
  }
  if (!user) return null;

  const databaseUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, user.id),
  });

  return databaseUser as User;
};
