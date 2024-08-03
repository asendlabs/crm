import { z } from "zod";

export const contactSchema = z.object({
    contactName: z.string().min(3, {message: "Must be at least 3 characters"}),
    jobTitle: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
    leadId: z.string(),
});
