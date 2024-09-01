import { z } from "zod";

export const createProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name cannot exceed 255 characters" }),
  marketingConsent: z.boolean(),
});

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name cannot exceed 255 characters" }),
});