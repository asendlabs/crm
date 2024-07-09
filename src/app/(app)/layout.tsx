import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }
  return <div>{children}</div>;
}
