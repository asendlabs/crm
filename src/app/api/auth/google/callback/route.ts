import { googleOAuthClient, lucia } from "@/lib/auth";

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { redirect } from "next/navigation";
import { userTable } from "@/db/schema";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return redirect("/auth");
  }

  const cookieStore = cookies();
  const codeVerifier = cookieStore.get("codeVerifier")?.value;
  const savedState = cookieStore.get("state")?.value;

  if (!codeVerifier || !savedState) {
    return redirect("/auth");
  }

  if (state !== savedState) {
    return redirect("/auth");
  }

  const validationResponse = await googleOAuthClient.validateAuthorizationCode(
    code,
    codeVerifier,
  );

  const { accessToken } = validationResponse;

  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!googleResponse.ok) {
    throw new Error("Failed to fetch user data from Google");
  }

  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
  };

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, googleData.email),
  });

  if (!user) {
    const newUser = await db
      .insert(userTable)
      .values({
        id: generateId(21).toString().toLowerCase(),
        email: googleData.email,
        isOAuth: true,
        googleOAuthId: googleData.id,
      })
      .returning();

    if (!newUser.length) {
      throw new Response("Failed to create user", { status: 400 });
    }

    const userId = newUser[0].id;
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    cookieStore.set("state", "", { expires: new Date(0) });
    cookieStore.set("codeVerifier", "", { expires: new Date(0) });

    return redirect("/inbox");
  }

  user.isOAuth = true;
  user.googleOAuthId = googleData.id;

  const updateQuery = await db
    .update(userTable)
    .set(user)
    .where(eq(userTable.id, user.id));

  if (!updateQuery) {
    return new Response("Failed to update user", { status: 400 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  cookieStore.set("state", "", { expires: new Date(0) });
  cookieStore.set("codeVerifier", "", { expires: new Date(0) });
  return redirect("/inbox");
}
