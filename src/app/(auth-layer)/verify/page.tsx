import { LogoutButton } from "@/components/auth/logout-button";
import { getLoggedInUser } from "@/server/user.server";
import { redirect } from "next/navigation";
import React from "react";

async function EmailVerifyPage() {
  const user = await getLoggedInUser();
  if (user && user.isVerified) return redirect("/inbox");
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>A verification email has been sent to your email address.</h1>
    </div>
  );
}

export default EmailVerifyPage;
