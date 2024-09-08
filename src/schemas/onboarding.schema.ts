import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string().optional(),
  marketingConsent: z.boolean(),
  workspaceName: z.string().min(2, { message: "Workspace name is too short" }),
});
