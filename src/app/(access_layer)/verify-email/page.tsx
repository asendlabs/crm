import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { VerifyEmailForm } from "@/components/forms/VerifyEmailForm";
import { UserIcon } from "lucide-react";
import { ChangeEmailLink } from "@/components/forms/related/ChangeEmailLink";
import { redirect } from "next/navigation";
import { authGateways } from "@/lib/gateways";

export const metadata: Metadata = {
  title: "Verify your Email | Ascend",
};

const VerifyEmailPage = async () => {
  await authGateways.accessLayerApp("verify-email");
  const loginEmail = cookies().get("login_email")?.value;
  if (!loginEmail) return redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      {/* User Avatar or Initials */}
      <span
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full md:right-8 md:top-8",
        )}
      >
        {loginEmail ? (
          loginEmail.charAt(0).toUpperCase()
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </span>

      {/* Main Container */}
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your Email
          </h1>
          <div className="mt-2 flex flex-row items-center justify-center gap-2 text-sm text-gray-600 group">
            <p>
              Enter the code we sent to{" "}
              <span
                className={
                  loginEmail ? "font-semibold cursor-pointer" : "text-muted-foreground"
                }
              >
                {loginEmail ? loginEmail : "your email"}
              </span>{" "}
            </p>
            <ChangeEmailLink />
            {""}
          </div>
          {/* Email Change Form */}
        </div>

        {/* Verification Form */}
        <VerifyEmailForm email={loginEmail!} />
      </div>
    </main>
  );
};

export default VerifyEmailPage;
