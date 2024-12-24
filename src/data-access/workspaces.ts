import "server-only";
import { db } from "@/database";
import { workspaceTable, workspaceUserTable } from "@/database/tables";
import { eq, inArray } from "drizzle-orm";
import { ulid } from "ulid";
import { getUserById } from "./users";
import { Workspace } from "@/database/types";

export async function getWorkspaceById(id: string) {
  const workspace = await db.query.workspaceTable.findFirst({
    where: eq(workspaceTable.id, id),
  });
  return workspace;
}

export async function getAllUserWorkspaces(userId: string) {
  // Fetch user and extract workspace IDs
  const user = await getUserById(userId);

  const workspaceUserTable = user?.workspaceUserTable;

  const workspaceIds = workspaceUserTable?.map((workspaceUser) => {
    return workspaceUser.workspaceId;
  });

  // If there are no workspace IDs, return an empty array
  if (workspaceIds!.length === 0) {
    return [];
  }

  // Query the workspaces using the workspace IDs
  const workspaces = await db.query.workspaceTable.findMany({
    where: inArray(workspaceTable.id, workspaceIds!),
  });

  return workspaces;
}
export async function createWorkspace(name: string, primaryOwnerId: string) {
  const [created] = await db
    .insert(workspaceTable)
    .values({
      id: ulid(),
      name,
      primaryOwnerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: primaryOwnerId,
      updatedById: primaryOwnerId,
    })
    .returning();
  return created;
}
export async function createWorkspaceUser(
  workspaceId: string,
  userId: string,
  role: string,
) {
  const [created] = await db
    .insert(workspaceUserTable)
    .values({
      workspaceId,
      userId,
      role,
    })
    .returning();
  return created;
}

export async function updateWorkspace(
  workspaceId: string,
  updates: Partial<Workspace>,
) {
  const [updated] = await db
    .update(workspaceTable)
    .set(updates)
    .where(eq(workspaceTable.id, workspaceId))
    .returning();
  return updated;
}
