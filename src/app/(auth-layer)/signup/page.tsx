import { SignUpForm } from "@/components/auth/signup-form";
import { SignUpLeftSide } from "@/components/marketing/signup-left-side";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLoggedInUser } from "@/server/user.server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Create an Account | Asend",
};

const SignUpPage = async () => {
  const user = await getLoggedInUser();
  if (user && user.isVerified) return redirect("/inbox");
  return (
    <main className="grid h-screen items-center lg:grid-cols-2">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <SignUpLeftSide />
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link
              href="/docs/legal/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/docs/legal/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
