import { VerificationEmailBody } from "@emails/VerificationEmail";
import { sendEmail } from "./resend";

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const res = await sendEmail(
      email,
      "Verify your Email Address",
      <>
        Your verification code is <b>{code}</b>
      </>,
    );
    return res;
  } catch (error) {
    return error;
  }
}
