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

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth.action";
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
          <Button
            variant="outline"
            className="rounded-lg border-gray-300 py-1 border-[1px] text-sm font-medium hover:bg-gray-100 max-w-52"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholdesdfdsfdsr-user.jpg" />
                <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-sm select-none">
                  {truncateEmail(email, 14)}
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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
