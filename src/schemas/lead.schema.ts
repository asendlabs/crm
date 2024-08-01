import { z } from "zod";

export const leadSchema = z.object({
  leadName: z.string().min(3),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional(),
});
