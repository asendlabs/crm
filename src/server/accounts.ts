"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createAccount,
  deleteAccount,
  getAccountById,
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
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { deleteOpportunity, getAllAccountOpportunities } from "@/data-access/opportunities";

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
    const res = await updateAccount(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Couldn't update account"); // Inline error
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
      const opportunities = await getAllAccountOpportunities(itemId)
      // delete the opportunities
      for (const opportunity of opportunities) {
        await deleteOpportunity(opportunity.id);
      }
      // fetch the contacts associated with the account
      const contacts = await getAllAccountContacts(itemId);
      // delete the contacts
      for (const contact of contacts) {
        await deleteContact(contact.id);
      }
      // delete the account
      const res = await deleteAccount(itemId);
      if (!res) {
        throw new Error("Couldn't delete account"); // Inline error
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
      throw new Error("Workspace not found"); // Inline error
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
      throw new Error("Couldn't create account"); // Inline error
    }
    const account = await getAccountById(accountRes.id);
    if (!account) {
      throw new Error('Account not found after creation');
    }
    return {
      success: true,
      data: account,
    };
  });
