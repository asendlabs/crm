"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@/data-access/activities";
import { activityCreateSchema } from "@/schemas/activity.schema";
import { selectedWorkspaceCookie } from "@/constants";
import { cookies } from "next/headers";

export const createActivityAction = authenticatedAction
  .createServerAction()
  .input(activityCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { type, content, contactId, title, accountId } = input;
    const { user } = ctx;
    const currentWorkspaceId = (await cookies()).get(
      selectedWorkspaceCookie,
    )?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found"); // Inline error
    }
    const activityRes = await createActivity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title,
      activityType: type!,
      content,
      associatedContactId: contactId,
      isEntityActivity: false,
    });

    if (!activityRes) {
      throw new Error("Couldn't create activity"); // Inline error
    }
    return {
      success: true,
      data: activityRes,
    };
  });

export const deleteActivityAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { itemIds } = input;
    for (const itemId of itemIds) {
      const res = await deleteActivity(itemId);
      if (!res) {
        throw new Error("Couldn't delete activity"); // Inline error
      }
    }
    return true;
  });

export const updateActivityAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      columnId: z.string(),
      itemId: z.string(),
      newValue: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { columnId, itemId, newValue } = input;
    const res = await updateActivity(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Couldn't update activity"); // Inline error
    }
    return true;
  });
