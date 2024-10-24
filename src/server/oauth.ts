"use server";
import { createServerAction } from "zsa";
import { googleOAuthClient } from "@/lib/lucia";
import { googleCodeVerifierCookie, googleStateCookie } from "@/constants";
import { cookies } from "next/headers";
import { unauthenticatedAction } from "@/lib/zsa";
import { generateCodeVerifier, generateState } from "arctic";
import { z } from "zod";

export const getGoogleOauthConsentUrlAction = unauthenticatedAction
  .createServerAction()
  .output(z.object({ success: z.boolean(), url: z.string() }))
  .handler(async () => {
    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();

      (await cookies()).set(googleCodeVerifierCookie, codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      (await cookies()).set(googleStateCookie, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      const authUrl = await googleOAuthClient.createAuthorizationURL(
        state,
        codeVerifier,
        {
          scopes: ["email", "profile", ""],
        },
      );
      return { success: true, url: authUrl.toString() };
    } catch (error) {
      return { success: false, url: "" };
    }
  });
