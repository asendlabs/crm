import EmailForm from "../../components/EmailForm";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import Link from "next/link";
import React from "react";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  const user = await getUser();
  if (user) {
    redirect("/home");
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <section className="mb-8 font-semibold text-[1.375rem]">
        <h1 className="">Welcome to Ascend</h1>
        <h1 className="text-gray-400">Login or Create your Account</h1>
      </section>
      <section className="mb-6">
        <GoogleOAuthButton />
      </section>
      <section className="w-full max-w-md mb-8">
        <EmailForm />
      </section>
      <section className="max-w-[21rem]">
        <p className="text-center text-xs text-gray-400">
          By Clicking 'Continue with Google' or 'Continue with Email', you agree
          to our{" "}
          <Link
            href="/docs/terms-of-service"
            className="text-gray-800 underline cursor-pointer"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/docs/privacy-policy"
            className="text-gray-800 underline cursor-pointer"
          >
            Privacy Policy
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AuthPage;
