import { z } from "zod";

export const updateAccountSchema = z.object({
  name: z.string().min(2, { message: "Enter new name" }),
  email: z.string().email({ message: "Enter valid email" }),
});