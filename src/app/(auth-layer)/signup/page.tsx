import { SignUpForm } from "@/components/auth/signup-form";
import { getLoggedInUser } from "@/server/user.server";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const user = await getLoggedInUser();
  if (user && user.isVerified) return redirect("/inbox");
  else {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <SignUpForm />
      </div>
    );
  }
};

export default SignUpPage;
