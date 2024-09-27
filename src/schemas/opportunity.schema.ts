import { title } from "process";
import { z } from "zod";

export const opportunityCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  value: z.string().optional(),
  stage: z.string().optional(),
  accountId: z.string().min(1),
  primaryContactId: z.string().optional(),
  probability: z.number().optional(),
  expectedCloseDate: z.date().optional(),
  assignedToId: z.string().optional(),
  description: z.string().optional(),
});
