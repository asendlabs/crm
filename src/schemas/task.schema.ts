import z from "zod";

export const taskCreateSchema = z.object({
  accountId: z
    .string()
    .min(1, { message: "Choosing a lead or client is required" }),
  title: z.string().min(1, { message: "A task title is required" }),
  stage: z.enum(["todo", "in_progress", "done"]),
  dueDate: z.date().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  description: z.string().optional(),
});
