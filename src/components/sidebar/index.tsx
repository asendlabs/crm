"use client";

import {
  Building,
  Clock,
  Inbox,
  Map,
  Search,
  Settings,
  SquareUserRound,
  Zap,
} from "lucide-react";

import Link from "next/link";
import React from "react";
import { User } from "@database/types";
import { UserButton } from "./UserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { usePathname } from "next/navigation";
const workspaces = [
  {
    title: "Acme Corporation",
    internalValue: "acme-corp",
    avatarUrl: "https://avatar.vercel.sh/acme-corp.png",
    description: "Leading manufacturer in the industry.",
  },
  {
    title: "Monsters Inc.",
    internalValue: "monsters-inc",
    avatarUrl: "https://avatar.vercel.sh/monsters-inc.png",
    description: "We scare because we care.",
  },
  {
    title: "Wayne Enterprises",
    internalValue: "wayne-enterprises",
    avatarUrl: "https://avatar.vercel.sh/wayne-enterprises.png",
    description: "Building a better tomorrow.",
  },
  {
    title: "Stark Industries",
    internalValue: "stark-industries",
    avatarUrl: "https://avatar.vercel.sh/stark-industries.png",
    description: "Changing the future of technology.",
  },
  {
    title: "Daily Bugle",
    internalValue: "daily-bugle",
    avatarUrl: "https://avatar.vercel.sh/daily-bugle.png",
    description: "New York's finest news source.",
  },
];

export const Sidebar = ({ user }: { user: any }) => {
  const sidebarItemClassName =
    "flex font-medium gap-2 items-center text-black/80 text-sm hover:bg-muted-foregçround/10 rounded-lg px-2 my-[2.25px] py-[3.75px] cursor-pointer";
  const pathname = usePathname();
  return (
    <div className="flex h-screen w-60 select-none flex-col justify-between border-r bg-card outline-none">
      <div className="flex flex-col pl-2 pr-2 pt-3">
        <div className="ml-1 flex items-center">
          <WorkspaceSwitcher workspaces={workspaces} />
        </div>
        <ul className="my-2">
          <div className={`${sidebarItemClassName}`}>
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
          <Link
            href="/home"
            className={`${sidebarItemClassName} ${
              pathname === "/home" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Link>
        </ul>
        <ul className="">
          <Link
            href="/deals"
            className={`${sidebarItemClassName} ${
              pathname === "/deals" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Deals</span>
          </Link>
          <Link
            href="/leads"
            prefetch={false}
            className={`${sidebarItemClassName} ${
              pathname === "/leads" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Leads</span>
          </Link>
          <Link
            href="/contacts"
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
          <Link href="/settings" className={`${sidebarItemClassName}`}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </ul>
        <div className="ml-2 flex items-center">
          <UserButton
            email={user?.email || ""}
            name={user?.name || ""}
            avatarUrl={user?.avatarUrl || ""}
          />
        </div>
      </div>
    </div>
  );
};
