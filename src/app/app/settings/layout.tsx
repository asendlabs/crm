// layout.tsx
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import {
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { validateRequest } from "@/lib/lucia";
import { SidebarItem } from "./_components/settings-sidebar-link";
import { PageTitle } from "@/components/page-title";

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

  return (
    <section className="flex h-screen min-h-screen w-full flex-col items-start p-5">
      <div className="flex flex-col gap-2">
        <PageTitle>settings</PageTitle>
        {/* <p className="text-sm">
          hey {dbUser.profile?.firstName}, here you can personalize and manage
          your entire asend experience.
        </p> */}
      </div>
      <section className="grid h-full w-full grid-cols-[225px_1fr] gap-3 pt-4">
        <section className="flex h-full flex-col gap-0.5">
          <SidebarItem label="Account" />
          <SidebarItem label="Workspace" />
          <SidebarItem label="Billing" />
          <SidebarItem label="Appearance" />
        </section>
        {children}
      </section>
    </section>
  );
}
