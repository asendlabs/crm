import { SignUpForm } from "@/components/auth/signup-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { externalAppAuthRouter } from "@/lib/auth-routers";

export const metadata: Metadata = {
  title: "Sign Up | Asend",
};

const SignUpPage = async () => {
  await externalAppAuthRouter();
  return (
    <main className="grid h-screen items-center">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to get started!
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
