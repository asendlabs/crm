"use server";

import { contactTable, leadTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { getUser } from "@/lib/user";
import { leadSchema } from "@/schemas/lead.schema";
import { uuid } from "uuidv4";
import { z } from "zod";

export const createLead = async (data: z.infer<typeof leadSchema>) => {
  try {
    const { leadName, description, addresses, url } = data;
    const user = await getUser();
    const userId = user?.id || "";
    const id = uuid();
    const newLead = await db
      .insert(leadTable)
      .values({
        id,
        leadName,
        userId,
        description,
        url
      })
      .returning();
    if (!newLead) {
      return {
        success: false,
        message: "Failed to create new lead",
        data: null,
      };
    }
    return {
      success: true,
      message: "New lead created successfully",
      data: newLead[0],
    };
  } catch (error) {
    return { success: false, message: "Failed to create new lead", data: null };
  }
};
export const updateLead = async ({
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
    const record = await db.query.leadTable.findFirst({
      where: eq(leadTable.id, itemId),
    });

    // If the record exists, update it
    if (record) {
      const updateResult = await db
        .update(leadTable)
        .set({ [columnId]: newValue })
        .where(eq(leadTable.id, record.id));
    } else {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false };
  }
};
export const deleteLead = async (itemIds: string[]) => {
  try {
    itemIds.forEach(async (itemId) => {
      if (!itemId) {
        return { success: false, message: "Nothing to Delete" };
      } else {
        const deletedContacts = await db
          .delete(contactTable)
          .where(eq(contactTable.leadId, itemId));
        const deletedLeads = await db
          .delete(leadTable)
          .where(eq(leadTable.id, itemId));
        if (!deletedLeads) {
          return { success: false, message: "Failed to delete lead" };
        }
      }
    });
    return {
      success: true,
      message: "Deleted leads successfully",
    };
  } catch (error) {
    return { success: false, message: "Internal Error" };
  }
};
export const getLeadById = async (leadId: string) => {
  const lead = await db.query.leadTable.findFirst({
    where: eq(leadTable.id, leadId),
  });
  return lead;
};
