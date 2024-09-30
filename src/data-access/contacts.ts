import "server-only";
import { db } from "@database";
import {
  contactTable,
  contactEmailTable,
  contactPhoneTable,
} from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Contact } from "@database/types";

export async function getContactById(id: string) {
  const contact = await db.query.contactTable.findFirst({
    where: eq(contactTable.id, id),
  });
  return contact;
}

export async function getAllWorkspaceContacts(workspaceId: string) {
  const workspaceContacts = await db.query.contactTable.findMany({
    where: eq(contactTable.workspaceId, workspaceId),
  });
  return workspaceContacts;
}

export async function getAllAccountContacts(accountId: string) {
  const accountContacts = await db.query.contactTable.findMany({
    where: eq(contactTable.accountId, accountId),
  });
  return accountContacts;
}

export async function createContact(
  workspaceId: string,
  userId: string,
  accountId: string,
  contactName: string,
) {
  const [created] = await db
    .insert(contactTable)
    .values({
      id: ulid(),
      workspaceId,
      accountId,
      contactName,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function createContactEmail(contactId: string, email: string) {
  const [created] = await db
    .insert(contactEmailTable)
    .values({
      id: ulid(),
      contactId,
      email,
    })
    .returning();
  return created;
}

export async function createContactPhone(
  contactId: string,
  phoneNumber: string,
  countryCode?: string,
) {
  const [created] = await db
    .insert(contactPhoneTable)
    .values({
      id: ulid(),
      contactId,
      phoneNumber,
      countryCode,
    })
    .returning();
  return created;
}

export async function updateContact(
  contactId: string,
  updates: Partial<Contact>,
) {
  const [updated] = await db
    .update(contactTable)
    .set(updates)
    .where(eq(contactTable.id, contactId))
    .returning();
  return updated;
}

export async function deleteContact(contactId: string) {
  const deleted = await db
    .delete(contactTable)
    .where(eq(contactTable.id, contactId));
  return deleted;
}

export async function deleteContactEmail(contactId: string) {
  const deleted = await db
    .delete(contactEmailTable)
    .where(eq(contactEmailTable.contactId, contactId));
  return deleted;
}

export async function deleteContactPhone(contactId: string) {
  const deleted = await db
    .delete(contactPhoneTable)
    .where(eq(contactPhoneTable.contactId, contactId));
  return deleted;
}
