import { LoginForm } from "@/components/forms/LoginForm";
import { buttonVariants } from "@/components/ui/button";
import { authGateways } from "@/lib/gateways";
import { cn } from "@/utils/tailwind";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Login | Asend",
};

const LoginPage = async () => {
  await authGateways.accessLayerApp("login");
  return (
    <main className="grid h-screen items-center">
      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Sign Up
      </Link>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to Asend
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to login
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
