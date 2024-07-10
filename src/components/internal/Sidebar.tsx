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
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import Link from "next/link";
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarItemData } from "./SidebarItem";

type Props = {
  username: string;
};

export const Sidebar = ({ username }: Props) => {
  const pathname = usePathname();
  const upperItems: SidebarItemData[] = [
    {
      title: "Dashboard",
      Icon: Home,
      active: pathname === "/dashboard",
    },
    {
      title: "Accounts",
      Icon: Building,
      active: pathname === "/accounts",
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
    <nav className="flex flex-col w-48 h-screen justify-between pt-4">
      <div id="upper">
        <Link className="font-bold text-lg px-4 cursor-pointer" href="/">
          ascendCRM
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
        <div>
          <Button variant={"link"}>{username}</Button>
        </div>
      </div>
    </nav>
  );
};
