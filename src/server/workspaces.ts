"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { updateWorkspace } from "@/data-access/workspaces";

export const setSelectedWorkspaceAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .output(z.boolean())
  .handler(async ({ input }) => {
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

export const updateSelectedWorkspaceNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      updatedName: z.string().min(2, {
        message: "Workspace name should be atleast 2 characters long",
      }),
    }),
  )
  .output(z.boolean())
  .handler(async ({ input }) => {
    const { updatedName } = input;

    const currentWorkspaceId = (await cookies()).get(
      selectedWorkspaceCookie,
    )?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found."); // Inline error message
    }

    const updated = await updateWorkspace(currentWorkspaceId, {
      name: updatedName,
    });
    if (!updated) {
      throw new Error("Workspace name could not be updated."); // Inline error message
    }
    return true;
  });
