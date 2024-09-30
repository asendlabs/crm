import { z } from "zod";

export const contactCreateSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  accountId: z
    .string()
    .min(1, { message: "Choosing a lead or client is required" }),
});
