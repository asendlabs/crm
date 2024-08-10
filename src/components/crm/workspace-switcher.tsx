"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";

interface WorkspaceData {
  id: string;
  name: string;
}

const mockData: WorkspaceData[] = [
  {
    id: "1",
    name: "Asend",
  },
  {
    id: "4893jbnfbdsyfsdf",
    name: "SZB Media",
  },
];
function WorkspaceSwitcher() {
  const activeWorkspaceId = "1";
  const loggedInWorkspace = mockData.filter(
    (eachitem) => eachitem.id == activeWorkspaceId,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <button className="flex flex-row items-center justify-between rounded-md border border-gray-300 p-1 outline-none">
          <div className="flex items-center gap-2 text-sm">
            <Image
              src="/placeholders/profile1.jpg"
              width={20}
              height={20}
              className="h-5 w-5 rounded-lg"
              alt="abc"
            />
            <span>{loggedInWorkspace.map((item) => item.name)}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[13.5rem] border border-gray-300">
        {mockData
          .filter((item) => item.id != activeWorkspaceId)
          .map((filteredItem) => (
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex w-full items-center gap-2 text-sm">
                <Image
                  src="/placeholders/profile1.jpg"
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-lg"
                  alt="abc"
                />
                <span>{filteredItem.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSwitcher;
