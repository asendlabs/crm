import "./globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import UserButton from "@/components/global/UserButton";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export const metadata: Metadata = {
  title: "Ascend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await useUser();
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
      <body>{children}</body>
      <Toaster richColors />
    </html>
  );
}
