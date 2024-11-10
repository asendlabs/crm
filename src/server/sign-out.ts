"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { lucia, validateRequest } from "@/lib/lucia";
import { cookies } from "next/headers";

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input }) => {
    const { session } = await validateRequest();
    if (!session) {
      return false;
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return true;
  });
