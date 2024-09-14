import { LoginForm } from "@/components/forms/LoginForm";
import { loginAction } from "@/server/login";
import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/utils/frequent-urls";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const user = await fetchAuthenticatedUser();
  const dbUser = await getUserById(user?.id || "");
  if (dbUser && dbUser.verifiedAt && dbUser.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return <LoginForm login={loginAction} />;
}
