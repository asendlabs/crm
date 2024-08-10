import OnboardingForm from "@/components/onboarding/onboarding-form";
import React from "react";

function page() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">Lets get you all ready!</h1>
      <OnboardingForm />
    </main>
  );
}

export default page;
