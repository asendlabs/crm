"use server";
import { createServerAction } from "zsa";
import { verificationCodeSchema } from "@/schemas/auth.schema";
import { redirect } from "next/navigation";
import { authenticatedAction } from "@/lib/zsa";
import { afterVerifyUrl } from "@/app-config";
import {
  getUserById,
  resendVerificationCode,
  updateUser,
} from "@/data-access/users";
import {
  AuthenticationError,
  EmailVerificationError,
  SomethingWentWrongError,
} from "@/data-access/_errors";
import { sendVerificationEmail } from "@/lib/mailers";
import { generateEmailVerifyCode } from "@/utils/generators";

export const verifyEmailAction = authenticatedAction
  .createServerAction()
  .input(verificationCodeSchema)
  .handler(async ({ input, ctx }) => {
    const { code } = input;
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new SomethingWentWrongError();
    }

    const isCodeCorrect = code === user.verificationCode;
    const isCodeNotExpired =
      new Date().getTime() <
      new Date(user.verificationCodeSentAt.getTime() + 5 * 60000).getTime();

    if (!isCodeCorrect || !isCodeNotExpired) {
      throw new EmailVerificationError();
    }

    const verifiedResponse = await updateUser(user.id, {
      verifiedAt: new Date(),
      verificationCode: null,
    });

    if (!verifiedResponse) {
      throw new SomethingWentWrongError();
    }

    return redirect(afterVerifyUrl);
  });

export const resendVerifyEmailAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new SomethingWentWrongError();
    }
    const code = generateEmailVerifyCode();
    const response = await updateUser(user.id, {
      updatedAt: new Date(),
      verificationCode: code,
      verificationCodeSentAt: new Date(),
    });
    if (!response) {
      throw new Error("Something went wrong nice");
    }
    await sendVerificationEmail(user.email, code);
    return true;
  });
