"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { createDeal, deleteDeal, updateDeal } from "@/data-access/deal";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { dealCreateSchema } from "@/schemas/deal.schema";

export const updateDealAction = authenticatedAction
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
    const res = await updateDeal(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Could not update the deal."); // Inline error message
    }
    return true;
  });

export const deleteDealAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input }) => {
    const { itemIds } = input;
    for (const itemId of itemIds) {
      const res = await deleteDeal(itemId);
      if (!res) {
        throw new Error("Could not delete the deal."); // Inline error message
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
    return {
      success: true,
      data: dealRes,
    };
  });
