"use server";
import {
  daCreateUser,
  daDeleteUser,
  daGetUserByEmail,
  daUpdateVerificationStatus,
  daUpdateVerificationToken,
} from "@/data-access/user.data-access";
import { cookies } from "next/headers";
import { lucia } from "@/lib/lucia";
import { loginValidator, signUpValidator } from "@/validators/auth.validator";
import { z } from "zod";
import { compare, genSalt, hash } from "bcryptjs";
import { getLoggedInUser } from "./user.server";
import { sendVerificationEmail } from "@/emails/sender";

export const svSignUp = async (data: z.infer<typeof signUpValidator>) => {
  try {
    const { email, password } = data;

    // Check if user exists
    const user = await daGetUserByEmail(email);
    // If user exists and is verified, return error
    if (user && user.isVerified) {
      return {
        success: false,
        message: "An account already exists with this email address.",
        code: 409, // Conflict
      };
    }
    // If user exists and is not verified, delete the user
    if (user && !user.isVerified) {
      const updatedUser = await daDeleteUser(user.id);
    }

    // Hash the password
    const salt = await genSalt(11);
    const hashedPassword = await hash(password, salt);

    // Create new user
    const createdUser = await daCreateUser(email, hashedPassword);
    if (!createdUser) {
      return {
        success: false,
        message: "Failed to create a new account. Please try again later.",
        code: 500, // Internal Server Error
      };
    }

    // Send verification email
    const token = createdUser[0].verificationToken;
    const verificationEmailResponse = await sendVerificationEmail(
      email,
      token!,
    );
    if (!verificationEmailResponse.success) {
      return {
        success: false,
        message: verificationEmailResponse.message,
        code: 500, // Internal Server Error
      };
    }

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
    const passwordCorrect = await compare(password, user.hashedPassword!);
    if (!passwordCorrect) {
      return {
        success: false,
        message: "Incorrect credentials. Please try again.",
        code: 401, // Unauthorized
      };
    }
    // Check if the user is verified
    if (!user.isVerified) {
      const updatedUser = await daUpdateVerificationToken(user.id);
      const token = updatedUser[0].verificationToken;
      const verificationEmailResponse = await sendVerificationEmail(
        user.email,
        token!,
      );
      if (!verificationEmailResponse.success) {
        return {
          success: false,
          message:
            "An unexpected error occurred during sending a verification email. Please contact support if the issue persists.",
          code: 500, // Internal Server Error
        };
      }
      return {
        success: false,
        message:
          "Your account is not verified. Check your email for a verification link.",
        code: 900, // Unauthorized
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

export const svVerifyEmail = async (email: string, token: string) => {
  try {
    // Check if the user exists
    const user = await daGetUserByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "No account found with this email address.",
        code: 404, // Not Found
      };
    }

    // Validate token
    if (!user.verificationToken || user.verificationToken !== token) {
      return {
        success: false,
        message: "Incorrect or expired token. Please try again.",
        code: 401, // Unauthorized
      };
    }

    // Update user verification status
    const updatedUser = await daUpdateVerificationStatus(user.id);
    if (!updatedUser) {
      return {
        success: false,
        message:
          "Failed to update user verification status. Please try again later.",
        code: 500, // Internal Server Error
      };
    }

    return {
      success: true,
      message: "Email verified successfully.",
      code: 200, // OK
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
    if (!user || !user.isVerified) {
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
    const user = await getLoggedInUser();
    if (!user) {
      return {
        success: false,
        message: "You are not logged in.",
        code: 401, // Unauthorized
      };
    }

    // Invalidate session
    const sessionId = cookies().get("sid")?.value;
    await lucia.invalidateSession(sessionId!);

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
