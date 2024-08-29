import { z } from "zod";

export const signUpValidator = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
});

export const loginValidator = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

export const verificationCodeValidator = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 characters long")
    .max(6, "Verification code must be 6 characters long"),
});
