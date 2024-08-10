import type { Metadata } from "next";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";
import { workspaceTable } from "@/database/schema";

export const metadata: Metadata = {
  title: "Onboarding | Asend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const workspace = await db.query.workspaceTable.findFirst({
    where: eq(workspaceTable.primaryOwnerUserId, user?.id || ""),
  });
  if (!user) {
    return redirect("/auth");
  } else if (
    !user?.metadata?.creationComplete ||
    !workspace?.metadata?.creationComplete
  ) {
    return <>{children}</>;
  } else if (user.metadata?.creationComplete) {
    return redirect("/inbox");
  } else {
    return <>Loading</>;
  }
}
