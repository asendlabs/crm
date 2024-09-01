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
  let isAuth = false;
  await authGateways.internalApp().then(() => {
    isAuth = true;
  });
  if (isAuth) {
    return (
      <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
        <Sidebar user={user} />
        <div>{children}</div>
      </main>
    );
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-black/50" />
    </main>
  );
}
