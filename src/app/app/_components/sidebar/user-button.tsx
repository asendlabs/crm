"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Loader,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "@/hooks/use-performance-router";
import { useState } from "react";
import { toast } from "sonner";
import { signOutAction } from "@/server/sign-out";
import { useServerAction } from "zsa-react";
import { UserWithWorkspaceAndProfile } from "@/types/entities";

export function UserButton({ user }: { user: UserWithWorkspaceAndProfile }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { execute } = useServerAction(signOutAction);

  async function handleSignOut() {
    setLoading(true);
    try {
      const response = await execute();
      if (!response) {
        toast.error("unable to logout");
        return;
      }
      router.replace("/login");
      toast.success("logged out successfully", {
        position: "bottom-right",
        duration: 2000,
        richColors: false,
      });
    } catch (error) {
      // Handle error if necessary
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarMenu className="">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg border">
                <AvatarImage src={""} alt={user.profile.firstName ?? ""} />
                <AvatarFallback className="rounded-lg bg-transparent">
                  {user.profile.firstName?.slice(0, 1)}
                  {user.profile.lastName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.profile.firstName} {user.profile.lastName ?? ""}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user.profile.firstName ?? ""} />
                  <AvatarFallback className="rounded-lg">
                    {user.profile.firstName?.slice(0, 1)}
                    {user.profile.lastName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.profile.firstName} {user.profile.lastName ?? ""}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles size={15} />
                Upgrade to pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck size={15} />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard size={15} />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell size={15} />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/app/settings/account");
              }}
              className="flex items-center"
            >
              <Settings size={15} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center"
            >
              {loading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
              <span>{loading ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
