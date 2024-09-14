import { z } from "zod";

export const accountCreateSchema = z.object({
  accountName: z.string().optional(),
  type: z.enum(["lead", "customer"]).default("lead"),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});