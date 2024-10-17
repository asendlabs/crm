import "server-only";
import { db } from "@database";
import { userTable } from "@database/tables";
import { compare, genSalt, hash } from "bcryptjs";
import { User } from "@database/types";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { generateEmailVerifyCode } from "@/utils";
import { identityTable, profileTable } from "@database/schema/users";

export async function getUserByEmail(email: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
    with: { profile: true },
  });
  return user;
}

export async function getUserById(id: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
    with: { profile: true, workspaceUserTable: true },
  });
  return user;
}

export async function createUser(email: string, plainPassword: string) {
  const encryptedPassword = await hash(plainPassword, await genSalt(12));
  const [user] = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      encryptedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationCode: generateEmailVerifyCode(),
      verificationCodeSentAt: new Date(),
    })
    .returning();
  return user;
}

export async function createUserWithoutPassword(email: string) {
  const [user] = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      verifiedAt: new Date(),
    })
    .returning();
  return user;
}

export async function recreateUser(email: string, newPlainPassword: string) {
  const updates: Partial<User> = {
    updatedAt: new Date(),
    verificationCode: generateEmailVerifyCode(),
    verificationCodeSentAt: new Date(),
    encryptedPassword: await hash(newPlainPassword, await genSalt(12)),
  };
  const [updated] = await db
    .update(userTable)
    .set(updates)
    .where(eq(userTable.email, email))
    .returning();
  return updated;
}

export async function checkUserPassword(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user || !user.encryptedPassword) {
    return false;
  }

  const isPasswordCorrect = await compare(password, user.encryptedPassword!);
  if (!isPasswordCorrect) {
    return false;
  }
  return user;
}

export async function resendVerificationCode(id: string) {
  const user = await getUserById(id);
  if (!user) {
    return false;
  }
  const code = generateEmailVerifyCode();
  const response = await updateUser(id, {
    updatedAt: new Date(),
    verificationCode: code,
    verificationCodeSentAt: new Date(),
  });
  if (!response) {
    return false;
  }
  return true;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const [updated] = await db
    .update(userTable)
    .set(updates)
    .where(eq(userTable.id, userId))
    .returning();
  return updated;
}

export async function deleteUser(userId: string) {
  const deleted = await db.delete(userTable).where(eq(userTable.id, userId));
  return deleted;
}

export async function createProfile({
  userId,
  marketingConsent,
  firstName,
  lastName,
}: {
  userId: string;
  marketingConsent: boolean;
  firstName?: string;
  lastName?: string;
}) {
  const [created] = await db
    .insert(profileTable)
    .values({
      id: ulid(),
      userId,
      firstName,
      lastName,
      marketingConsent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function getIdentityByUserId(userId: string) {
  const identity = await db.query.identityTable.findFirst({
    where: eq(identityTable.userId, userId),
  });
  return identity;
}

export async function createIdentity({
  userId,
  provider,
  providerUserId,
}: {
  userId: string;
  provider: "google" | "microsoft" | "apple";
  providerUserId: string;
}) {
  const [created] = await db
    .insert(identityTable)
    .values({
      id: ulid(),
      userId,
      provider,
      providerUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}
