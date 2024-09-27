"use server";
import { createServerAction } from "zsa";
import {
  CouldntCreateAccountError,
  CouldntDeleteLeadError,
  CouldntUpdateLeadError,
  WorkspaceNotFoundError,
} from "@/data-access/_errors";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/data-access/accounts";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { accountCreateSchema } from "@/schemas/account.schema";
import {
  createContact,
  deleteContact,
  getAllAccountContacts,
} from "@/data-access/contacts";

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
      // fetch the contacts associated with the account
      const contacts = await getAllAccountContacts(itemId);
      // delete the contacts
      for (const contact of contacts) {
        await deleteContact(contact.id);
      }
      // delete the account
      const res = await deleteAccount(itemId);
      if (!res) {
        throw new CouldntDeleteLeadError();
      }
    }
    return true;
  });

export const createAccountAction = authenticatedAction
  .createServerAction()
  .input(accountCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { accountName, type, contactName } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new WorkspaceNotFoundError();
    }
    const accountRes = await createAccount(
      currentWorkspaceId,
      user.id,
      accountName,
      type,
    );
    const contactRes = await createContact(
      currentWorkspaceId,
      user.id,
      accountRes.id,
      contactName,
    );

    if (!accountRes || !contactRes) {
      throw new CouldntCreateAccountError();
    }
    return {
      success: true,
      data: accountRes,
    };
  });
