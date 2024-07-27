"use server";

import { VerificationEmail } from "@/emails/VerificationEmail";
import { authenticationSchema } from "@/validators/authentication";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { lucia } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { userTable } from "@/db/schema";
import z from "zod";

function generateVerifyCode(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 4 === 0) {
      result += "-";
    }
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export const sendCode = async (email: string) => {
  try {
    const verifyCode = generateVerifyCode(16);
    const verifyCodeGeneratedAt = new Date();
    const id = generateId(21).toString().toLowerCase();

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      await db.insert(userTable).values({
        id,
        email,
        verifyCode,
        verifyCodeGeneratedAt,
      });

      const emailSent = await sendEmail({
        to: email,
        from: "no-reply@ascendifyr.in",
        name: "Ascend",
        subject: `Your Ascend sign up code is ${verifyCode}`,
        react: <VerificationEmail verifyCode={verifyCode} type="signup" />,
      });

      if (!emailSent?.success) {
        return {
          success: false,
          message: "Something went Wrong",
          type: "signup",
        };
      }

      return {
        success: true,
        message: "Code sent successfully",
        type: "signup",
      };
    }

    user.verifyCode = verifyCode;
    user.verifyCodeGeneratedAt = verifyCodeGeneratedAt;

    const updateQuery = await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.id, user.id));

    if (!updateQuery) {
      return { success: false, message: "Something went Wrong", type: "login" };
    }

    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Ascend",
      subject: `Your temporary Ascend login code is ${verifyCode}`,
      react: <VerificationEmail verifyCode={verifyCode} type="login" />,
    });

    if (!emailSent?.success) {
      return {
        success: false,
        message: "Something went Wrong with Sending Email",
        type: "login",
      };
    }

    return {
      success: true,
      message: "Code sent successfully",
      type: "login",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong", type: null };
  }
};

export const resendCode = async (email: string) => {
  try {
    const verifyCode = generateVerifyCode(16);
    const verifyCodeGeneratedAt = new Date();

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return { success: false, message: "Couldn't find existing user" };
    }

    user.verifyCode = verifyCode;
    user.verifyCodeGeneratedAt = verifyCodeGeneratedAt;

    const updateQuery = await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.id, user.id));

    if (!updateQuery) {
      return { success: false, message: "Something went Wrong" };
    }

    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Ascend",
      subject: `Your Ascend code is ${verifyCode}`,
      react: <VerificationEmail verifyCode={verifyCode} type="login" />,
    });

    if (!emailSent?.success) {
      return { success: false, message: "Something went Wrong" };
    }
    return { success: true, message: "New code sent successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const authenticate = async (
  data: z.infer<typeof authenticationSchema>
) => {
  try {
    const { email, verifyCode } = data;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return { success: false, message: "Couldn't find email" };
    }

    if (user.verifyCode !== verifyCode) {
      return { success: false, message: "Invalid Code" };
    }

    // Success
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true, message: "Successfully Logged In" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};
