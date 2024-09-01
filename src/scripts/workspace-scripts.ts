import { eq, inArray } from "drizzle-orm";
import { ulid } from "ulid";
import { db } from "@database";
import { workspaceTable, workspaceUserTable } from "@database/tables";
import { Workspace } from "@database/types";

export const getWorkspaceById = async (
  workspaceId: string,
): Promise<Workspace | undefined> => {
  const workspace = await db.query.workspaceTable.findFirst({
    where: eq(workspaceTable.id, workspaceId),
  });

  return workspace;
};

export const getAllUserWorkspaces = async (
  userId: string,
): Promise<Workspace[]> => {
  const workspaceUserAssociations = await db.query.workspaceUserTable.findMany({
    where: eq(workspaceUserTable.userId, userId),
  });
  const workspaceIds = workspaceUserAssociations.map(
    ({ workspaceId }) => workspaceId,
  );
  if (workspaceIds.length === 0) return [];

  const workspaces = await db.query.workspaceTable.findMany({
    where: inArray(workspaceTable.id, workspaceIds),
  });
  return workspaces;
};

export const createWorkspace = async ({
  name,
  primaryOwnerId,
  logoUrl,
}: {
  name: string;
  primaryOwnerId: string;
  logoUrl: string;
}) => {
  const workspace = await db
    .insert(workspaceTable)
    .values({
      id: ulid(),
      name,
      primaryOwnerId,
      logoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: primaryOwnerId,
      updatedById: primaryOwnerId,
    })
    .returning();

  return workspace[0];
};

export const createWorkspaceUser = async ({
  workspaceId,
  userId,
  role,
}: {
  workspaceId: string;
  userId: string;
  role: string;
}) => {
  const workspaceUser = await db.insert(workspaceUserTable).values({
    workspaceId,
    userId,
    role,
  });

  return workspaceUser;
};
