import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";
import { DemoCheckoutButton } from "./_components/DemoCheckoutButton";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const PADDLE_DOMAIN_APPROVED = false;
  if (PADDLE_DOMAIN_APPROVED) {
    const {user} = await getAuth();
    if (!user) return redirect("/signup?redirecterror=nouser");
    if (user && user.verifiedAt && user.onboardedAt && user.checkoutAt) {
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
