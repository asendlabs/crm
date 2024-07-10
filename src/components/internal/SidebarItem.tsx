"use client";

import Link from "next/link";
import React from "react";

export interface SidebarItemData {
  title: string;
  Icon: React.ElementType; // Changed React.ReactNode to React.ElementType
  active: boolean;
}

export const SidebarItem = ({ title, Icon, active }: SidebarItemData) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      className={`flex items-center w-full justify-start sidebar-link ${active ? 'sidebar-link-active' : '`'}`}
    >
      <Icon className="h-4 w-4" />
      {title}
    </Link>
  );
};
