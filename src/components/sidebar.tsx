"use client";

import {
  Building,
  Clock,
  Handshake,
  Inbox,
  Map,
  Settings,
  Users,
} from "lucide-react";

import Link from "next/link";
import React from "react";
import { User } from "@/db/schema";
import { UserBtn } from "./user-btn";
import { usePathname } from "next/navigation";

const Sidebar = ({ user }: { user: User }) => {
  const sidebarItemClassName =
    "mb-1 flex font-medium items-center text-black/80 text-sm hover:text-blue-500 hover:bg-muted-foreground/10 rounded-full px-2 py-[4.5px] cursor-pointer";
  const pathname = usePathname();
  return (
    <div className="w-60 bg-card border-r h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <UserBtn email={user.email} />
        </div>
        <ul className="ml-[-2px]">
          <Link
            href="/home"
            className={`${sidebarItemClassName} ${
              pathname === "/home" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Inbox className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Link>
          <Link href="/leads" className={`${sidebarItemClassName}`}>
            <Building className="w-4 h-4 mr-2" />
            <span>Leads</span>
          </Link>
          <Link href="/contacts" className={`${sidebarItemClassName}`}>
            <Users className="w-4 h-4 mr-2" />
            <span>Contacts</span>
          </Link>
          <Link href="/opportunities" className={`${sidebarItemClassName}`}>
            <Handshake className="w-4 h-4 mr-2" />
            <span>Opportunities</span>
          </Link>
        </ul>
      </div>
      <div>
        <ul className="ml-[-2px]">
          <Link href="/updates" className={`${sidebarItemClassName}`}>
            <Clock className="w-4 h-4 mr-2" />
            <span>What's New</span>
          </Link>
          <Link href="/roadmap" className={`${sidebarItemClassName}`}>
            <Map className="w-4 h-4 mr-2" />
            <span>Roadmap</span>
          </Link>
          <Link href="/settings" className={`${sidebarItemClassName}`}>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
