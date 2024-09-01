"use server";
import { z } from "zod";
import {
  createWorkspace,
  createWorkspaceUser,
  getWorkspaceByWorkspaceId,
  getWorkspacesByUserId,
} from "@/scripts/workspace-scripts";
import { createWorkspaceSchema } from "@/schemas/onboarding.schema";
import { fetchLogggedInUser } from "../auth";
import { setOnboardingCompleted } from "@/scripts/user-scripts";

export const svCreateWorkspace = async (
  data: z.infer<typeof createWorkspaceSchema>,
) => {
  try {
    const user = await fetchLogggedInUser();
    if (!user) {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }
    const { name } = data;
    const primaryOwnerId = user.id;
    const logoUrl = `https://avatar.vercel.sh/rauchg.svg?text=${name.charAt(0)}`; // TODO: add utapi file uplaod and get back logo url
    const workspace = await createWorkspace({
      name,
      primaryOwnerId,
      logoUrl,
    });
    if (!workspace) {
      return {
        success: false,
        message: "Failed to create workspace, Code 0X1",
      };
    }
    const workspaceUser = await createWorkspaceUser({
      workspaceId: workspace.id,
      userId: user.id,
      role: "primary_owner",
    });
    if (!workspaceUser) {
      return {
        success: false,
        message: "Failed to create workspace, Code 0X2",
      };
    }
    const setWorkspaceCreatedResponse = await setOnboardingCompleted(user.id);
    if (!setWorkspaceCreatedResponse) {
      return {
        success: false,
        message: "Failed to create workspace, Code 0X3",
      };
    }
    return {
      success: true,
      message: "Workspace created successfully",
    };
  } catch (error) {
    console.error("Error during workspace creation:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during workspace creation. Please contact support if the issue persists.",
    };
  }
};

export const svFetchAllUserWorkspaces = async () => {
  try {
    const user = await fetchLogggedInUser();
    if (!user) {
      return {
        success: false,
        message: "You don't have access to this page",
        data: [],
      };
    }
    const workspaces = await getWorkspacesByUserId(user.id);
    if (!workspaces) {
      return {
        success: false,
        message: "Failed to fetch workspaces",
        data: [],
      };
    }
    return {
      success: true,
      message: "Fetched workspaces successfully",
      data: workspaces,
    };
  } catch (error) {
    console.error("Error during fetching workspaces:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during fetching workspaces. Please contact support if the issue persists.",
      data: [],
    };
  }
};
