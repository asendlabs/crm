"use server";

import { and, eq } from "drizzle-orm";
import { userTable, workspaceMemberTable } from "@/database/schema";

import { User } from "@/database/schema/types";
import { cookies } from "next/headers";
import { db } from "@/database/connection";
import { lucia } from "@/lib/lucia";

export const getUser = async () => {
  const sessionCookieId = cookies().get("sessionid")?.value || null;
  if (sessionCookieId === undefined) return null;
  if (!sessionCookieId) return null;

  const { session, user } = await lucia.validateSession(sessionCookieId);

  try {
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {
    console.log(error);
  }

  const dbUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, (user?.id as string) || ""),
  });

  return dbUser as User;
};

export const getActiveUserAndWorkspace = async () => {
  try {
    const activeUWID = cookies().get("active_uwid")?.value || null;
    if (!activeUWID) return null;

    const [userId, workspaceId] = activeUWID.split("_$_");

    if (!userId || !workspaceId)
      return { userCreated: false, workspaceCreated: false };

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });

    if (!user) return { userCreated: false, workspaceCreated: false };

    if (workspaceId === "wnf") {
      const workspace = await db.query.workspaceMemberTable.findFirst({
        where: eq(workspaceMemberTable.userId, userId),
      });

      return {
        userCreated: user.metadata?.creationComplete,
        workspaceCreated: !!workspace,
      };
    } else {
      const UWIDValid = await db.query.workspaceMemberTable.findFirst({
        where: and(
          eq(workspaceMemberTable.userId, userId),
          eq(workspaceMemberTable.workspaceId, workspaceId),
        ),
      });

      if (!UWIDValid) return { userCreated: false, workspaceCreated: false };
      return { userCreated: true, workspaceCreated: true };
    }
  } catch (error) {
    console.error(error);
  }
};
