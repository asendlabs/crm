import { ReactNode } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  from,
  name,
  subject,
  react,
}: {
  to: string;
  from: string;
  name: string;
  subject: string;
  react: ReactNode;
}) {
  try {
    const { error } = await resend.emails.send({
      from: `${name} <${from}>`,
      to,
      subject: subject || "",
      react: <>{react}</>,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}
