"use server";

import { UserRequestTable, userTable } from "@/db/schema";
import {
  requestSchema,
  signInSchema,
  signUpSchema,
} from "@/validators/authentication";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { getUser } from "@/lib/actions/getUser";
import { lucia } from "@/lib/lucia";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import { z } from "zod";

// sign up
export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  try {
    const { name, email, password } = data;

    const existingEmail = await db.query.userTable.findFirst({
      where: eq(userTable.email, data.email),
    });
    if (existingEmail) {
      return {
        success: false,
        message: "User already exists",
      };
    }
    const salt = 11;
    bcrypt.genSalt(salt);
    const hashedPassword = (await bcrypt.hash(password, salt)).toString();
    const code = await generateId(56).toString();
    const userId = await generateId(27).toString();

    const user = await db
      .insert(userTable)
      .values({
        id: userId,
        name,
        email: email.toLowerCase(),
        hashedPassword,
        verifyCode: code,
      })
      .returning();

    if (!user) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }

    const verification = await sendVerificationEmail(code, email);

    console.log(verification.message);

    if (!verification.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }

    // successful signup
    const session = await lucia.createSession(user[0].id.toString() || "", {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "Account Created Successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error creating account",
    };
  }
};

export const signIn = async (data: z.infer<typeof signInSchema>) => {
  try {
    const { email, password } = data;

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "No user found with that email",
      };
    }

    const passwordMatch = bcrypt
      .compare(password, existingUser.hashedPassword)
      .toString();

    if (!passwordMatch) {
      return {
        success: false,
        message: "Incorrect password",
      };
    }

    // successful login
    const session = await lucia.createSession(
      existingUser.id.toString() || "",
      {}
    );
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error logging in",
    };
  }
};

export const signOut = async () => {
  try {
    const sessionId =
      cookies().get("authentication_key_ascendcrm_secure")?.value || null;

    if (!sessionId) return;

    if (sessionId) {
      await lucia.deleteExpiredSessions();
      await lucia.invalidateSession(sessionId);
    }
    cookies().delete("authentication_key_ascendcrm_secure");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error logging out",
    };
  }
};

export const verifyCode = async (code: string) => {
  try {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.verifyCode, code || ""),
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid Code or Verification Expired",
      };
    }

    user.isVerified = true;
    const verifyQuery = await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.id, user.id));

    if (!verifyQuery) {
      return {
        success: false,
        message: "Failed to update user",
      };
    }

    return {
      success: true,
      message: "Verification Successful, You can close this tab now!",
      email: user.email.toString(),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error verifying code",
    };
  }
};

export const resendVerifyCode = async () => {
  "use server";
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "You must be logged in to resend a verification email",
      };
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, user.email.toLowerCase() || ""),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "No user found with that email",
      };
    }

    const code = generateId(56).toString();

    const updateQuery = await db
      .update(userTable)
      .set({
        verifyCode: code,
      })
      .where(eq(userTable.id, existingUser.id));

    if (!updateQuery) {
      return {
        success: false,
        message: "Failed to create new verification code",
      };
    }
    const sentEmail = await sendVerificationEmail(
      code,
      user.email.toString().toLowerCase()
    );

    if (!sentEmail.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error sending new verification email",
    };
  }
};

export const resetPassword = async (data: z.infer<typeof requestSchema>) => {
  try {
    const { email } = data;

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "No user found with that email",
      };
    }

    const newRequest = await db
      .insert(UserRequestTable)
      .values({
        id: generateId(22).toString(),
        userId: existingUser.id,
        email: existingUser.email,
        type: "password_reset",
      })
      .returning();

    if (!newRequest) {
      return {
        success: false,
        message: "Failed to create new request",
      };
    }
    return {
      success: true,
      message: "Password reset request Created",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error creating new request",
    };
  }
};
