"use client";

import {
  Building,
  Handshake,
  Home,
  Map,
  Settings,
  Users,
  Zap,
} from "lucide-react";

import Link from "next/link";
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarItemData } from "./SidebarItem";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const upperItems: SidebarItemData[] = [
    {
      title: "Home",
      Icon: Home,
      active: pathname === "/home",
    },
    {
      title: "Leads",
      Icon: Building,
      active: pathname === "/leadss",
    },
    {
      title: "Contacts",
      Icon: Users,
      active: pathname === "/contacts",
    },
    {
      title: "Deals",
      Icon: Handshake,
      active: pathname === "/deals",
    },
    {
      title: "Settings",
      Icon: Settings,
      active: pathname === "/settings",
    },
  ];
  const lowerItems: SidebarItemData[] = [
    {
      title: "What's New",
      Icon: Zap,
      active: pathname === "/updates",
    },
    {
      title: "Roadmap",
      Icon: Map,
      active: pathname === "/roadmap",
    },
  ];
  return (
    <nav className="flex flex-col h-screen justify-between pt-4 border-r-[1px] border-gray-100 ">
      <div id="upper">
        <Link
          className="font-bold text-lg px-4 cursor-pointer text-blue-600"
          href="/"
        >
          Ascend CRM
        </Link>
        <div className="flex flex-col text-sm p-2">
          {upperItems.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              Icon={item.Icon}
              active={item.active}
            />
          ))}
        </div>
      </div>
      <div id="lower">
        <div className="flex flex-col text-sm p-2">
          {lowerItems.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              Icon={item.Icon}
              active={item.active}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
