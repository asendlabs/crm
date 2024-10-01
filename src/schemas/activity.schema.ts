import { title } from "process";
import { z } from "zod";

export const activityCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["call", "email", "comment", "message"]).default("email"),
  description: z.string(),
  date: z.date().default(new Date()),
  contactId: z.string().optional(),
  accountId: z.string(),
});
