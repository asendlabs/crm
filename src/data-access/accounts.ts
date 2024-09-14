import "server-only";
import { db } from "@database";
import { accountTable } from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Account } from "@database/types";

export async function getAccountById(id: string) {
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.id, id),
  });
  return account;
}

export async function getAllWorkspaceAccounts(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: eq(accountTable.workspaceId, workspaceId),
  });
  return workspaceAccounts;
}

export async function createAccount(
  workspaceId: string,
  userId: string,
  accountName: string,
  type: "lead" | "customer",
  description?: string,
) {
  const [created] = await db
    .insert(accountTable)
    .values({
      id: ulid(),
      workspaceId,
      accountName,
      type,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: workspaceId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function updateAccount(
  accountId: string,
  updates: Partial<Account>,
) {
  const [updated] = await db
    .update(accountTable)
    .set(updates)
    .where(eq(accountTable.id, accountId))
    .returning();
  return updated;
}

export async function deleteAccount(accountId: string) {
  const deleted = await db
    .delete(accountTable)
    .where(eq(accountTable.id, accountId));
  return deleted;
}