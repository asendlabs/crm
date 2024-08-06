import { z } from "zod";

export const leadSchema = z.object({
  leadName: z.string().min(1, { message: "Lead name is required" }).max(255, {
    message: "Lead name must be less than 255 characters",
  }),
  contactName: z
    .string()
    .max(255, {
      message: "Contact name must be less than 255 characters",
    })
    .optional(),
});
