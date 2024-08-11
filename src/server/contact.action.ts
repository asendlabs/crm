// "use server";

// import { contactTable } from "@/database/schemas";
// import { db } from "@/database/connection";
// import { eq } from "drizzle-orm";
// import { getUser } from "@/server/user.action";
// import { ulid } from "ulid";

// export const createContact = async ({
//   leadId,
//   contactName,
// }: {
//   leadId: string;
//   contactName: string;
// }) => {
//   try {
//     const user = await getUser();
//     const userId = user?.id || "";
//     const id = ulid();
//     const newContact = await db
//       .insert(contactTable)
//       .values({
//         id,
//         contactName,
//         leadId,
//         userId,
//       })
//       .returning();
//     if (!newContact) {
//       return {
//         success: false,
//         message: "Failed to create new contact",
//       };
//     }
//     return {
//       success: true,
//       message: "New contact created successfully",
//       data: newContact[0],
//     };
//   } catch (error) {
//     console.error("Failed to create new contact:", error);
//     return {
//       success: false,
//       message: "Failed to create new contact",
//       data: null,
//     };
//   }
// };
// export const updateContact = async ({
//   columnId,
//   newValue,
//   itemId,
// }: {
//   columnId: string;
//   newValue: string;
//   itemId: string;
// }): Promise<{ success: boolean }> => {
//   try {
//     // Find a record that matches the provided id
//     const record = await db.query.contactTable.findFirst({
//       where: eq(contactTable.id, itemId),
//     });

//     // If the record exists, update it
//     if (record) {
//       const updateResult = await db
//         .update(contactTable)
//         .set({ [columnId]: newValue })
//         .where(eq(contactTable.id, record.id));
//     } else {
//       return { success: false };
//     }
//     return { success: true };
//   } catch (error) {
//     console.error("Failed to update contact:", error);
//     return { success: false };
//   }
// };
// export const deleteContact = async (itemIds: string[]) => {
//   try {
//     for (const itemId of itemIds) {
//       if (!itemId) {
//         return { success: false, message: "Nothing to delete" };
//       } else {
//         const deletedContacts = await db
//           .delete(contactTable)
//           .where(eq(contactTable.id, itemId));
//         if (!deletedContacts) {
//           return { success: false, message: "Failed to delete contact" };
//         }
//       }
//     }
//     return {
//       success: true,
//       message: "Deleted contacts successfully",
//     };
//   } catch (error) {
//     return { success: false, message: "Internal Error" };
//   }
// };
// export const getContactsByLeadId = async (leadId: string) => {
//   const contacts = await db.query.contactTable.findMany({
//     where: eq(contactTable.leadId, leadId),
//     with: {
//       lead: true,
//     },
//   });
//   return contacts;
// };
