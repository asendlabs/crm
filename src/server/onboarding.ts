"use server";
import { createServerAction } from "zsa";
import { redirect } from "next/navigation";
import { authenticatedAction } from "@/lib/zsa";
import { createProfile, getUserById, updateUser } from "@/data-access/users";
import {
  AuthenticationError,
  SomethingWentWrongError,
} from "@/data-access/_errors";
import { onboardingSchema } from "@/schemas/onboarding.schema";
import { createWorkspace, createWorkspaceUser } from "@/data-access/workspaces";
import { authenticatedUrl } from "@/utils/frequent-urls";

export const onboardingAction = authenticatedAction
  .createServerAction()
  .input(onboardingSchema)
  .handler(async ({ input, ctx }) => {
    const {
      firstName,
      lastName,
      marketingConsent,
      workspaceName,
    } = input;
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new AuthenticationError();
    }
    const profileCreated = await createProfile(
      user.id,
      firstName,
      marketingConsent,
      lastName,
    );
    if (!profileCreated) {
      throw new Error("Failed to create profile");
    }
    const workspaceCreated = await createWorkspace(
      workspaceName,
      user.id,
    );
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
      throw new SomethingWentWrongError();
    }
    return redirect(authenticatedUrl);
  });
