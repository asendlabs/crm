import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ViewTransitions } from "next-view-transitions";
import React from "react";
import { AppPostHogProvider } from "@/providers/third-party/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: {
    default: `Asend${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
    template: `%s | Asend${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
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
          <body className={GeistSans.className + ""}>
            <NuqsAdapter>
              <ThemeProvider
                attribute={"class"}
                defaultTheme="system"
                enableSystem={true}
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </NuqsAdapter>
            <Toaster position="bottom-right" richColors />
          </body>
        </AppPostHogProvider>
      </html>
    </ViewTransitions>
  );
}
