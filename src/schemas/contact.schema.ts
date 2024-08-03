import { z } from "zod";

export const contactSchema = z.object({
    contactName: z.string().min(3),
    jobTitle: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
    leadId: z.string(),
});
