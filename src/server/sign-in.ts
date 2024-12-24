"use server";
import { signInSchema } from "@/schemas/auth.schema";
import { checkUserPassword } from "@/data-access/users";
import { createSession, generateSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { authCookie, authenticatedUrl } from "@/constants";
import { cookies } from "next/headers";

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const cookieStore = await cookies();
    const user = await checkUserPassword(email, password);
    if (!user) {
      throw new Error("Invalid email or password"); // Inline error
    }
    const token = generateSessionToken();
    await createSession(token, user.id);
    cookieStore.set(authCookie, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return redirect(authenticatedUrl);
  });
