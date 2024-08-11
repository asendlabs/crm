import OnboardingForm from "@/components/onboarding/onboarding-form";
import React from "react";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";
import { workspaceMemberTable } from "@/database/schema";

async function OnboardingPage() {
  const user = await getUser();
  if (!user) {
    return redirect("/auth");
  } else {
    return <OnboardingForm />;
  }
}

export default OnboardingPage;
