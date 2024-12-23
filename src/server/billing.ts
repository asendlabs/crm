"use server";
import { updateUser } from "@/data-access/users";
import { redirect } from "next/navigation";
import { authenticatedUrl } from "@/constants";
import { authenticatedAction } from "@/lib/zsa";

export const setUserCheckoutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const updatedUser = await updateUser(user.id, {
      checkoutAt: new Date(),
      updatedAt: new Date(),
    });
    if (!updatedUser) throw new Error("Couldn't set user as checked out");
    return redirect(authenticatedUrl);
  });
