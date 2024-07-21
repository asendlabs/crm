import { Sidebar } from "@/components/internal/Sidebar";
import { getUser } from "@/lib/actions/getUser";
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

  return (
    <div className="flex flex-row    max-w-screen">
      <div className="absolute w-[12.5vw] right-[87.5vw]">
        <Sidebar />
      </div>
      <div className="absolute left-[12.5vw] w-[86vw] h-screen">{children}</div>
    </div>
  );
}
