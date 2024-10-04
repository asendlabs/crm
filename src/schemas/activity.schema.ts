import { z } from "zod";

export const activityCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["call", "comment", "message", "email"]),
  content: z.string().optional(),
  date: z.date().default(new Date()).optional(),
  contactId: z.string().optional(),
  accountId: z.string(),
});
