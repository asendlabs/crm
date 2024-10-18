"use server";
import { createServerAction } from "zsa";
import { redirect } from "next/navigation";
import { authenticatedAction } from "@/lib/zsa";
import { createProfile, getUserById, updateUser } from "@/data-access/users";
import { onboardingSchema } from "@/schemas/onboarding.schema";
import { createWorkspace, createWorkspaceUser } from "@/data-access/workspaces";
import { authenticatedUrl } from "@/constants";

export const onboardingAction = authenticatedAction
  .createServerAction()
  .input(onboardingSchema)
  .handler(async ({ input, ctx }) => {
    const { firstName, lastName, marketingConsent, workspaceName } = input;
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new Error("You need to be logged in to access this content");
    }
    const profileCreated = await createProfile({
      userId: user.id,
      firstName,
      lastName,
      marketingConsent,
    });
    if (!profileCreated) {
      throw new Error("Failed to create profile");
    }
    const workspaceCreated = await createWorkspace(workspaceName, user.id);
    if (!workspaceCreated) {
      throw new Error("Failed to create workspace");
    }
    const workspaceUserCreated = await createWorkspaceUser(
      workspaceCreated.id,
      user.id,
      "primaryOwner",
    );
    if (!workspaceUserCreated) {
      throw new Error("Failed to create workspace user");
    }
    const setOnboarded = await updateUser(user.id, {
      onboardedAt: new Date(),
      updatedAt: new Date(),
    });
    if (!setOnboarded) {
      throw new Error("Failed to update user onboard status");
    }
    return redirect(authenticatedUrl);
  });
