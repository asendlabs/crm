"use server";

import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient, lucia } from "@/lib/auth";

import { VerificationEmail } from "@/emails/VerificationEmail";
import { authenticationSchema } from "@/schemas/auth.schema";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { ulid } from "ulid";
import { userTable } from "@/db/schema/tables";
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
    const id = ulid();

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
        name: "Asend",
        subject: `Your Asend sign up code is ${verifyCode}`,
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
        message: "Sign up code sent successfully",
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

    if (!user.accountCompleted) {
      const emailSent = await sendEmail({
        to: email,
        from: "no-reply@ascendifyr.in",
        name: "Asend",
        subject: `Your Asend sign up code is ${verifyCode}`,
        react: <VerificationEmail verifyCode={verifyCode} type="signup" />,
      });

      if (!emailSent?.success) {
        return {
          success: false,
          message: "Something went Wrong with Sending Email",
          type: "signup",
        };
      }

      return {
        success: true,
        message: "Sign up code sent successfully",
        type: "signup",
      };
    }
    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Asend",
      subject: `Your temporary Asend login code is ${verifyCode}`,
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
      message: "Login code sent successfully",
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

    if (!user.accountCompleted) {
      const emailSent = await sendEmail({
        to: email,
        from: "no-reply@ascendifyr.in",
        name: "Asend",
        subject: `Your Asend sign up code is ${verifyCode}`,
        react: <VerificationEmail verifyCode={verifyCode} type="signup" />,
      });

      if (!emailSent?.success) {
        return { success: false, message: "Something went Wrong" };
      }
      return { success: true, message: "New sign up code sent successfully" };
    }

    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Asend",
      subject: `Your temporary Asend login code is ${verifyCode}`,
      react: <VerificationEmail verifyCode={verifyCode} type="login" />,
    });

    if (!emailSent?.success) {
      return { success: false, message: "Something went Wrong" };
    }
    return { success: true, message: "New login code sent successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const authenticate = async (
  data: z.infer<typeof authenticationSchema>,
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

    if (!user.accountCompleted) {
      user.accountCompleted = true;
      const updateQuery = await db
        .update(userTable)
        .set(user)
        .where(eq(userTable.id, user.id));

      if (!updateQuery) {
        return {
          success: false,
          message: "Something went Wrong",
        };
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return { success: true, message: "Successfully Signed Up" };
    }

    // Success
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true, message: "Successfully Logged In" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

export const signOut = async () => {
  try {
    const sessionCookieId = cookies().get("auth_key")?.value;

    const { session } = await lucia.validateSession(sessionCookieId!);

    if (!session) {
      return {
        success: false,
        error: "Session not found",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message,
    };
  }
};

export const getGoogleOAuthConsentUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookies().set("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email"],
      },
    );

    return { success: true, url: authUrl.toString() };
  } catch (error) {
    return { success: false, message: "Something went wrong", url: "" };
  }
};
