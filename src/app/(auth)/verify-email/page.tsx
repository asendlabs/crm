import { Metadata } from "next";
import React from "react";
import { VerifyEmailForm } from "@/components/forms/VerifyEmailForm";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { verifyEmailAction } from "./actions";
import { redirect } from "next/navigation";
import { afterVerifyUrl, unauthenticatedUrl } from "@/app-config";

export const metadata: Metadata = {
  title: "Verify your Email",
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
  return (
    <VerifyEmailForm action={verifyEmailAction} email={dbUser?.email || ""} />
  );
};

export default VerifyEmailPage;