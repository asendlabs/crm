import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { generateEmailVerifyCode } from "@/utils/generators";
import { db } from "@database";
import { userSessionTable, userTable } from "@database/tables";

export const getUserById = async (id: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });

  return user;
};

export const deleteUser = async (id: string) => {
  const sessions = await db
    .delete(userSessionTable)
    .where(eq(userSessionTable.userId, id));
  const user = await db.delete(userTable).where(eq(userTable.id, id));

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  return user;
};

export const createUser = async (email: string, password?: string) => {
  const user = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      encryptedPassword: (password && password) || null,
      verificationCode: generateEmailVerifyCode(),
      verificationCodeCreatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return user;
};

export const setUserVerified = async (id: string) => {
  const user = await db
    .update(userTable)
    .set({
      verifiedAt: new Date(),
      verificationCode: null,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, id))
    .returning();

  return user;
};

export const createUserProfile = async ({
  userId,
  name,
  avatarUrl,
  marketingConsent,
}: {
  userId: string;
  name: string;
  avatarUrl: string;
  marketingConsent: boolean;
}) => {
  const updatedUser = await db
    .update(userTable)
    .set({
      name,
      avatarUrl,
      marketingConsent,
      updatedAt: new Date(),
      onboardingStep: "profile_created",
    })
    .where(eq(userTable.id, userId));

  return updatedUser;
};
