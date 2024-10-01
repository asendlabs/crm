import "server-only";
import { db } from "@database";
import { accountTable } from "@database/tables";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Account } from "@database/types";

export async function getAccountById(id: string) {
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.id, id),
    with: {
      contacts: {
        with: {
          contactEmail: true,
          contactPhone: true,
        },
      },
      deals: {
        with: {
          primaryContact: true,
        },
      },
      activites: true,
    },
  });
  return account;
}

export async function getAllWorkspaceAccounts(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: eq(accountTable.workspaceId, workspaceId),
    with: {
      contacts: true,
    },
  });
  return workspaceAccounts;
}

export async function getAllWorkspaceLeads(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: and(
      eq(accountTable.workspaceId, workspaceId),
      eq(accountTable.type, "lead"),
    ),
    with: {
      contacts: true,
    },
  });
  return workspaceAccounts;
}

export async function getAllWorkspaceClients(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: and(
      eq(accountTable.workspaceId, workspaceId),
      eq(accountTable.type, "client"),
    ),
  });
  return workspaceAccounts;
}

export async function createAccount(
  workspaceId: string,
  userId: string,
  accountName: string,
  type: "lead" | "client",
): Promise<Account> {
  const [created] = await db
    .insert(accountTable)
    .values({
      id: ulid(),
      workspaceId,
      accountName,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
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
