import { LogoutButton } from "@/components/auth/logout-button";
import React from "react";
import { toast } from "sonner";

function OnboardingPage() {
  return (
    <div>
      <h1>Onboarding</h1>
      <LogoutButton />
    </div>
  );
}

export default OnboardingPage;
