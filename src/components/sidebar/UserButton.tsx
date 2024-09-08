"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, LibraryBig, Loader2, LogOut, Send, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { logoutAction } from "./actions";
import { useServerAction } from "zsa-react";

export function UserButton({
  email,
  name,
  avatarUrl,
}: {
  email: string;
  name: string;
  avatarUrl: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { execute } = useServerAction(logoutAction);
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
                <AvatarImage src={avatarUrl} className="object-contain" />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm">
                {name}
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
              setLoading(true);
              try {
                const response = await execute();
                if (!response) {
                  toast.error("Unable to logout");
                  return;
                }
                router.replace("/login");
                toast.success("Logged out successfully", {
                  position: "bottom-right",
                  duration: 2000,
                  richColors: false
                });
              } catch (error) {
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
