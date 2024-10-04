import "server-only";
import { db } from "@database";
import { activityTable } from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Activity } from "@database/types";

export async function getActivityById(id: string) {
  const activity = await db.query.activityTable.findFirst({
    where: eq(activityTable.id, id),
  });
  return activity;
}

export async function getAllWorkspaceActivities(workspaceId: string) {
  const workspaceActivities = await db.query.activityTable.findMany({
    where: eq(activityTable.workspaceId, workspaceId),
  });
  return workspaceActivities;
}

export async function getAllAccountActivities(accountId: string) {
  const accountActivities = await db.query.activityTable.findMany({
    where: eq(activityTable.accountId, accountId),
  });
  return accountActivities;
}

export async function createActivity({
  userId,
  workspaceId,
  accountId,
  title,
  activityType,
  content,
  isEntityActivity,
  entityTitle,
  entityType,
  associatedContactId,
}: {
  userId: string;
  workspaceId: string;
  accountId: string;
  title: string;
  activityType:
    | "email"
    | "call"
    | "message"
    | "comment"
    | "task_completion"
    | "entity_creation"
    | "entity_deletion";
  content?: string;
  associatedContactId?: string;
  isEntityActivity?: boolean;
  entityTitle?: string;
  entityType?: "deal" | "contact";
}) {
  const [created] = await db
    .insert(activityTable)
    .values({
      id: ulid(),
      accountId,
      workspaceId,
      associatedContactId,
      title,
      activityType,
      content,
      isEntityActivity,
      entityTitle,
      entityType,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function updateActivity(
  activityId: string,
  updates: Partial<Activity>,
) {
  const [updated] = await db
    .update(activityTable)
    .set(updates)
    .where(eq(activityTable.id, activityId))
    .returning();
  return updated;
}

export async function deleteActivity(activityId: string) {
  const deleted = await db
    .delete(activityTable)
    .where(eq(activityTable.id, activityId));
  return deleted;
}
