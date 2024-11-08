import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ViewTransitions } from "next-view-transitions";
import React from "react";
import { AppPostHogProvider } from "@/providers/services/posthogProvider";

export const metadata: Metadata = {
  title: {
    default: `Asend${process.env.NODE_ENV === "development" ? " | DEV" : ""}`,
    template: `%s | Asend${process.env.NODE_ENV === "development" ? " | DEV" : ""}`,
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
        <AppPostHogProvider>
          <body className={GeistSans.className}>
            {children}
            <Toaster position="bottom-right" richColors />
          </body>
        </AppPostHogProvider>
      </html>
    </ViewTransitions>
  );
}