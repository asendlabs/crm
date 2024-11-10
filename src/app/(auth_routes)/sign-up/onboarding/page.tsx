import { Metadata } from "next";
import React from "react";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authenticatedUrl, unauthenticatedUrl } from "@/constants";
import { OnboardingForm } from "./_components/OnboardingForm";

export const metadata: Metadata = {
  title: "Onboarding",
};

const OnboardingPage = async () => {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(user.id);
  if (
    (dbUser?.verifiedAt && dbUser?.onboardedAt) ||
    (dbUser?.checkoutAt && dbUser?.verifiedAt && dbUser?.onboardedAt)
  ) {
    return redirect(authenticatedUrl);
  }
  return <OnboardingForm />;
};

export default OnboardingPage;
