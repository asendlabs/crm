import React from "react";
import { Sidebar } from "@/components/sidebar";
import { fetchLogggedInUser } from "@/server/auth";
import { Loader2 } from "lucide-react";

import { authGateways } from "@/lib/gateways";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchLogggedInUser();
  return (
    <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      <Sidebar user={user} />
      <div>{children}</div>
    </main>
  );
}
