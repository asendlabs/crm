"use server";

import { and, eq } from "drizzle-orm";
import {
  userTable,
  workspaceMemberTable,
  workspaceTable,
} from "@/database/schema";

import { cookies } from "next/headers";
import { db } from "@/database";
import { getUser } from "./user.action";
import { onboardingSchema } from "@/validation/onboarding.schema";
import { ulid } from "ulid";
import { z } from "zod";

export const createWorkspace = async (
  data: z.infer<typeof onboardingSchema>,
) => {
  try {
    const user = await getUser();
    const workspace = await db
      .insert(workspaceTable)
      .values({
        id: ulid(),
        name: data.workspaceName,
        primaryOwnerUserId: user!.id,
        personalAccount: true,
        createdByUserId: user!.id,
        updatedByUserId: user!.id,
      })
      .returning();

    if (!workspace) {
      return {
        success: false,
        message: "Internal Server Error when creating workspace",
      };
    }

    const workspaceMember = await db.insert(workspaceMemberTable).values({
      userId: user!.id,
      workspaceId: workspace[0].id,
      role: "owner",
    });

    // set wid
    cookies().set({
      name: "wid",
      value: workspace[0].id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return { success: true, message: "Workspace created successfully" };
  } catch (error) {
    return { success: false, message: "Internal Server Error" };
  }
};

export const setOnboardingCompleted = async (workspaceId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: "Internal Server Error when setting onboarding completed",
      };
    }

    await db
      .update(userTable)
      .set({ onboardingCompleted: true })
      .where(eq(userTable.id, user.id));

    return { success: true, message: "Onboarding completed successfully" };
  } catch (error) {
    return { success: false, message: "Internal Server Error" };
  }
};

export const getActiveWorkspace = async () => {
  try {
    const workspaceCookie = cookies().get("wid");
    if (
      !workspaceCookie ||
      !workspaceCookie.value ||
      workspaceCookie.value === "not_found"
    ) {
      return { success: false, message: "No workspace found" };
    }
    const user = await getUser();
    if (!user) {
      return { success: false, message: "Not logged in" };
    }
    const workspaceMember = await db.query.workspaceMemberTable.findFirst({
      where: and(
        eq(workspaceMemberTable.userId, user.id),
        eq(workspaceMemberTable.workspaceId, workspaceCookie.value),
      ),
    });

    if (!workspaceMember) {
      return { success: false, message: "Invalid" };
    }

    const workspace = await db.query.workspaceTable.findFirst({
      where: eq(workspaceTable.id, workspaceMember.workspaceId!),
    });

    if (!workspace) {
      return { success: false, message: "Workspace not found" };
    }

    return { success: true, data: workspace };
  } catch (error) {
    return { success: false, message: "Internal Server Error" };
  }
};
