"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { cookies } from "next/headers";
import { CouldntSetSelectedWorkspaceError } from "@/data-access/_errors";

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
    const cookieStore = cookies();

    const res = cookieStore.set("selectedWorkspaceId", workspaceId);
    if (!res) {
      throw new CouldntSetSelectedWorkspaceError();
    }

    return true;
  });
