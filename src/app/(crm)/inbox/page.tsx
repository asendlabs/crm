"use client";

import { UploadButton } from "@/lib/utils/uploadthing";

export default function InboxPage() {
  return (
    <UploadButton
      endpoint="avatarUploader"
      className="bg-gray-200"
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
