import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { generateEmailVerifyCode } from "@/utils/generators";
import { db } from "@database";
import { userSessionTable, userTable } from "@database/models";

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
    })
    .where(eq(userTable.id, id))
    .returning();

  return user;
};
