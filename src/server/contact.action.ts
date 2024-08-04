"use server";

import { contactSchema } from "@/schemas/contact.schema";
import { contactTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/user";
import { uuid } from "uuidv4";
import { z } from "zod";

export const createContact = async (data: z.infer<typeof contactSchema>) => {
  try {
    const { contactName, jobTitle, email, phone, url, leadId } = data;
    const user = await getUser();
    const userId = user?.id || "";
    const newContact = await db
      .insert(contactTable)
      .values({
        id: uuid(),
        userId,
        jobTitle,
        email,
        phone,
        url,
        contactName,
        leadId, // Link to the lead
      })
      .returning();
    if (!newContact) {
      return {
        success: false,
        message: "Failed to create new contact",
        data: null,
      };
    }
    return {
      success: true,
      message: "New contact created successfully",
      data: newContact[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create new contact",
      data: null,
    };
  }
};
export const updateContact = async ({
  columnId,
  newValue,
  itemId,
}: {
  columnId: string;
  newValue: string;
  itemId: string;
}): Promise<{ success: boolean }> => {
  try {
    // Find a record that matches the provided id
    const record = await db.query.contactTable.findFirst({
      where: eq(contactTable.id, itemId),
    });

    // If the record exists, update it
    if (record) {
      const updateResult = await db
        .update(contactTable)
        .set({ [columnId]: newValue })
        .where(eq(contactTable.id, record.id));
    } else {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact:", error);
    return { success: false };
  }
};
export const deleteContact = async (itemIds: string[]) => {
  try {
    itemIds.forEach(async (itemId) => {
      if (!itemId) {
        return { success: false, message: "Nothing to Delete" };
      } else {
        const deletedContacts = await db
          .delete(contactTable)
          .where(eq(contactTable.id, itemId));
        if (!deletedContacts) {
          return { success: false, message: "Failed to delete Contact" };
        }
      }
    });
    return {
      success: true,
      message: "Deleted contacts successfully",
    };
  } catch (error) {
    return { success: false, message: "Internal Error" };
  }
};
