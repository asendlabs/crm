// layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import {
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/constants";
import { validateRequest } from "@/lib/lucia";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { Profile } from "@database/types";

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

const userProfileWorkspace: UserWithWorkspaceAndProfile = {
  ...dbUser,
  profile: dbUser.profile as Profile,
  workspaces: workspaces,
}

  return (
    // <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
    //   <Sidebar
    //     user={dbUser}
    //     workspaces={workspaces}
    //     cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
    //   />
    //   <div>{children}</div>
    // </main>
    <SidebarProvider>
      <AppSidebar user={userProfileWorkspace} cookieselectedworkspaceid={cookieSelectedWorkspaceId} />
      <main className="grid min-h-screen w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
