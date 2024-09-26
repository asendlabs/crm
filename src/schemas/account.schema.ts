import { z } from "zod";

export const accountCreateSchema = z.object({
  accountName: z.string(),
  type: z.enum(["lead", "customer"]).default("lead"),
  contactName: z.string().default("")
});