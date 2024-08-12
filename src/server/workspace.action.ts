import { Workspace, workspaceTable } from "@/database/schema/types";

import { db } from "@/database/connection";
import { eq } from "drizzle-orm";

export const updateWorkspace = async (workspace: Workspace) => {
  try {
    const result = await db
      .update(workspaceTable)
      .set(workspace)
      .where(eq(workspaceTable.id, workspace.id))
      .execute();

    if (!result) {
      return { success: false, message: "No user was updated." };
    }

    return { success: true, message: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user." };
  }
};
