import "./globals.css";

import { GeistSans } from "geist/font/sans";
// import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ascend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
      <Toaster richColors />
    </html>
  );
}
