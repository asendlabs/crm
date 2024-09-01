import { fetchLogggedInUser } from "@/server/auth";
import { User } from "@database/types";
import { redirect } from "next/navigation";

const handleOnboardingRedirect = (user: User, currentPage: string) => {
  if (!user.onboardingCompletedAt) {
    switch (user.onboardingStep) {
      case "not_started":
        return redirect("/onboarding/create-profile");
      case "profile_created":
        return redirect("/onboarding/create-workspace");
      case "workspace_created":
        return redirect("/onboarding/complete");
      case "completed":
        if (currentPage !== "home") {
          return redirect("/home");
        }
        return;
      default:
        console.error(
          "Unknown onboarding step:",
          user.onboardingStep.toString(),
        );
        return;
    }
  }
  // All checks passed
  return redirect("/home");
};

const handleEmailVerifiedRedirect = (user: User, currentPage: string) => {
  if (user.verifiedAt && currentPage !== "home") {
    return redirect("/home");
  }
};
const internalApp = async (page: string) => {
  "use server";
  const user = await fetchLogggedInUser();
  if (!user) return redirect("/login");
  handleEmailVerifiedRedirect(user, page);
  handleOnboardingRedirect(user, page);
};

// External app authentication logic
const externalApp = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (user?.verifiedAt && user.onboardingCompletedAt) {
    return redirect("/home");
  }
  // No redirection needed if user is not verified or onboarding is not completed
};

// Access layer authentication logic
const accessLayerApp = async (
  page:
    | "signup"
    | "login"
    | "verify-email"
    | "create-workspace"
    | "create-profile",
) => {
  "use server";
  const user = await fetchLogggedInUser();
  if (!user) {
    if (["signup", "login", "verify-email"].includes(page)) {
      return;
    }
    return redirect("/signup");
  }

  if (!user.verifiedAt) {
    if (["signup", "login", "verify-email"].includes(page)) {
      return;
    }
    return redirect("/verify-email");
  }

  switch (page) {
    case "signup":
    case "login":
      return redirect("/home");
    case "verify-email":
      return redirect("/home");
    case "create-profile":
      if (!user.onboardingCompletedAt) {
        if (user.onboardingStep === "profile_created") {
          return redirect("/onboarding/create-workspace");
        } else if (
          ["workspace_created", "completed"].includes(user.onboardingStep)
        ) {
          return redirect("/onboarding/complete");
        }
      }
      return;

    case "create-workspace":
      if (!user.onboardingCompletedAt) {
        if (user.onboardingStep === "not_started") {
          return redirect("/onboarding/create-profile");
        } else if (
          ["workspace_created", "completed"].includes(user.onboardingStep)
        ) {
          return redirect("/onboarding/complete");
        }
      }
      return;

    default:
      console.error("Unknown page:", page);
      return;
  }
};

// Export all authentication gateways
export const authGateways = {
  internalApp,
  externalApp,
  accessLayerApp,
};
