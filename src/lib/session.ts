import { cache } from "react";
import { lucia, validateRequest } from "./lucia";
import { cookies } from "next/headers";
import { AuthenticationError } from "@/data-access/_errors";

export const fetchAuthenticatedUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  return session.user
});

export const verifyAuthentication = async () => {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function createSessionForUser(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
