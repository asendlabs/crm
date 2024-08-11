import { getUser } from "@/server/user.action";
import {
  createUploadthing,
  type FileRouter as FileRouterType,
} from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing({
  errorFormatter: (error) => {
    return {
      message: error.message,
      code: error.code,
      zodError:
        error.cause instanceof z.ZodError ? error.cause.flatten() : null,
    };
  },
});

export const uploadthingRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } })
    .input(z.object({ avatar: z.string() }))
    .middleware(async () => {
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(file.url);
      return { metadata, file };
    }),
} satisfies FileRouterType;

export const utapi = new UTApi({
  logLevel: "error",
});

export type UploadThingRouterType = typeof uploadthingRouter;
