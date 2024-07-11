"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogoutLink = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={async() => {
      const res = await signOut();
      if (res?.success) {
        // router.push("/");
        toast.success("You have been logged out");
      } else {
        toast.error(res?.message);
      }
    }}>
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </div>
  );    
};
