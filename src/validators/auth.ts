import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, { message: "Enter first name" }),
    lastName: z.string().min(2, { message: "Enter last name" }),
    email: z.string().email({ message: "Enter a Valid Email Address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be less than 64 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Make sure that the passwords match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "Enter a Valid Email Address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be less than 64 characters" }),
});

export const verifySchema = z.object({
  code: z.string().min(6, { message: "Enter a valid code" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a Valid Email Address" }),
});