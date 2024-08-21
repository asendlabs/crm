import React from "react";
import Sidebar from "@/components/crm/sidebar";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/server/user.server";

export default async function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();
  return (
    <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      <Sidebar user={user} />
      <div>{children}</div>
    </main>
  );
}
