import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255),
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255),
  password: z.string(),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .length(5, { message: "Verification code must be 5 characters long." }),
});
