"use server"

import VerificationEmail from "../../emails/VerificationEmail";
import resend from "@/lib/resend";

export default async function sendVerificationEmail(
  code: string,
  email: string
) {
  try {
    const emailsent = await resend.emails.send({
      from: "team@ascendifyr.in",
      to: email,
      subject: "Ascend - Verify your email",
      react: VerificationEmail({ code }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to Send Verification Email" };
  }
}
