import { Resend } from "resend";

import { env } from "@/env";
import { ReactNode } from "react";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode,
) {
  const { error } = await resend.emails.send({
    from: "Asend <noreply@ascendifyr.in>",
    to: email,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}
