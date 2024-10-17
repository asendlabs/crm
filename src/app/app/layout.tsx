// layout.tsx
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { afterSignUpUrl, afterVerifyUrl, unauthenticatedUrl } from "@/urls";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/config";
import { validateRequest } from "@/lib/lucia";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const validator = await validateRequest();
  if (!validator.user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(validator.user.id);
  if (!dbUser) {
    return redirect(unauthenticatedUrl);
  }
  if (!dbUser.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!dbUser.onboardedAt) {
    return redirect(afterVerifyUrl);
  }

  const workspaces = await getAllUserWorkspaces(dbUser.id);

  const cookieSelectedWorkspaceId =
    cookies().get(selectedWorkspaceCookie)?.value || "";

  return (
    <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      <Sidebar
        user={dbUser}
        workspaces={workspaces}
        cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
      />
      <div>{children}</div>
    </main>
  );
}
