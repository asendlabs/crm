import "server-only";
import { db } from "@database";
import { taskTable } from "@database/tables";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Task } from "@database/types";

export async function getTaskById(id: string) {
  const task = await db.query.taskTable.findFirst({
    where: eq(taskTable.id, id),
  });
  return task;
}

export async function getAllWorkspaceTasks(workspaceId: string) {
  const workspaceTasks = await db.query.taskTable.findMany({
    where: eq(taskTable.workspaceId, workspaceId),
    with: {
      account: true,
    },
  });
  return workspaceTasks;
}

export async function getAllAccountTasks(accountId: string) {
  const accountTasks = await db.query.taskTable.findMany({
    where: eq(taskTable.accountId, accountId),
    with: {},
  });
  return accountTasks;
}

export async function createTask({
  userId,
  workspaceId,
  accountId,
  title,
  priority,
  stage,
  dueDate,
  description,
  assignedToId,
}: {
  userId: string;
  workspaceId: string;
  accountId: string;
  title: string;
  stage: "todo" | "in_progress" | "done";
  dueDate?: Date;
  priority?: "high" | "low" | "medium";
  description?: string;
  assignedToId?: string;
}) {
  const [created] = await db
    .insert(taskTable)
    .values({
      id: ulid(),
      workspaceId,
      accountId,
      title,
      priority,
      stage,
      dueDate,
      assignedToId,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const [updated] = await db
    .update(taskTable)
    .set(updates)
    .where(eq(taskTable.id, taskId))
    .returning();
  return updated;
}

export async function deleteTask(taskId: string) {
  const deleted = await db.delete(taskTable).where(eq(taskTable.id, taskId));
  return deleted;
}
