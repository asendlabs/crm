import { z } from "zod";

export const onboardingSchema = z.object({
  workspaceName: z.string().min(1).max(50),
  
});