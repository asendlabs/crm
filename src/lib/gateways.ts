import { fetchLogggedInUser } from "@/server/auth";
import { redirect } from "next/navigation";

const internalApp = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (!user) {
    return redirect("/login");
  }
  if (!user.verifiedAt) {
    return redirect("/verify-email");
  }
  if (!user.onboardingCompletedAt) {
    switch (user.onboardingStep) {
      case "not_started":
        return redirect("/onboarding/create-profile");
      case "profile_created":
        return redirect("/onboarding/create-workspace");
      case "workspace_created":
        return redirect("/onboarding/complete");
      case "completed":
        return redirect("/home");
      default:
        console.error(
          "Unknown onboarding step:",
          user.onboardingStep.toString(),
        );
        return;
    }
  }
};

const externalApp = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (user?.verifiedAt && user.onboardingCompletedAt) {
    return redirect("/home");
  }
};

export const authGateways = {
  internalApp,
  externalApp,
};
