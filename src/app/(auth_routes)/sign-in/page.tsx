import { SignInForm } from "./_components/SignInForm";
import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage() {
  const user = await fetchAuthenticatedUser();
  const dbUser = await getUserById(user?.id || "");
  if (dbUser && dbUser.verifiedAt && dbUser.checkoutAt) {
    return redirect(authenticatedUrl);
  }
  return <SignInForm />;
}
