import { workspaceMemberTable, workspaceTable } from "@/database/schema";

import EmailForm from "@/components/authentication/email-form";
import GoogleOAuthButton from "@/components/authentication/google-oauth-button";
import Link from "next/link";
import React from "react";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login or Sign Up",
  description: "Login or Sign Up to Asend",
};

export default async function AuthPage() {
  const user = await getUser();

  if (!user) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <section className="mb-8 text-[1.375rem] font-semibold">
          <h1 className="">Welcome to Asend</h1>
          <h1 className="text-gray-400">Login or Create your Account</h1>
        </section>
        <section className="mb-6">
          <GoogleOAuthButton />
        </section>
        <section className="mb-8 w-full max-w-md">
          <EmailForm />
        </section>
        <section className="max-w-[21rem]">
          <p className="text-center text-xs text-gray-400">
            By Clicking 'Continue with Google' or 'Continue with Email', you
            agree to our{" "}
            <Link
              href="/docs/terms-of-service"
              className="cursor-pointer text-gray-800 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/docs/privacy-policy"
              className="cursor-pointer text-gray-800 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </section>
      </main>
    );
  } else {
    const workspaceMember = await db.query.workspaceMemberTable.findMany({
      where: eq(workspaceMemberTable.userId, user?.id),
    });
    if (!user.metadata?.creationComplete || workspaceMember.length === 0) {
      return redirect("/onboarding");
    } else {
      return redirect("/inbox");
    }
  }
}
