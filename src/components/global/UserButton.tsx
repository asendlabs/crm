import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { getUser } from "@/lib/lucia";

const UserButton = async ({className} : {className: string}) => {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const avatarUrl = user.avatarUrl?.toString() || "";
  const initials = user.name.toString().substring(0, 2).toUpperCase();

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
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
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
