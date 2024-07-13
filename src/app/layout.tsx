import "./globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import UserButton from "@/components/global/UserButton";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ascend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) {
    return (
      <html lang="en" className={GeistSans.className}>
        <body>{children}</body>
        <Toaster richColors />
      </html>
    );
  }
  return (
    <html lang="en" className={GeistSans.className}>
      <body>

        {children}
      </body>
      <Toaster richColors />
    </html>
  );
}
