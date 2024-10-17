import { googleCodeVerifierCookie, googleStateCookie } from "@/config";
import {
  createIdentity,
  createProfile,
  createUserWithoutPassword,
  getIdentityByUserId,
  getUserByEmail,
  updateUser,
} from "@/data-access/users";
import { googleOAuthClient } from "@/lib/lucia";
import { createSessionForUser } from "@/lib/session";
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
export async function GET(req: NextRequest, res: Response) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("no code or state");
    return new Response("Invalid Request", { status: 400 });
  }

  const codeVerifier = cookies().get(googleCodeVerifierCookie)?.value;
  const savedState = cookies().get(googleStateCookie)?.value;

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

  cookies().delete(googleCodeVerifierCookie);
  cookies().delete(googleStateCookie);

  const user = await getUserByEmail(googleEmail);
  const identity = user ? await getIdentityByUserId(user.id) : null;

  let userId: string;

  if (!user) {
    // User doesn't exist, create it
    const newUser = await createUserWithoutPassword(googleEmail);
    userId = newUser.id;

    // // Create profile
    // await createProfile({
    //   userId: newUser.id,
    //   firstName: googleFirstName,
    //   lastName: googleLastName,
    //   marketingConsent: true,
    // });

    // Create identity
    await createIdentity({
      userId: newUser.id,
      provider: "google",
      providerUserId: googleId,
    });
  } else if (!identity) {
    // User exists, but no identity, create it
    userId = user.id;
    await createIdentity({
      userId,
      provider: "google",
      providerUserId: googleId,
    });
    if (!user.verifiedAt) {
      await updateUser(userId, {
        verifiedAt: new Date(),
      });
    }
  } else {
    // User exists, and identity exists, do nothing
    userId = user.id;
    if (!user.verifiedAt) {
      await updateUser(userId, {
        verifiedAt: new Date(),
      });
    }
  }

  // Create session
  const session = await createSessionForUser(userId);

  return redirect("/app/home");
}
