import OnboardingForm from "@/components/onboarding/onboarding-form";
import React from "react";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";
import { workspaceMemberTable } from "@/database/schema";

async function OnboardingPage() {
  const user = await getUser();
  const workspaceMember = await db.query.workspaceMemberTable.findMany({
    where: eq(workspaceMemberTable.userId, user?.id || ""),
  });
  if (!user?.metadata?.creationComplete || workspaceMember.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <OnboardingForm />
      </div>
    );
  } else {
    return <></>;
  }
}

export default OnboardingPage;
