"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Layers, Settings2, View } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  primaryFields: string[];
}

export function DataTableViewOptions<TData>({
  table,
  primaryFields,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-sm"
        >
          <Layers className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              !primaryFields.includes(column.id) && // Corrected filter condition
              column.id !== "select" &&
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide(),
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="lower-case"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
