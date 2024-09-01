// layout.tsx
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { fetchLogggedInUser } from "@/server/auth";
import { svFetchAllUserWorkspaces } from "@/server/workspace";
import { cookies } from "next/headers";
import { Loader2 } from "lucide-react";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchLogggedInUser();
  const workspaces = await svFetchAllUserWorkspaces();
  const cookieSelectedWorkspaceId =
    cookies().get("selected_workspace")?.value || "";
  const allChecksComplete =
    user && workspaces.data.length > 0 && user.onboardingCompletedAt;
  return (
    <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      {allChecksComplete ? (
        <>
          <Sidebar
            user={user}
            workspaces={workspaces.data}
            cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
          />
          <div>{children}</div>
        </>
      ) : (
        <div>{children}</div>
      )}
    </main>
  );
}
