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

export async function createActivity(
  userId: string,
  workspaceId: string,
  accountId: string,
  activityType: "call" | "meeting" | "email" | "note" | "message",
  description: string,
  fromTimeStamp: Date,
  toTimeStamp: Date,
  priority: "low" | "medium" | "high",
  status: "due" | "done" | "cancelled",
) {
  const [created] = await db
    .insert(activityTable)
    .values({
      id: ulid(),
      accountId,
      workspaceId,
      activityType,
      description,
      fromTimeStamp,
      toTimeStamp,
      priority,
      status,
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
