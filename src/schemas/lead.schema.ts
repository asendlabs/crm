import { z } from "zod";

export const leadSchema = z.object({
  leadName: z.string().min(2, { message: "Must be at least 2 characters" }),
  description: z.string().optional(),
  addresses: z.string().optional(),
  url: z.string().url().optional(),
});
