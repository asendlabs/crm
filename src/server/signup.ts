"use server";
import { createServerAction } from "zsa";
import { loginSchema } from "@/schemas/auth.schema";
import {
  createUser,
  getUserByEmail,
  recreateUser,
  updateUser,
} from "@/data-access/users";
import { EmailInUseError, UserNotCreatedError } from "@/data-access/_errors";
import { createSessionForUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { afterSignUpUrl } from "@/urls";
import { sendVerificationEmail } from "@/lib/mailers";

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(loginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      const createdUser = await createUser(email, password);
      if (!createdUser) {
        throw new UserNotCreatedError();
      }
      await sendVerificationEmail(email, createdUser.verificationCode!);
      await createSessionForUser(createdUser.id);
    }
    if (user && user.verifiedAt) {
      throw new EmailInUseError();
    }
    if (user && !user.verifiedAt) {
      const recreatedUser = await recreateUser(email, password);
      if (!recreatedUser) {
        throw new UserNotCreatedError();
      }
      await sendVerificationEmail(email, recreatedUser.verificationCode!);
      await createSessionForUser(recreatedUser.id);
    }
    return redirect(afterSignUpUrl);
  });
