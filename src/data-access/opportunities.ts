import "server-only";
import { db } from "@database";
import { opportunityTable } from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Opportunity } from "@database/types";

export async function getOpportunityById(id: string) {
  const opportunity = await db.query.opportunityTable.findFirst({
    where: eq(opportunityTable.id, id),
  });
  return opportunity;
}

export async function getAllWorkspaceOpportunities(workspaceId: string) {
  const workspaceOpportunities = await db.query.opportunityTable.findMany({
    where: eq(opportunityTable.workspaceId, workspaceId),
  });
  return workspaceOpportunities;
}

export async function getAllAccountOpportunities(accountId: string) {
  const accountOpportunities = await db.query.opportunityTable.findMany({
    where: eq(opportunityTable.accountId, accountId),
  });
  return accountOpportunities;
}

export async function createOpportunity(
  userId: string,
  workspaceId: string,
  accountId: string,
  title: string,
  value?: string,
  stage?: string,
  primaryContactId?: string,
  probability?: number,
  expectedCloseDate?: Date,
  description?: string,
  assignedToId?: string,
) {
  const [created] = await db
    .insert(opportunityTable)
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

export async function updateOpportunity(
  opportunityId: string,
  updates: Partial<Opportunity>,
) {
  const [updated] = await db
    .update(opportunityTable)
    .set(updates)
    .where(eq(opportunityTable.id, opportunityId))
    .returning();
  return updated;
}

export async function deleteOpportunity(opportunityId: string) {
  const deleted = await db
    .delete(opportunityTable)
    .where(eq(opportunityTable.id, opportunityId));
  return deleted;
}
