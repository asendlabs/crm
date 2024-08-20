import { z } from "zod";

export const signUpValidator = z.object({
  email: z.string().email({ message: "Enter a Valid Email" }),
  password: z
    .string()
    .min(12, { message: "Password length must be atleast 12" })
    .max(128, { message: "Passwords can't exceed the length of 128" }),
});

export const loginValidator = z.object({
  email: z.string().email({ message: "Enter a Valid Email" }),
  password: z
    .string()
    .min(12, { message: "Password length is atleast 12" })
    .max(128, { message: "Passwords can't exceed the length of 128" }),
});

export const verifyValidator = z.object({
  token: z.string(),
  email: z.string().email({ message: "Enter a Valid Email" }),
});