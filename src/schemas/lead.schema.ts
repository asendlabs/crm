import { z } from "zod";

export const leadSchema = z.object({
  leadName: z.string().min(2, {message: "Must be at least 2 characters"}),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional(),
});
