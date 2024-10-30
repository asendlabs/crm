// app/providers.js
"use client";

import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

let AppPostHogProvider: React.FC<{ children: React.ReactNode }>;

if (env.NEXT_PUBLIC_POSTHOG_KEY) {
  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      secure_cookie: process.env.NODE_ENV === "production",
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
  }

  function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }

  AppPostHogProvider = CSPostHogProvider;
} else {
  function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  AppPostHogProvider = CSPostHogProvider;
}

export default AppPostHogProvider;
