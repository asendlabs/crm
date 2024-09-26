"use server";
import { createServerAction } from "zsa";
import {
  CouldntDeleteLeadError,
  CouldntUpdateLeadError,
  WorkspaceNotFoundError,
} from "@/data-access/_errors";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { createAccount, deleteAccount, updateAccount } from "@/data-access/accounts";
import { ckSelectedWorkspaceId } from "@/utils/cookie-names";
import { cookies } from "next/headers";

export const updateAccountAction = authenticatedAction
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
    const res = updateAccount(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new CouldntUpdateLeadError();
    }
    return true;
  });

export const deleteAccountAction = authenticatedAction
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
      const res = await deleteAccount(itemId);
      if (!res) {
        throw new CouldntDeleteLeadError();
      }
    }
    return true;
  });

  export const createAccountAction = authenticatedAction
    .createServerAction()
    .input(
      z.object({
        accountName: z.string(),
        type: z.enum(["lead", "customer"]),
        description: z.string().optional(),
      }),
    )
    .handler(async ({ input, ctx }) => {
      const { accountName, type, description } = input;
      const { user } = ctx;
      const currentWorkspaceId = cookies().get(ckSelectedWorkspaceId)?.value;
      if (!currentWorkspaceId) {
        throw new WorkspaceNotFoundError();
      }
      const res = await createAccount(currentWorkspaceId, user.id, accountName, type, description);
      if (!res) {
        throw new CouldntUpdateLeadError();
      }
      return true;
    });