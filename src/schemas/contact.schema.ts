import { z } from "zod";

export const contactCreateSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});
