import React from "react";
import Sidebar from "@/components/crm/sidebar";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";

export default async function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) {
    return redirect("/auth");
  } else if (!user?.onboardingCompleted) {
    return redirect("/onboarding");
  } else if (user.onboardingCompleted) {
    return (
      <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
        <Sidebar user={user} />
        <div>{children}</div>
      </main>
    );
  } else {
    return <>Loading</>;
  }
}
