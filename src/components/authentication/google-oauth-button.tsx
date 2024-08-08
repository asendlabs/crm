"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import React from "react";
import { getGoogleOAuthConsentUrl } from "@/server/auth.action";
import { useRouter } from "next/navigation";
const GoogleOAuthButton = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      className="flex w-80 flex-row gap-2 bg-gray-50 text-black"
      variant={"outline"}
      onClick={async () => {
        try {
          setLoading(true);
          const { url } = await getGoogleOAuthConsentUrl();
          router.push(url);
        } catch (error) {
          console.error("Something went Wrong");
        }
      }}
    >
      {loading ? (
        ""
      ) : (
        <Image
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          height={15}
          alt=""
          width={15}
          className=""
        />
      )}
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        "Continue with Google"
      )}
    </Button>
  );
};
export default GoogleOAuthButton;
