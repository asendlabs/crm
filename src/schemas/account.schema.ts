import { z } from "zod";

export const accountCreateSchema = z.object({
  accountName: z.string().min(1, { message: "Account name is required" }),
  type: z.enum(["lead", "client"]).default("lead"),
  contactName: z.string().min(1, { message: "Contact name is required" }),
});
