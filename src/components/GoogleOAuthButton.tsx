"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import React from "react";
import { getGoogleOAuthConsentUrl } from "@/lib/actions/authentication";
import { useRouter } from "next/navigation";
const GoogleOAuthButton = () => {
  const router = useRouter();
  return (
    <Button
      className="w-80 bg-gray-50 text-black flex flex-row gap-2"
      variant={"outline"}
      onClick={async () => {
        const { url } = await getGoogleOAuthConsentUrl();
        router.push(url);
      }}
    >
      <Image
        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
        height={15}
        alt=""
        width={15}
        className=""
      />
      Continue with Google {"(Quicker)"}
    </Button>
  );
};
export default GoogleOAuthButton;
