import "server-only";
import { db } from "@database";
import { dealTable } from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Deal } from "@database/types";

export async function getDealById(id: string) {
  const deal = await db.query.dealTable.findFirst({
    where: eq(dealTable.id, id),
  });
  return deal;
}

export async function getAllWorkspaceDeals(workspaceId: string) {
  const workspaceDeals = await db.query.dealTable.findMany({
    where: eq(dealTable.workspaceId, workspaceId),
    with: {
      account: true,
      primaryContact: true,
    },
  });
  return workspaceDeals;
}

export async function getAllAccountDeals(accountId: string) {
  const accountDeals = await db.query.dealTable.findMany({
    where: eq(dealTable.accountId, accountId),
    with: {
      primaryContact: true,
    },
  });
  return accountDeals;
}

export async function createDeal({
  userId,
  workspaceId,
  accountId,
  title,
  value,
  stage,
  primaryContactId,
  probability,
  expectedCloseDate,
  description,
  assignedToId,
}: {
  userId: string;
  workspaceId: string;
  accountId: string;
  title: string;
  value?: string;
  stage?: string;
  primaryContactId?: string;
  probability?: number;
  expectedCloseDate?: Date;
  description?: string;
  assignedToId?: string;
}) {
  const [created] = await db
    .insert(dealTable)
    .values({
      id: ulid(),
      workspaceId,
      accountId,
      title,
      value,
      stage,
      probability,
      expectedCloseDate,
      assignedToId,
      primaryContactId,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function updateDeal(dealId: string, updates: Partial<Deal>) {
  const [updated] = await db
    .update(dealTable)
    .set(updates)
    .where(eq(dealTable.id, dealId))
    .returning();
  return updated;
}

export async function deleteDeal(dealId: string) {
  const deleted = await db.delete(dealTable).where(eq(dealTable.id, dealId));
  return deleted;
}