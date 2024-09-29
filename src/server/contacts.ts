"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createContact,
  createContactEmail,
  deleteContact,
  getAllAccountContacts,
  updateContact,
} from "@/data-access/contacts";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { contactCreateSchema } from "@/schemas/contact.schema";

export const updateContactAction = authenticatedAction
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
    const res = await updateContact(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Couldn't update contact"); // Inline error
    }
    return true;
  });

export const deleteContactAction = authenticatedAction
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
      const res = await deleteContact(itemId);
      if (!res) {
        throw new Error("Couldn't delete contact"); // Inline error
      }
    }
    return true;
  });

export const createContactAction = authenticatedAction
  .createServerAction()
  .input(contactCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { contactName, contactEmail, contactPhone, accountId } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found"); // Inline error
    }
    const contactRes = await createContact(
      currentWorkspaceId,
      user.id,
      accountId,
      contactName,
    );

    if (!contactRes) {
      throw new Error("Couldn't create contact"); // Inline error
    }
    const contactEmailRes = await createContactEmail(
      contactRes.id,
      contactEmail,
    );
    if (!contactEmailRes) {
      throw new Error("Couldn't create contact email"); // Inline error
    }
    return {
      success: true,
      data: contactRes,
    };
  });
