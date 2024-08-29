import { cookies } from "next/headers";
import { lucia } from "./lucia";
import { daGetUserById } from "@/dal/dal-user";

export const fetchLogggedInUser = async () => {
  "use server";
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

  const databaseUser = await daGetUserById(user.id);

  return databaseUser;
};
