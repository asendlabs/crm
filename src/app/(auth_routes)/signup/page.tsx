import { SignUpForm } from "./_components/SignUpForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage() {
  const {user} = await getAuth();
  if (user && user.verifiedAt && user.onboardedAt && user.checkoutAt) {
    return redirect(authenticatedUrl);
  }
  return <SignUpForm />;
}
