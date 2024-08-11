import { createRouteHandler } from "uploadthing/next";
import { uploadthingRouter } from "@/lib/uploadthing";
export const { GET, POST } = createRouteHandler({
  router: uploadthingRouter,
});
