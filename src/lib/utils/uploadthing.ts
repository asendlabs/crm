import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { FileRouterType } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<FileRouterType>();
export const UploadDropzone = generateUploadDropzone<FileRouterType>();
