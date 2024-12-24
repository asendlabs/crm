"use server";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { createTask, deleteTask, updateTask } from "@/data-access/tasks";
import { selectedWorkspaceCookie } from "@/constants";
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
    const { user, workspaceId } = ctx;
    for (const itemId of itemIds) {
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
    const { user, workspaceId } = ctx;
    if (!workspaceId) throw new Error("Workspace not found"); // Inline error
    const taskRes = await createTask({
      userId: user.id,
      workspaceId,
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
