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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Workspace } from "@database/types";

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  className?: string;
  cookieSelectedWorkspaceId: string;
}

export function WorkspaceSwitcher({
  workspaces,
  className,
  cookieSelectedWorkspaceId,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);
  const initialSelectedWorkspace = workspaces.find(
    (ws) => ws.id === cookieSelectedWorkspaceId,
  );
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>(
    initialSelectedWorkspace || workspaces[0],
  );

  return (
    <Dialog
      open={showNewWorkspaceDialog}
      onOpenChange={setShowNewWorkspaceDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className={cn("w-full justify-between px-2", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedWorkspace.logoUrl || ""}
                alt={selectedWorkspace.name!}
                className="grayscale"
              />
              <AvatarFallback>
                {selectedWorkspace.name!.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {selectedWorkspace.name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-[2px]">
          <Command>
            <CommandInput placeholder="Search workspace..." />
            <CommandList className="px-0.5 py-1">
              <CommandEmpty>No workspace found.</CommandEmpty>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() => {
                    setSelectedWorkspace(workspace);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={workspace.logoUrl || ""}
                      alt={workspace.name!}
                      className="grayscale"
                    />
                    <AvatarFallback>{workspace.name!.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {workspace.name!}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedWorkspace.id === workspace.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewWorkspaceDialog(true);
                    }}
                  >
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    Create Workspace
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent className="p-5">new workspace form</DialogContent>
    </Dialog>
  );
}
