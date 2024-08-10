"use server";

import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient, lucia } from "@/lib/lucia";
import { userTable, workspaceTable } from "@/database/schema";

import { VerificationEmail } from "@/emails/VerificationEmail";
import { authenticationSchema } from "@/validation/auth.schema";
import { cookies } from "next/headers";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/mailer";
import { ulid } from "ulid";
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
    }
    if (user) {
      const updateQuery = await db
        .update(userTable)
        .set({
          verifyCode,
          verifyCodeGeneratedAt,
        })
        .where(eq(userTable.id, user?.id || ""));
    }

    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Asend",
      subject: `Your temporary Asend code is ${verifyCode}`,
      react: <VerificationEmail verifyCode={verifyCode} />,
    });

    if (!emailSent?.success) {
      return {
        success: false,
        message: "Something went Wrong with Sending Email",
      };
    }

    return {
      success: true,
      message: "Login code sent successfully",
    };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
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

    const updateQuery = await db
      .update(userTable)
      .set({
        verifyCode,
        verifyCodeGeneratedAt,
      })
      .where(eq(userTable.id, user.id));

    if (!updateQuery) {
      return { success: false, message: "Something went Wrong" };
    }

    const emailSent = await sendEmail({
      to: email,
      from: "no-reply@ascendifyr.in",
      name: "Asend",
      subject: `Your temporary Asend code is ${verifyCode}`,
      react: <VerificationEmail verifyCode={verifyCode} />,
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

    const authSession = await lucia.createSession(user.id, {});
    const authSessionCookie = lucia.createSessionCookie(authSession.id);
    cookies().set(
      authSessionCookie.name,
      authSessionCookie.value,
      authSessionCookie.attributes,
    );

    // set the user id in the cookies
    cookies().set({
      name: "uid",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // set the workspace id in the cookies
    const workspace = await db.query.workspaceTable.findFirst({
      where: eq(workspaceTable.primaryOwnerUserId, user.id),
    });

    if (!workspace) {
      cookies().set({
        name: "wid",
        value: "not_found",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return { success: true, redirectUrl: "/welcome" };
    }

    cookies().set({
      name: "wid",
      value: workspace.id!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Instead of using redirect directly, return the success status
    return { success: true, redirectUrl: "/inbox" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

export const signOut = async () => {
  try {
    const sessionCookieId = cookies().get("sessionid")?.value;

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
