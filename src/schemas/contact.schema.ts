import { z } from "zod";

export const contactCreateSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string().email().default(" "),
  contactPhone: z.string().optional().default(" "),
  jobTitle: z
    .string()
    .max(255, { message: "Job title must not exceed 255 characters" })
    .optional(),
  accountId: z
    .string()
    .min(1, { message: "Choosing a lead or client is required" }),
});

export const contactUpdateSchema = z.object({
  contactName: z.string().min(1, { message: "Contact name is required" }),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  jobTitle: z
    .string()
    .max(255, { message: "Job title must not exceed 255 characters" })
    .optional(),
});
