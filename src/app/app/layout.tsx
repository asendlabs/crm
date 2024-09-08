// layout.tsx
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import {
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/app-config";
import { getAllUserWorkspaces } from "@/data-access/workspaces";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return redirect(unauthenticatedUrl);
  }
  if (!dbUser.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!dbUser.onboardedAt) {
    return redirect(afterVerifyUrl);
  }

  const workspaces = await getAllUserWorkspaces(user.id);

  const cookieSelectedWorkspaceId =
    cookies().get("selected_workspace")?.value || "";

  return (
    <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      <Sidebar
        user={dbUser}
        workspaces={workspaces}
        cookieSelectedWorkspaceId={"waris"}
      />
      <div>{children}</div>
    </main>
  );
}
