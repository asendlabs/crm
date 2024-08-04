"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LibraryBig, LogOut, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { signOut } from "@/server/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UserBtn({ email }: { email: string }) {
  const router = useRouter();
  function truncateEmail(email: string, maxLength: number) {
    if (email.length > maxLength) {
      return email.slice(0, maxLength) + "....";
    }
    return email;
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-sm font-medium hover:bg-gray-100 rounded-full select-none outline-none">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7  ">
                <AvatarImage src="https://xsgames.co/randomusers/assets/avatars/male/74.jpg" />
                <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm">
                {/* {truncateEmail(email, 16)}
                 */}
                Waris Reshi
                <ChevronDown className="h-4 w-4 ml-2" />
              </div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 ml-2">
          <DropdownMenuItem>
            <p className="flex items-center gap-2">{email}</p>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/support"
              className="flex items-center gap-2"
              prefetch={false}
            >
              <Send className="h-4 w-4" />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/docs"
              className="flex items-center gap-2"
              prefetch={false}
            >
              <LibraryBig className="h-4 w-4" />
              <span>Docs</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <button
            className="flex flex-row justify-start items-center gap-2 cursor-pointer text-sm px-2 py-2 w-full"
            onClick={async () => {
              const { success } = await signOut();
              if (success) {
                router.refresh();
              } else {
                router.refresh();
                toast.error("Couldn't logout");
              }
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
