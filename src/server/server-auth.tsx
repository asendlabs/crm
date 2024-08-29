"use server";
import {
  daCreateUser,
  daDeleteUser,
  daGetUserByEmail,
  daSetUserVerified,
  daCreateVerificationCode,
} from "@/dal/dal-user";
import { cookies } from "next/headers";
import { lucia } from "@/lib/lucia";
import { loginValidator, signUpValidator } from "@/validators/auth.validator";
import { z } from "zod";
import { compare, genSalt, hash } from "bcryptjs";
import { fetchLogggedInUser } from "@/lib/user";
import { sendEmail } from "@/lib/resend";

export const svSignUp = async (data: z.infer<typeof signUpValidator>) => {
  try {
    const { email, password } = data;
    cookies().set("login_email", email);

    // Check if user exists
    const user = await daGetUserByEmail(email);
    // If user exists and is verified, return error
    if (user && user.verifiedAt) {
      return {
        success: false,
        message: "An account already exists with this email address.",
        code: 409, // Conflict
      };
    }
    // If user exists and is not verified, delete the user
    if (user && !user.verifiedAt) {
      const updatedUser = await daDeleteUser(user.id);
    }

    // Hash the password
    const salt = await genSalt(11);
    const encryptedPassword = await hash(password, salt);

    // Create new user
    const createdUser = await daCreateUser(email, encryptedPassword);
    if (!createdUser) {
      return {
        success: false,
        message: "Failed to create a new account. Please try again later.",
        code: 500, // Internal Server Error
      };
    }

    // Send verification email
    const code = createdUser[0].verificationCode;
    const verificationEmailResponse = await sendEmail({
      to: email,
      subject: "Verify your email address",
      name: "Asend",
      from: "noreply@ascendifyr.in",
      react: (
        <>
          <h1>Your Verify Code is {code}</h1>
        </>
      ),
    });
    if (!verificationEmailResponse.success) {
      return {
        success: false,
        message: verificationEmailResponse.message,
        code: 500, // Internal Server Error
      };
    }

    // Create session
    const session = await lucia.createSession(createdUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      message: "Account created successfully.",
      code: 201,
    }; // Created
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during account creation. Please contact support if the issue persists.",
      code: 500, // Internal Server Error
    };
  }
};

export const svLogin = async (data: z.infer<typeof loginValidator>) => {
  try {
    const { email, password } = data;

    // Check if user exists
    const user = await daGetUserByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "No account found with this email address.",
        code: 404, // Not Found
      };
    }

    // Validate password
    const passwordCorrect = await compare(password, user.encryptedPassword!);
    if (!passwordCorrect) {
      return {
        success: false,
        message: "Incorrect credentials. Please try again.",
        code: 401, // Unauthorized
      };
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true, message: "Logged in successfully.", code: 200 }; // OK
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during login. Please contact support if the issue persists.",
      code: 500, // Internal Server Error
    };
  }
};

export const svVerifyEmail = async (email: string, code: string) => {
  try {
    const currentTime = new Date().getTime();
    // Check if the user exists
    const user = await daGetUserByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "To verify, there must be a user first",
        code: 404, // Not Found
      };
    }

    const dbVerificationCode = user.verificationCode;
    const dbVerificationCodeExpiresAt =
      user.verificationCodeCreatedAt!.getTime() + 1000 * 60 * 5;

    // Validate token
    if (
      !dbVerificationCode ||
      dbVerificationCode !== code ||
      dbVerificationCodeExpiresAt < currentTime
    ) {
      return {
        success: false,
        message: "Incorrect or Expired Code",
        code: 401, // Unauthorized
      };
    }

    // Update user verification status
    const updatedUser = await daSetUserVerified(user.id);
    if (!updatedUser) {
      return {
        success: false,
        message:
          "An internal error occurred during verification. Please contact support if the issue persists.",
        code: 500, // Internal Server Error
      };
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      message: "Email verified successfully.",
      code: 200, // OK,
    };
  } catch (error: any) {
    // Log the error with additional context
    console.error(`Error during email verification for email: ${email}`, error);

    return {
      success: false,
      message:
        "An unexpected error occurred during verification. Please contact support if the issue persists.",
      code: 500, // Internal Server Error
    };
  }
};

export const svCheckEmailAvailability = async (email: string) => {
  try {
    const user = await daGetUserByEmail(email);
    if (!user || !user.verifiedAt) {
      return {
        success: true,
        message: "Email available",
        code: 200, // OK
      };
    }
    return {
      success: false,
      message: "Already Existing Account, Login Instead",
      code: 400, // Bad Request
    };
  } catch (error: any) {
    // Log the error with additional context
    console.error(`Error during email verification for email: ${email}`, error);

    return {
      success: false,
      message:
        "An unexpected error occurred during verification. Please contact support if the issue persists.",
      code: 500, // Internal Server Error
    };
  }
};

export const svLogout = async () => {
  try {
    const user = await fetchLogggedInUser();
    if (!user) {
      return {
        success: false,
        message: "You are not logged in.",
        code: 401, // Unauthorized
      };
    }

    // Invalidate session
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    await lucia.invalidateSession(sessionId!);

    cookies().delete('login_email')

    return { success: true, message: "Logged out successfully.", code: 200 }; // OK
  } catch (error) {
    console.error("Error during logout:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during logout. Please contact support if the issue persists.",
      code: 500, // Internal Server Error
    };
  }
};
