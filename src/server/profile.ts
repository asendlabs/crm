"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import { updateProfile } from "@/data-access/users";

export const updateProfileFirstNameAction = authenticatedAction
  .createServerAction()
  .input(z.object({ firstName: z.string() }))
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { firstName } = input;
    const res = await updateProfile(user.id, {
      firstName,
    });
    if (!res) {
      throw new Error("Could not update the user's first name."); // Inline error message
    }
    return true;
  });

export const updateProfileLastNameAction = authenticatedAction
  .createServerAction()
  .input(z.object({ lastName: z.string() }))
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { lastName } = input;
    const res = await updateProfile(user.id, {
      lastName,
    });
    if (!res) {
      throw new Error("Could not update the user's last name."); // Inline error message
    }
    return true;
  });
