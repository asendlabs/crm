"use server";
import { createServerAction } from "zsa";
import { verificationCodeSchema } from "@/schemas/auth.schema";
import { redirect } from "next/navigation";
import { authenticatedAction } from "@/lib/zsa";
import { afterVerifyUrl } from "@/constants";
import { getUserById, updateUser } from "@/data-access/users";
import { sendVerificationEmail } from "@/lib/mailers";
import { generateEmailVerifyCode } from "@/utils";

export const verifyEmailAction = authenticatedAction
  .createServerAction()
  .input(verificationCodeSchema)
  .handler(async ({ input, ctx }) => {
    const { code } = input;
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new Error("Something went wrong. User not found."); // Inline error
    }

    const isCodeCorrect = code === user.verificationCode;
    const isCodeNotExpired =
      new Date().getTime() <
      new Date(user.verificationCodeSentAt.getTime() + 5 * 60000).getTime();

    if (!isCodeCorrect || !isCodeNotExpired) {
      throw new Error("Email verification failed. Invalid or expired code."); // Inline error
    }

    const verifiedResponse = await updateUser(user.id, {
      verifiedAt: new Date(),
      verificationCode: null,
    });

    if (!verifiedResponse) {
      throw new Error(
        "Something went wrong. Unable to update user verification status.",
      ); // Inline error
    }

    return redirect(afterVerifyUrl);
  });

export const resendVerifyEmailAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new Error("Something went wrong. User not found.");
    }
    const code = generateEmailVerifyCode();
    const response = await updateUser(user.id, {
      updatedAt: new Date(),
      verificationCode: code,
      verificationCodeSentAt: new Date(),
    });
    if (!response) {
      throw new Error("Failed to update user for email verification");
    }
    await sendVerificationEmail(user.email, code);
    return true;
  });
