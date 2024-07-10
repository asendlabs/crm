import { Sidebar } from "@/components/internal/Sidebar";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const username = user?.name.toString() || '';
  if (!user) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-row min-h-screen max-w-screen">
      <div>
        <Sidebar username={username} />
      </div>
      <div>{children}</div>
    </div>
  );
}
