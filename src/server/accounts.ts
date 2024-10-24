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
import { selectedWorkspaceCookie } from "@/constants";
import { cookies } from "next/headers";
import { accountCreateSchema } from "@/schemas/account.schema";
import {
  createContact,
  createContactEmail,
  createContactPhone,
  deleteContact,
  deleteContactEmail,
  deleteContactPhone,
  getAllAccountContacts,
} from "@/data-access/contacts";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { deleteDeal, getAllAccountDeals } from "@/data-access/deal";
import {
  createActivity,
  deleteActivity,
  getAllAccountActivities,
} from "@/data-access/activities";
import { deleteTask, getAllAccountTasks } from "@/data-access/tasks";

export const updateAccountAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      columnId: z.string(),
      itemId: z.string(),
      newValue: z.any(),
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

    for (const itemId of itemIds) {
      const activities = await getAllAccountActivities(itemId);
      const tasks = await getAllAccountTasks(itemId);

      for (const activity of activities) {
        await deleteActivity(activity.id);
      }

      const deals = await getAllAccountDeals(itemId);

      for (const deal of deals) {
        await deleteDeal(deal.id);
      }

      const contacts = await getAllAccountContacts(itemId);

      for (const contact of contacts) {
        await deleteContactEmail(contact.id);
        await deleteContactPhone(contact.id);
        await deleteContact(contact.id);
      }

      for (const task of tasks) {
        await deleteTask(task.id);
      }

      const res = await deleteAccount(itemId);
      if (!res) {
        throw new Error("Couldn't delete account");
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
    const currentWorkspaceId = (await cookies()).get(selectedWorkspaceCookie)?.value;
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
    const accountActivityRes = await createActivity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId: accountRes.id,
      title: "New Account",
      activityType: "entity_creation",
      content: accountName,
      isEntityActivity: true,
      entityTitle: accountRes.accountName,
      entityType: "account",
    });
    const contactActivityRes = await createActivity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId: accountRes.id,
      title: "New Contact",
      activityType: "entity_creation",
      content: contactName,
      isEntityActivity: true,
      entityTitle: contactRes.contactName,
      entityType: "contact",
    });
    const contactEmailRes = await createContactEmail(contactRes.id, "");
    const contactPhoneRes = await createContactPhone(contactRes.id, "");

    const account = await getAccountById(accountRes.id);
    if (!account) {
      throw new Error("Account not found after creation");
    }
    return {
      success: true,
      data: account,
    };
  });
