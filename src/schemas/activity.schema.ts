import { z } from "zod";

export const activityCreateSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["call", "comment", "message", "email"]).optional(),
  content: z.string().optional(),
  date: z.date().default(new Date()).optional(),
  contactId: z.string().optional(),
  accountId: z.string(),
});
