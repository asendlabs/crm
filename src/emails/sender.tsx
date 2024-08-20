import { sendEmail } from "@/lib/resend";
import { VerificationEmailBody } from "./templates/verification-email";
import { env } from "@/env";

export const sendVerificationEmail = async (email: string, token: string) => {
  const response = await sendEmail({
    to: email,
    name: "Asend",
    from: "noreply@ascendifyr.in",
    subject: "Verify Your Email",
    react: (
      <VerificationEmailBody
        email={email}
        token={token}
        baseurl={env.NEXT_PUBLIC_URL}
      />
    ),
  });
  if (!response.success) {
    return {
      success: false,
      message: response.message,
    };
  }
  return {
    success: true,
    message: "Verification Email sent successfully",
  };
};
