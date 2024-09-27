"use server";
import { createServerAction } from "zsa";
import {
  CouldntCreateOpportunityError,
  CouldntDeleteOpportunityError,
  CouldntUpdateOpportunityError,
  WorkspaceNotFoundError,
} from "@/data-access/_errors";
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
    const res = updateOpportunity(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new CouldntUpdateOpportunityError();
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
  .handler(async ({ input, ctx }) => {
    const { itemIds } = input;
    const { user } = ctx;
    for (const itemId of itemIds) {
      const res = await deleteOpportunity(itemId);
      if (!res) {
        throw new CouldntDeleteOpportunityError();
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
      stage,
      assignedToId,
      primaryContactId,
      probability,
      expectedCloseDate,
      description,
      accountId,
    } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new WorkspaceNotFoundError();
    }
    const opportunityRes = await createOpportunity(
      user.id,
      currentWorkspaceId,
      accountId,
      title,
      value,
      stage,
      primaryContactId,
      probability,
      expectedCloseDate,
      description,
      assignedToId,
    );

    if (!opportunityRes) {
      throw new CouldntCreateOpportunityError();
    }
    return {
      success: true,
      data: opportunityRes,
    };
  });
