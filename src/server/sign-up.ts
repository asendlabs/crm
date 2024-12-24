"use server";
import { signUpSchema } from "@/schemas/auth.schema";
import { createUser, getUserByEmail, recreateUser } from "@/data-access/users";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { afterSignUpUrl, authCookie } from "@/constants";
import { sendVerificationEmail } from "@/lib/mailers";
import { createSession, generateSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const cookieStore = await cookies();
    const user = await getUserByEmail(email);
    if (!user) {
      const createdUser = await createUser(email, password);
      if (!createdUser) {
        throw new Error("Something went wrong. Unable to sign up.");
      }
      await sendVerificationEmail(email, createdUser.verificationCode!);
      const token = generateSessionToken();
      await createSession(token, createdUser.id);
      cookieStore.set(authCookie, token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    if (user && user.verifiedAt) {
      throw new Error("An existing account is associated with this email.");
    }
    if (user && !user.verifiedAt) {
      const recreatedUser = await recreateUser(email, password);
      if (!recreatedUser) {
        throw new Error("Something went wrong. Unable to sign up.");
      }
      await sendVerificationEmail(email, recreatedUser.verificationCode!);
      const token = generateSessionToken();
      await createSession(token, recreatedUser.id);
      cookieStore.set(authCookie, token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    return redirect(afterSignUpUrl);
  });
