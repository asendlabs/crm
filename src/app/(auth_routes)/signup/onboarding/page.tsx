import { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { authenticatedUrl, unauthenticatedUrl } from "@/constants";
import { OnboardingForm } from "./_components/OnboardingForm";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Onboarding",
};

const OnboardingPage = async () => {
  const { user } = await getAuth();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  if (
    (user?.verifiedAt && user?.onboardedAt) ||
    (user?.checkoutAt && user?.verifiedAt && user?.onboardedAt)
  ) {
    return redirect(authenticatedUrl);
  }
  return <OnboardingForm />;
};

export default OnboardingPage;
