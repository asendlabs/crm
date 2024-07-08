import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Enter your name" }),
    email: z.string().email({ message: "Enter a Valid Email Address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be less than 64 characters" }),
  })

export const signInSchema = z.object({
  email: z.string().email({ message: "Enter a Valid Email Address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be less than 64 characters" }),
});

export const verifySchema = z.object({
  code: z.string().length(8, { message: "OTP must be 8 digits" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a Valid Email Address" }),
});