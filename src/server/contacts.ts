"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createContact,
  createContactEmail,
  createContactPhone,
  deleteContact,
  deleteContactEmail,
  deleteContactPhone,
  getAllAccountContacts,
  getContactById,
  updateContact,
} from "@/data-access/contacts";
import { selectedWorkspaceCookie } from "@/constants";
import { cookies } from "next/headers";
import { contactCreateSchema } from "@/schemas/contact.schema";
import {
  createActivity,
  deleteActivity,
  getActivitiesByContactId,
  updateActivity,
} from "@/data-access/activities";
import { updateContactEmail, updateContactPhone } from "@/data-access/accounts";
import {
  deleteDeal,
  getDealsByContactId,
  updateDeal,
} from "@/data-access/deal";

export const updateContactEmailAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      contactId: z.string(),
      email: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { contactId, email } = input;
    const res = await updateContactEmail(contactId, email);
    if (!res) {
      throw new Error("Couldn't update contact email"); // Inline error
    }
    return {
      success: true,
      data: res,
    };
  });

export const updateContactPhoneAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      contactId: z.string(),
      phoneNumber: z.string(),
      countryCode: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const { contactId, phoneNumber } = input;
    const res = await updateContactPhone(contactId, phoneNumber);
    if (!res) {
      throw new Error("Couldn't update contact phone"); // Inline error
    }
    return {
      success: true,
      data: res,
    };
  });

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
      const currentWorkspaceId = (await cookies()).get(
        selectedWorkspaceCookie,
      )?.value;
      if (!currentWorkspaceId) {
        throw new Error("Workspace not found"); // Inline error
      }
      const retrivedContact = await getContactById(itemId);
      if (!retrivedContact) {
        throw new Error("Contact not found"); // Inline error
      }
      const contactEmailRes = await deleteContactEmail(itemId);
      const contactPhoneRes = await deleteContactPhone(itemId);
      if (!contactEmailRes || !contactPhoneRes) {
        throw new Error("Couldn't delete contact"); // Inline error
      }
      const dealsWithContactId = await getDealsByContactId(itemId);
      if (dealsWithContactId) {
        for (const deal of dealsWithContactId) {
          const dealRes = await updateDeal(deal.id, {
            primaryContactId: null,
          });
          if (!dealRes) {
            throw new Error("Couldn't update deal"); // Inline error
          }
        }
      }
      const activitiesWithContactId = await getActivitiesByContactId(itemId);
      for (const activity of activitiesWithContactId) {
        const updateActivityRes = await updateActivity(activity.id, {
          associatedContactId: null,
        });
        if (!updateActivityRes) {
          throw new Error("Couldn't update activity"); // Inline error
        }
      }
      const res = await deleteContact(itemId);
      if (!res) {
        throw new Error("Couldn't delete contact"); // Inline error
      }
      const activityRes = await createActivity({
        userId: user.id,
        workspaceId: currentWorkspaceId,
        accountId: retrivedContact.accountId,
        title: "New Contact",
        activityType: "entity_deletion",
        isEntityActivity: true,
        entityTitle: retrivedContact.contactName,
        entityType: "contact",
      });

      if (!activityRes) {
        throw new Error("Could not create the activity."); // Inline error message
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
    const currentWorkspaceId = (await cookies()).get(
      selectedWorkspaceCookie,
    )?.value;
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
    const contactPhoneRes = await createContactPhone(
      contactRes.id,
      contactPhone,
    );
    if (!contactEmailRes) {
      throw new Error("Couldn't create contact email"); // Inline error
    }
    const activityRes = await createActivity({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title: "New Contact",
      activityType: "entity_creation",
      isEntityActivity: true,
      entityTitle: contactRes.contactName,
      entityType: "contact",
    });

    if (!activityRes) {
      throw new Error("Could not create the activity."); // Inline error message
    }
    const contact = await getContactById(contactRes.id);
    if (!contact) {
      throw new Error("Contact not found after creation."); // Inline error message
    }
    return {
      success: true,
      data: contact,
    };
  });
