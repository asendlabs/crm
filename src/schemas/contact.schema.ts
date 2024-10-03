import { z } from "zod";

export const contactCreateSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string().email().default(" "),
  contactPhone: z.string().optional().default(" "),
  accountId: z
    .string()
    .min(1, { message: "Choosing a lead or client is required" }),
});

export const contactUpdateSchema = z.object({
  contactName: z.string().min(1, { message: "Contact name is required" }),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
});
