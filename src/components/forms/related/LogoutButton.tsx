"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { svLogout } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={async () => {
        const serverResponse = await svLogout();
        if (!serverResponse.success) return toast.error(serverResponse.message);
        if (serverResponse.success) return router.push("/login");
      }}
    >
      Log Out
    </Button>
  );
};