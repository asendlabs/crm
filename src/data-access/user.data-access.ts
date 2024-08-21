import { User, userSessionTable } from "@/database/schema/user";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { userTable } from "@/database/schema";
import { ulid } from "ulid";
import { generateIdFromEntropySize } from "lucia";

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
      hashedPassword: (password && password) || null,
      verificationToken: generateIdFromEntropySize(20),
    })
    .returning();
  return user;
};

export const daUpdateVerificationToken = async (id: string) => {
  const user = await db
    .update(userTable)
    .set({
      verificationToken: generateIdFromEntropySize(20),
    })
    .where(eq(userTable.id, id))
    .returning();

  return user;
};

export const daUpdateVerificationStatus = async (id: string) => {
  const user = await db
    .update(userTable)
    .set({
      isVerified: true,
      verificationToken: null,
    })
    .where(eq(userTable.id, id))
    .returning();

  return user;
};
