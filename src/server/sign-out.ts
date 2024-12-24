"use server";
import { authenticatedAction } from "@/lib/zsa";
import { invalidateSession } from "@/lib/auth";

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input, ctx }) => {
    const { session } = ctx;
    await invalidateSession(session?.id!);
    return true;
  });
