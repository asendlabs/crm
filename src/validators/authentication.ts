import { z } from "zod";

export const authenticationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  verifyCode: z.string().min(1, { message: "Verification code is required" }),
});
