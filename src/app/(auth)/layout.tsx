import {getUser} from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await getUser();
    if (user) {
      redirect ("/dashboard");
      return;
    }
  return <div>{children}</div>;
}
