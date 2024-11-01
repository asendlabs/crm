import { cache } from "react";
import { lucia, validateRequest } from "./lucia";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";

export const fetchAuthenticatedUser = async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  return session.user;
};

export const verifyAuthentication = async () => {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    throw new Error("You need to be logged in to access this content");
  }
  return user;
};

export async function createSessionForUser(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function getWorkspaceId(): Promise<string> {
  const user = await verifyAuthentication();
  const workspaceId = (await cookies()).get(selectedWorkspaceCookie)?.value;
  if (!workspaceId) {
    throw new Error("Workspace not found");
  }
  return workspaceId;
}
