"use server";
import { createServerAction } from "zsa";
import { signUpSchema } from "@/schemas/auth.schema";
import {
  createIdentity,
  createUser,
  createUserWithoutPassword,
  getIdentityByUserId,
  getUserByEmail,
  recreateUser,
  updateUser,
} from "@/data-access/users";
import { createSessionForUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { afterSignUpUrl } from "@/constants";
import { sendVerificationEmail } from "@/lib/mailers";

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      const createdUser = await createUser(email, password);
      if (!createdUser) {
        throw new Error("Something went wrong. Unable to sign up.");
      }
      await sendVerificationEmail(email, createdUser.verificationCode!);
      await createSessionForUser(createdUser.id);
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
      await createSessionForUser(recreatedUser.id);
    }
    return redirect(afterSignUpUrl);
  });
