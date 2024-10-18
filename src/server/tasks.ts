"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "@/data-access/tasks";
import { selectedWorkspaceCookie } from "@/constants";
import { cookies } from "next/headers";
import { taskCreateSchema } from "@/schemas/task.schema";

export const updateTaskAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemId: z.string(),
      columnId: z.string(),
      newValue: z.any().optional(), // Allow for date type
    }),
  )
  .handler(async ({ input }) => {
    const { columnId, itemId, newValue } = input;

    const res = await updateTask(itemId, {
      [columnId!]: newValue, // Ensure to use the correct column
    });
    if (!res) {
      throw new Error("Could not update the task."); // Inline error message
    }
    return true;
  });

export const deleteTaskAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { itemIds } = input;
    const { user } = ctx;
    for (const itemId of itemIds) {
      const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
      if (!currentWorkspaceId) {
        throw new Error("Workspace not found"); // Inline error
      }
      const res = await deleteTask(itemId);
      if (!res) {
        throw new Error("Could not delete the task."); // Inline error message
      }
    }
    return true;
  });

export const createTaskAction = authenticatedAction
  .createServerAction()
  .input(taskCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { title, description, accountId, dueDate, stage, priority } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found."); // Inline error message
    }
    const taskRes = await createTask({
      userId: user.id,
      workspaceId: currentWorkspaceId,
      accountId,
      title,
      description,
      dueDate,
      stage,
      priority,
    });

    if (!taskRes) {
      throw new Error("Could not create the task."); // Inline error message
    }

    return {
      success: true,
      data: taskRes,
    };
  });
