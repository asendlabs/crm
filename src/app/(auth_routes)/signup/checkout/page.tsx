import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";
import { DemoCheckoutButton } from "./_components/DemoCheckoutButton";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const PADDLE_DOMAIN_APPROVED = false;
  if (PADDLE_DOMAIN_APPROVED) {
    const user = await fetchAuthenticatedUser();
    if (!user) return redirect("/signup?redirecterror=nouser");
    const dbUser = await getUserById(user.id || "");
    if (
      dbUser &&
      dbUser.verifiedAt &&
      dbUser.onboardedAt &&
      dbUser.checkoutAt
    ) {
      return redirect(authenticatedUrl);
    }
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      Checkout Page here.... (Embedded checkout from paddle)
      <DemoCheckoutButton />
    </main>
  );
}
