import { Sidebar } from "@/components/internal/Sidebar";
import UserButton from "@/components/global/UserButton";
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

  return (
    <div className="flex flex-row min-h-screen max-w-screen">
      <div className="absolute top-5 right-4"><UserButton /></div>
      <div className="absolute w-[12.5vw] right-[87.5vw]">
        <Sidebar />
      </div>  
      <div className="absolute left-[12.5vw] w-[86vw] h-screen">{children}</div>
    </div>
  );
}
