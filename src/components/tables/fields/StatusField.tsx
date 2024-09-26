"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/statusbagde"; 
import { getWorkspaceStatusValuesAction } from "@/server/workspaces";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";

interface StatusFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function StatusField({
  getValue,
  row,
  column,
  table,
}: StatusFieldProps) {
  const initialValue = getValue();
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<any[]>([]);
  const { execute } = useServerAction(getWorkspaceStatusValuesAction);

  useEffect(() => {
    const fetchStatuses = async () => {
      const storedStatusEnum = localStorage.getItem("statusEnum");

      if (storedStatusEnum) {
        // If statusEnum is in localStorage, use it
        try {
          setStatuses(JSON.parse(storedStatusEnum));
        } catch (e) {
          toast.error("Error parsing available statuses");
        }
      } else {
        try {
          const [data, err] = await execute();
          if (err) {
            toast.error(err.message + 'here it is');
            return;
          }
          // Optionally, store the fetched values in localStorage for future use
          localStorage.setItem("statusEnum", JSON.stringify(data));
          setStatuses(data?.data);
        } catch (e) {
          toast.error("Failed to fetch statuses");
        }
      }
    };

    fetchStatuses(); // Call the async function
  }, [execute]);

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
          {statuses.map((status: any) => (
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
