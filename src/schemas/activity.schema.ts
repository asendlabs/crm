import { z } from "zod";

export const activityCreateSchema = z.object({
  activityType: z
    .enum(["call", "meeting", "email", "note", "message"])
    .default("email"),
  description: z.string(),
  fromTimeStamp: z.date(),
  toTimeStamp: z.date(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["due", "done", "cancelled"]).default("due"),
});
