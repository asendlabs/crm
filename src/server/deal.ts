"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createDeal,
  deleteDeal,
  getDealById,
  updateDeal,
} from "@/data-access/deal";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { dealCreateSchema } from "@/schemas/deal.schema";
import { createActivity } from "@/data-access/activities";

export const updateDealAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemId: z.string(),
      columnId: z.string().optional(),
      newValue: z.any().optional(), // Allow for date type
      full: z.any().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const { columnId, itemId, newValue, full } = input;

    if (full) {
      const res = await updateDeal(itemId, full);
      if (!res) {
        throw new Error("Could not update the deal."); // Inline error message
      }
      return true;
    } else {
      // If the newValue is a date, convert it to an ISO string
      // const valueToUpdate =
      //   newValue instanceof Date ? new Date(valueToUpdate) : newValue;

      const res = await updateDeal(itemId, {
        [columnId!]: newValue, // Ensure to use the correct column
      });
      if (!res) {
        throw new Error("Could not update the deal."); // Inline error message
      }
      return true;
    }
  });

export const deleteDealAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { itemIds } = input;
    const { user } = ctx;
    for (const itemId of itemIds) {
      const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
      if (!currentWorkspaceId) {
        throw new Error("Workspace not found"); // Inline error
      }
      const retrivedDeal = await getDealById(itemId);
      if (!retrivedDeal) {
        throw new Error("Deal not found"); // Inline error
      }
      const res = await deleteDeal(itemId);
      if (!res) {
        throw new Error("Could not delete the deal."); // Inline error message
      }
      const activityRes = await createActivity({
        userId: user.id,
        workspaceId: currentWorkspaceId,
        accountId: retrivedDeal.accountId,
        title: "Delete Deal",
        activityType: "entity_deletion",
        isEntityActivity: true,
        entityTitle: retrivedDeal.title,
        entityType: "deal",
      });
      if (!activityRes) {
        throw new Error("Could not create the activity."); // Inline error message
      }
    }
    return true;
  });

export const createDealAction = authenticatedAction
  .createServerAction()
  .input(dealCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { title, value, expectedCloseDate, accountId } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found."); // Inline error message
    }
    const dealRes = await createDeal({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title,
      value,
      expectedCloseDate,
    });

    if (!dealRes) {
      throw new Error("Could not create the deal."); // Inline error message
    }
    const activityRes = await createActivity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title: "New Deal",
      activityType: "entity_creation",
      isEntityActivity: true,
      entityTitle: dealRes.title,
      entityType: "deal",
    });

    if (!activityRes) {
      throw new Error("Could not create the activity."); // Inline error message
    }
    return {
      success: true,
      data: dealRes,
    };
  });
