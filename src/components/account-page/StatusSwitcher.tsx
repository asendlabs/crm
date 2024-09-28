"use client";

import * as React from "react";
import { CheckIcon, PlusCircleIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/tailwind";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusSwitcherProps {
  statuses: string[];
  className?: string;
  currentStatus: string;
}

export function StatusSwitcher({
  statuses,
  className,
  currentStatus,
}: StatusSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true); // Initialize loading as true to show loading state first

  React.useEffect(() => {
    setSelectedStatus(currentStatus);
    setLoading(false); // Set loading to false after fetching the status
  }, [currentStatus]); // Add dependencies to useEffect

  const changeStatus = async (newStatus: string) => {
    // Placeholder for status change logic
    setSelectedStatus(newStatus);
    setOpen(false);
  };

  if (loading)
    return (
      <div className="flex w-72 items-center justify-between px-2">
        <div className="flex items-center">
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="ml-auto h-4 w-4 rounded" />
      </div>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a status"
          className={cn(
            "flex h-9 w-56 items-center capitalize p-0 m-0 border-gray-300",
            className,
          )}
        >
          <p className="h-[2.16rem] flex items-center bg-muted px-4 rounded-l-md">Status</p>
          <span className="flex h-9 items-center border-gray-200 capitalize pl-2 border-l text-center justify-center">
            {selectedStatus}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 mr-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-[2px]">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList className="px-0.5 py-1">
            <CommandEmpty>No status found.</CommandEmpty>
            {statuses.map((status) => (
              <CommandItem
                key={status}
                onSelect={() => changeStatus(status)}
                className="text-sm"
              >
                {status}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedStatus === status ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
