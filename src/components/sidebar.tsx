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
import { User } from "@/db/schema";
import { UserBtn } from "./user-btn";
import { usePathname } from "next/navigation";

const Sidebar = ({ user }: { user: User }) => {
  const sidebarItemClassName =
    "flex font-medium gap-2 items-center text-black/80 text-sm hover:bg-muted-foreground/10 rounded-lg px-2 py-[4.5px] cursor-pointer";
  const pathname = usePathname();
  return (
    <div className="w-60 bg-card border-r h-screen flex flex-col justify-between select-none outline-none">
      <div className="flex flex-col pt-3 pl-2 pr-2">
        <div className="flex items-center mb-2 ml-2">
          <UserBtn email={user.email} />
        </div>
        <ul className="mb-2">
          <div className={`${sidebarItemClassName}`}>
            <Search className="w-4 h-4" />
            <span>Search</span>
          </div>
          <Link
            href="/inbox"
            className={`${sidebarItemClassName} ${
              pathname === "/inbox" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </Link>
        </ul>
        <ul className="">
          <Link href="/opportunities" className={`${sidebarItemClassName}`}>
            <Zap className="w-4 h-4" />
            <span>Deals</span>
          </Link>
          <Link href="/leads" className={`${sidebarItemClassName}`}>
            <Building className="w-4 h-4" />
            <span>Leads</span>
          </Link>
          <Link href="/people" className={`${sidebarItemClassName}`}>
            <SquareUserRound className="w-4 h-4" />
            <span>Contacts</span>
          </Link>
        </ul>
      </div>
      <div className="flex flex-col pt-3 pl-2 pr-2">
        <ul className="pb-3">
          <Link href="/updates" className={`${sidebarItemClassName}`}>
            <Clock className="w-4 h-4" />
            <span>What's New</span>
          </Link>
          <Link href="/roadmap" className={`${sidebarItemClassName}`}>
            <Map className="w-4 h-4" />
            <span>Roadmap</span>
          </Link>
          <Link href="/settings" className={`${sidebarItemClassName}`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
