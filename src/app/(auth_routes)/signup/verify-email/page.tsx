import { Metadata } from "next";
import React from "react";
import { VerifyEmailForm } from "./_components/VerifyEmailForm";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { afterVerifyUrl, unauthenticatedUrl } from "@/constants";

export const metadata: Metadata = {
  title: "Verify your email",
};

const VerifyEmailPage = async () => {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(user.id);
  if (dbUser?.verifiedAt) {
    return redirect(afterVerifyUrl);
  }
  return <VerifyEmailForm email={dbUser?.email || ""} />;
};

export default VerifyEmailPage;
