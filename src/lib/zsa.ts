import { env } from "@/env";
import { createServerActionProcedure } from "zsa";
import { getAuth } from "./auth";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { decryptFromBase64URI } from "./utils";
import { z } from "zod";

function shapeErrors({ err }: any) {
  const isAllowedError = true;
  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = env.NODE_ENV === "development";
  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? "ERROR",
      message: `${isDev ? "DEV - " : ""}${err.message}`,
    };
  } else {
    return {
      code: "ERROR",
      message: "Something went wrong",
    };
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .output(
    z.object({
      user: z.any(),
      session: z.any(),
      workspaceId: z.custom<string | null>(),
    }),
  )
  .handler(async () => {
    const { user, session } = await getAuth();
    if (!user || !session) {
      throw new Error("You need to be logged in to access this content");
    }
    const cookieStore = await cookies();
    const encodedWorkspaceId =
      cookieStore.get(selectedWorkspaceCookie)?.value ?? null;
    if (!encodedWorkspaceId) {
      return { user, session, workspaceId: null };
    }
    const workspaceId = decryptFromBase64URI(encodedWorkspaceId);
    console.log(encodedWorkspaceId, workspaceId);
    return { user, session, workspaceId };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    return { user: undefined };
  });
