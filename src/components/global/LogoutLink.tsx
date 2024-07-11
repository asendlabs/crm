"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/auth.actions";

export const LogoutLink = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => signOut()}>
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </div>
  );    
};
