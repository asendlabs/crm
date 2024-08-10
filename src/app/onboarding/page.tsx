import OnboardingForm from "@/components/onboarding/onboarding-form";
import React from "react";

function page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <OnboardingForm />
    </div>
  );
}

export default page;
