import { db, Session, sessionTable, User, userTable } from "@/database";
import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { authCookie, selectedWorkspaceCookie } from "@/constants";
import { env } from "@/env";
import { decryptFromBase64URI } from "./utils";

// Session Token Generation
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

// Magic Link Verification Token Generation
export function generateMagicLinkVerificationToken(): string {
  const bytes = new Uint8Array(22);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

// Create Session
export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };
  await db.insert(sessionTable).values(session);
  return session;
}

// Session Validation Result Type
export type SessionValidationResult = {
  session: Session | null;
  user: User | null;
};

export const getAuth = async (): Promise<{
  session: Session | null;
  user: User | null;
}> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(authCookie)?.value ?? null;

  if (!sessionToken) {
    return { session: null, user: null };
  }

  // Hash the session token before validating
  const hashedToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken)),
  );

  const result = await validateSessionToken(hashedToken);
  return { session: result.session, user: result.user };
};

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionTableResult = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.id, token),
  });

  if (!sessionTableResult) {
    return { session: null, user: null };
  }
  const userTableResult = await db.query.userTable.findFirst({
    where: eq(userTable.id, sessionTableResult.userId),
  });

  if (!userTableResult) {
    return { session: null, user: null };
  }

  const result = {
    session: sessionTableResult,
    user: userTableResult,
  };

  const { session, user } = result;

  // Handle session expiration
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  return { session, user };
}

// Invalidate Session
export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function getSelectedWorkspaceId(): Promise<string | null> {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get(selectedWorkspaceCookie)?.value ?? null;
  if (!workspaceId) {
    return null;
  }
  return decryptFromBase64URI(workspaceId);
}
