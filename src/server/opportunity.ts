"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
} from "@/data-access/opportunities";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { opportunityCreateSchema } from "@/schemas/opportunity.schema";

export const updateOpportunityAction = authenticatedAction
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
    const res = await updateOpportunity(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Could not update the opportunity."); // Inline error message
    }
    return true;
  });

export const deleteOpportunityAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input }) => {
    const { itemIds } = input;
    for (const itemId of itemIds) {
      const res = await deleteOpportunity(itemId);
      if (!res) {
        throw new Error("Could not delete the opportunity."); // Inline error message
      }
    }
    return true;
  });

export const createOpportunityAction = authenticatedAction
  .createServerAction()
  .input(opportunityCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const {
      title,
      value,
      expectedCloseDate,
      accountId,
    } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found."); // Inline error message
    }
    const opportunityRes = await createOpportunity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title,
      value,
      expectedCloseDate,
    });

    if (!opportunityRes) {
      throw new Error("Could not create the opportunity."); // Inline error message
    }
    return {
      success: true,
      data: opportunityRes,
    };
  });
