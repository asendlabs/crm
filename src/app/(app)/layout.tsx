import React from "react";
import Sidebar from "@/components/crm/sidebar";
import { redirect } from "next/navigation";
import { fetchLogggedInUser } from "@/lib/user";
import { internalAppAuthRouter } from "@/lib/auth-routers";
import { Loader2 } from "lucide-react";

export default async function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchLogggedInUser();
  let isAuth = false;
  await internalAppAuthRouter().then(() => {
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
      <Loader2 className="h-10 w-10 text-black/50" />
    </main>
  );
}
