import { LoginForm } from "@/components/auth/login-form";
import { getLoggedInUser } from "@/server/user.server";
import { redirect } from "next/navigation";
import React from "react";

const LoginPage = async () => {
  const user = await getLoggedInUser();
  if (user && user.isVerified) return redirect("/inbox");
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
