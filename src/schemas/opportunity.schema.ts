import { z } from "zod";

export const opportunityCreateSchema = z.object({
  value: z.string(),
  primaryContactId: z.string().optional(),
  probability: z.number().optional(),
  expectedCloseDate: z.date().optional(),
  assignedToId: z.string().optional(),
  description: z.string().optional(),
});
