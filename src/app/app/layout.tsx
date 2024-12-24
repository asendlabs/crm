// layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfileByUserId } from "@/data-access/users";
import {
  afterCheckoutUrl,
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/constants";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { CommandPaletteProvider } from "@/providers/command-provider";
import { CommandPalette } from "@/components/command-palette";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";
import { Shortcuts } from "@/components/shortcuts";
import { getAuth } from "@/lib/auth";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  console.log(user);
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  if (!user.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!user.checkoutAt) {
    return redirect(afterVerifyUrl);
  }
  if (!user.onboardedAt) {
    return redirect(afterCheckoutUrl);
  }

  const workspaces = await getAllUserWorkspaces(user.id);

  const cookieSelectedWorkspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return redirect(afterCheckoutUrl);
  }

  const userProfileWorkspace: UserWithWorkspaceAndProfile = {
    ...user,
    profile: profile,
    workspaces: workspaces,
  };

  const workspaceAccounts = await getAllWorkspaceAccounts(
    cookieSelectedWorkspaceId,
  );

  return (
    <CommandPaletteProvider>
      <CommandPalette accounts={workspaceAccounts} />
      <Shortcuts />
      <SidebarProvider>
        <AppSidebar
          user={userProfileWorkspace}
          cookieselectedworkspaceid={cookieSelectedWorkspaceId}
        />
        <main className="grid min-h-screen w-full">{children}</main>
      </SidebarProvider>
    </CommandPaletteProvider>
  );
}
