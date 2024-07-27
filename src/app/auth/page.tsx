import EmailForm from "../../components/EmailForm";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import React from "react";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  const user = await getUser();
  if (user) {
    redirect("/home");
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold">Experience Ascend</h1>
        <h1 className="text-2xl font-semibold text-gray-400">Login or Create your Account</h1>
      </section>
      <section className="mb-4">
        <GoogleOAuthButton />
      </section>
      <section className="w-full max-w-md">
        <EmailForm />
      </section>
    </main>
  );
};

export default AuthPage;
