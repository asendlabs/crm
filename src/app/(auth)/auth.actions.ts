"use server";

import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { lucia } from "@/lib/lucia";
import { redirect } from "next/navigation";
import sendVerificationEmail from "@/lib/sendVerificationEmail";
import { signInSchema } from "@/validators/auth";
import { signUpSchema } from "@/validators/auth";
import { userTable } from "@/db/schema";
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
    const hashedPassword = await new Argon2id().hash(password);
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

    console.log(verification.message)

    if (!verification.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }


    // successful login
    const session = await lucia.createSession(user[0].id.toString() || '', {});
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
// sign in
// sign out
// verify
// reset password
