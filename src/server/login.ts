"use server";
import { createServerAction } from "zsa";
import { loginSchema } from "@/schemas/auth.schema";
import { checkUserPassword } from "@/data-access/users";
import { LoginError } from "@/data-access/_errors";
import { createSessionForUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { authenticatedUrl } from "@/app-config";

export const loginAction = unauthenticatedAction
  .createServerAction()
  .input(loginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const user = await checkUserPassword(email, password);
    if (!user) {
      throw new LoginError();
    }
    await createSessionForUser(user.id);
    return redirect(authenticatedUrl);
  });
