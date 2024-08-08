import { z } from "zod";

export const contactSchema = z.object({
  contactName: z
    .string()
    .min(1, { message: "Contact name is required" })
    .max(255, {
      message: "Contact name must be less than 255 characters",
    }),
  leadId: z.string().min(1, { message: "Choosing a Lead is required" }),
});
