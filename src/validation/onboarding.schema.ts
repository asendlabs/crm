import { z } from "zod";
export const onboardingSchema = z.object({
  // Finalize Creating User
  fullName: z.string().min(2),
  profileImage: z.any().optional(),
  marketingConsent: z.boolean(),
  theme: z.string(),
  // Create a Workspace
  workspaceName: z.string().min(2),
  logoImage: z.any().optional(),
  analyticsConsent: z.boolean(),
});
