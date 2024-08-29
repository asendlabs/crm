import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";
import { externalAppAuthRouter } from "@/lib/auth-routers";
import { cookies } from "next/headers";
import { VerifyEmailForm } from "@/components/auth/verify-form";
import { UserIcon } from "lucide-react";
import ChangeEmailOnSignUpForms from "@/components/auth/change-email";

export const metadata: Metadata = {
  title: "Verify your Email | Asend",
};

const VerifyEmailPage = async () => {
  await externalAppAuthRouter();
  const loginEmail = cookies().get("login_email")?.value;
  return (
    <main className="grid h-screen items-center">
      <span
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full md:right-8 md:top-8",
        )}
      >
        {loginEmail ? loginEmail.charAt(0) : <UserIcon className="h-4 w-4" />}
      </span>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify your Email
            </h1>
            <p className="inline text-sm text-muted-foreground">
              Enter the code we sent to{" "}
              {loginEmail ? loginEmail : "your email"}
              <ChangeEmailOnSignUpForms />
            </p>
          </div>
          <VerifyEmailForm email={loginEmail!} />
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
