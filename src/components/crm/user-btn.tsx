"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, LibraryBig, LogOut, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { svLogout } from "@/server/auth.server";
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
        <DropdownMenuTrigger asChild className="w-full">
          <button className="select-none rounded-full text-sm font-medium outline-none hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholders/profile1.jpg" />
                <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm">
                {/* {truncateEmail(email, 16)}
                 */}
                Waris Reshi
                <ChevronUp className="ml-2 h-4 w-4" />
              </div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="ml-2 w-56">
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
            className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 px-2 py-2 text-sm"
            onClick={async () => {
              const { success } = await svLogout();
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
