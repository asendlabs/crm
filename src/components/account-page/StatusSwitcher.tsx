"use client";

import * as React from "react";
import { CheckIcon, PlusCircleIcon, ChevronsUpDown, ChevronDown } from "lucide-react";
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
          <Skeleton className="h-8 w-36" />
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a status"
          className={cn("flex h-8 w-fit gap-2 items-center capitalize", className)}
        >
          {selectedStatus}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
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
