import type { Metadata } from "next";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding | Asend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) {
    return redirect("/auth");
  } else if (!user?.onboardingCompleted) {
    return <>{children}</>;
  } else if (user.onboardingCompleted) {
    return redirect("/inbox");
  } else {
    return <>Loading</>;
  }
}
