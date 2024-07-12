import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutLink } from "./LogoutLink";
import React from "react";
import { Settings } from "lucide-react";
import { getUser } from "@/lib/lucia";

const UserButton = async () => {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const avatarUrl = user.avatarUrl?.toString() || "";

  function getInitials(fullName: string): string {
    // Remove trailing spaces
    const trimmedName = fullName.trim();

    // Split the trimmed name into words
    const words = trimmedName.split(" ");

    // Handle empty or single-word names
    if (!words.length) return "";
    if (words.length === 1) return words[0][0].toUpperCase();

    // Get initials from first and last words
    let initials = words[0][0].toUpperCase();
    initials += words[words.length - 1][0].toUpperCase();

    // Ensure output is maximum 2 characters
    return initials.substring(0, 2);
  }

  const initials = getInitials(user.name?.toString() || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="grid gap-0.5 leading-none">
            <div className="font-semibold">{user?.name?.toString() || ""}</div>
            <div className="text-sm text-muted-foreground">
              {user?.email?.toString() || ""}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/settings"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutLink />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
