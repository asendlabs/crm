import { getUser } from "@/server/user.action";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } })
    .middleware(async () => {
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(file.url);
      return { metadata, file };
    }),
} satisfies FileRouter;

export type FileRouterType = typeof fileRouter;
