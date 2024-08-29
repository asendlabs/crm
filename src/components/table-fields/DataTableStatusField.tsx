"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import React from "react";
import { StatusBadge } from "@/components/ui/statusbagde";

interface DataTableStatusFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
  statusEnum: any;
}

export function DataTableStatusField({
  getValue,
  row,
  column,
  table,
  statusEnum,
}: DataTableStatusFieldProps) {
  const initialValue = getValue();
  const [open, setOpen] = React.useState(false);

  const handleClick = (status: string) => {
    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: status,
    });
  };

  return (
    <div
      className="w-30 flex h-full cursor-pointer flex-row items-center gap-2"
      onClick={() => setOpen(!open)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="w-full select-none px-1.5">
          <StatusBadge
            variant="secondary"
            className="flex flex-row items-center justify-between bg-muted-foreground/20"
          >
            {initialValue}
            <ChevronDown className="h-4 w-4 text-black" />
          </StatusBadge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="ml-2 mt-1 w-48">
          {statusEnum.enumValues.map((status: any) => (
            <DropdownMenuItem key={status} onClick={() => handleClick(status)}>
              <button className="flex flex-row items-center gap-2">
                <span>{status}</span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
