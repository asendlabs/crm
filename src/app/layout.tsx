import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
  title: {
    default: "Asend",
    template: "%s | Asend",
  },
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={GeistSans.className}>
          {children}
          <Toaster position="bottom-right" richColors />
          <Analytics />

          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}
