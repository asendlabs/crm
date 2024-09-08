import { SignUpForm } from "@/components/forms/SignUpForm";
import { signUpAction } from "./actions";
import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/app-config";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function LoginPage() {
  const user = await fetchAuthenticatedUser();
  const dbUser = await getUserById(user?.id || "");
  if (dbUser && dbUser.verifiedAt && dbUser.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return <SignUpForm signUp={signUpAction} />;
}
