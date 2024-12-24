import { SignInForm } from "./_components/SignInForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage() {
  const {user} = await getAuth();
  if (user && user.verifiedAt && user.checkoutAt && user.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return <SignInForm />;
}
