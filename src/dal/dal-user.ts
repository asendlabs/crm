import { User, userSessionTable } from "@/database/schema/auth";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { userTable } from "@/database/schema";
import { ulid } from "ulid";
import { generateIdFromEntropySize } from "lucia";

function generateCode(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export const daGetUserById = async (id: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });

  return user;
};

export const daDeleteUser = async (id: string) => {
  const sessions = await db
    .delete(userSessionTable)
    .where(eq(userSessionTable.userId, id));
  const user = await db.delete(userTable).where(eq(userTable.id, id));

  return user;
};

export const daGetUserByEmail = async (email: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  return user;
};

export const daCreateUser = async (email: string, password?: string) => {
  const user = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      encryptedPassword: (password && password) || null,
      verificationCode: generateCode(),
      verificationCodeCreatedAt: new Date(),
    })
    .returning();
  return user;
};

export const daCreateVerificationCode = async (userId: string) => {
  const user = await db
    .update(userTable)
    .set({
      verificationCodeCreatedAt: new Date(),
      verificationCode: generateCode(),
    })
    .where(eq(userTable.id, userId))
    .returning();

  return user;
};

export const daSetUserVerified = async (id: string) => {
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
