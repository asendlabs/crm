// sidebar/Sidebar.tsx
"use client";

import React from "react";
import {
  Inbox,
  Search,
  Zap,
  Building,
  SquareUserRound,
  Clock,
  Map,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "./UserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { usePathname } from "next/navigation";
import { User, Workspace } from "@database/types";

export const Sidebar = ({
  user,
  workspaces,
  cookieSelectedWorkspaceId,
}: {
  user: any;
  workspaces: Workspace[];
  cookieSelectedWorkspaceId: string;
}) => {
  const sidebarItemClassName =
    "flex font-medium gap-2 items-center text-black/80 text-sm hover:bg-muted-foreground/10 rounded-lg px-2 my-[2.25px] py-[3.75px] cursor-pointer";
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-60 select-none flex-col justify-between border-r bg-card outline-none">
      <div className="flex flex-col pl-2 pr-2 pt-3">
        <div className="ml-1 flex items-center">
          <WorkspaceSwitcher
            workspaces={workspaces}
            cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
          />
        </div>
        <ul className="my-2">
          <div className={`${sidebarItemClassName}`}>
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
          <Link
            href="/app/home"
            className={`${sidebarItemClassName} ${
              pathname === "/app/home"
                ? "bg-muted-foreground/10 !text-black"
                : ""
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Link>
        </ul>
        <ul className="">
          <Link
            href="/app/leads"
            prefetch={false}
            className={`${sidebarItemClassName} ${
              pathname === "/app/leads" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Leads</span>
          </Link>
          <Link
            href="/app/opportunities"
            className={`${sidebarItemClassName} ${
              pathname === "/deals" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Opportunities</span>
          </Link>
          <Link
            href="/app/contacts"
            prefetch={false}
            className={`${sidebarItemClassName} ${
              pathname === "/contacts"
                ? "bg-muted-foreground/10 !text-black"
                : ""
            }`}
          >
            <SquareUserRound className="h-4 w-4" />
            <span>Contacts</span>
          </Link>
        </ul>
      </div>
      <div className="flex flex-col px-2 py-2">
        <ul className="pb-3">
          <Link href="/updates" className={`${sidebarItemClassName}`}>
            <Clock className="h-4 w-4" />
            <span>What's New</span>
          </Link>
          <Link href="/roadmap" className={`${sidebarItemClassName}`}>
            <Map className="h-4 w-4" />
            <span>Roadmap</span>
          </Link>
          <Link href="/app/settings" className={`${sidebarItemClassName}`}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </ul>
        <div className="ml-2 flex items-center">
          <UserButton
            email={user?.email || ""}
            name={
              user.profile.firstName + " " + user.profile.lastName ||
              user?.email?.slice(0, user?.email?.indexOf("@")) ||
              ""
            }
            avatarUrl={user?.profile.avatarUrl || ""}
          />
        </div>
      </div>
    </div>
  );
};
