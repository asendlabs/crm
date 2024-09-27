import { Metadata } from "next";
import React from "react";
import { VerifyEmailForm } from "@/components/forms/VerifyEmailForm";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { onboardingAction } from "@/server/onboarding";
import { redirect } from "next/navigation";
import { authenticatedUrl, unauthenticatedUrl } from "@/urls";
import { OnboardingForm } from "@/components/forms/OnboardingForm";

export const metadata: Metadata = {
  title: "Onboarding",
};

const OnboardingPage = async () => {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(user.id);
  if (dbUser?.verifiedAt && dbUser?.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return <OnboardingForm action={onboardingAction} />;
};

export default OnboardingPage;
