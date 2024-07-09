import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function ConditionalAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return <div>{children}</div>;
}
