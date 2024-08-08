"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { signOut } from "@/server/auth.action";
import { useRouter } from "next/navigation";

function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-24">
      <h1 className="text-2xl font-bold">This is the onboarding page</h1>
      <Button
        onClick={async () => {
          setLoading(true);
          await signOut();
          router.refresh();
        }}
        className="w-60"
        disabled={loading}
      >
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </main>
  );
}

export default OnboardingPage;
