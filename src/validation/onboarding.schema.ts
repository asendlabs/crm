import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2),
  workspaceName: z.string().min(2),
});
  