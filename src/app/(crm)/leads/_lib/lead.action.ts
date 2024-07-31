"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { leadsTable } from "@/db/schema";

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
    const record = await db.query.leadsTable.findFirst({
      where: eq(leadsTable.id, itemId),
    });

    // If the record exists, update it
    if (record) {
      const updateResult = await db
        .update(leadsTable)
        .set({ [columnId]: newValue })
        .where(eq(leadsTable.id, record.id));
    } else {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false };
  }
};
