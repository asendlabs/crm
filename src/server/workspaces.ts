"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";

export const setSelectedWorkspaceAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .output(z.boolean())
  .handler(async ({ ctx, input }) => {
    const { workspaceId } = input;
    const cookieStore = await cookies();

    const res = cookieStore.set(selectedWorkspaceCookie, workspaceId);
    if (!res) {
      throw new Error(
        "Something went wrong. Unable to set selected workspace.",
      );
    }

    return true;
  });
