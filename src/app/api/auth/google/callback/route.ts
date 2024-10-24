import { googleCodeVerifierCookie, googleStateCookie } from "@/constants";
import {
  createIdentity,
  createProfile,
  createUserWithoutPassword,
  getIdentityByUserId,
  getUserByEmail,
  updateUser,
} from "@/data-access/users";
import { googleOAuthClient, lucia, validateRequest } from "@/lib/lucia";
import { createSessionForUser } from "@/lib/session";
import { afterSignUpUrl } from "@/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

type GoogleUserInfo = {
  familyName: string;
  name: string;
  picture: string;
  email: string;
  givenName: string;
  id: string;
  verifiedEmail: boolean;
};

// http://localhost:3000/api/auth/google/callback
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("no code or state");
    return new Response("Invalid Request", { status: 400 });
  }

  const codeVerifier = (await cookies()).get(googleCodeVerifierCookie)?.value;
  const savedState = (await cookies()).get(googleStateCookie)?.value;

  if (!codeVerifier || !savedState) {
    console.error("no code verifier or state");
    return new Response("Invalid Request", { status: 400 });
  }

  if (state !== savedState) {
    console.error("state mismatch");
    return new Response("Invalid Request", { status: 400 });
  }

  const { accessToken } = await googleOAuthClient.validateAuthorizationCode(
    code,
    codeVerifier,
  );
  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!googleResponse) return new Response("Invalid Request", { status: 400 });
  const {
    id: googleId,
    email: googleEmail,
    familyName: googleLastName,
    givenName: googleFirstName,
    picture: googleAvatar,
  } = (await googleResponse.json()) as GoogleUserInfo;

  (await cookies()).delete(googleCodeVerifierCookie);
  (await cookies()).delete(googleStateCookie);
}
