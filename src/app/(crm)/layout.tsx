import React from "react";
import Sidebar from "@/components/crm/sidebar";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";
import { workspaceMemberTable } from "@/database/schema";

export default async function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const workspaceMember = await db.query.workspaceMemberTable.findMany({
    where: eq(workspaceMemberTable.userId, user?.id || ""),
  });
  if (!user) {
    return redirect("/auth");
  } else {
    if (!user.metadata?.creationComplete || workspaceMember.length === 0) {
        return redirect("/onboarding");
    } else {
      return (
        <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
          <Sidebar user={user} />
          <div>{children}</div>
        </main>
      );
    }
  }
}
