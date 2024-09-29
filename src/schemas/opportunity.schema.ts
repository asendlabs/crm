import { title } from "process";
import { z } from "zod";

export const opportunityCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  value: z.string().min(1, { message: "Value is required" }),
  accountId: z.string().min(1, { message: "Choosing a lead or customer is required" }),
  expectedCloseDate: z.date().optional(),
});
