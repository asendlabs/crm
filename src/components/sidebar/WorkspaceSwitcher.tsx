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
import { Workspace } from "@database/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedWorkspaceAction } from "@/server/workspaces";
import { useServerAction } from "zsa-react";

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
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<Workspace | null>(null);
  const [loading, setLoading] = React.useState(true); // Initialize loading as true to show loading state first
  const { execute } = useServerAction(setSelectedWorkspaceAction);

  React.useEffect(() => {
    const workspaceLogic = async () => {
      const previouslySelectedWorkspace = workspaces.find(
        (ws) => ws.id === cookieSelectedWorkspaceId,
      );

      if (!previouslySelectedWorkspace) {
        const firstWorkspaceInArray = workspaces[0];
        await execute({ workspaceId: firstWorkspaceInArray.id });
        setSelectedWorkspace(firstWorkspaceInArray);
      } else {
        setSelectedWorkspace(previouslySelectedWorkspace);
      }

      setLoading(false); // Set loading to false after fetching the workspace
    };

    workspaceLogic();
  }, [workspaces, cookieSelectedWorkspaceId]); // Add dependencies to useEffect

  if (loading)
    return (
      <div className="flex w-full items-center justify-between px-2">
        <div className="flex items-center">
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="ml-auto h-4 w-4 rounded" />
      </div>
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
            {/* <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedWorkspace?.logoUrl || ""}
                alt={selectedWorkspace?.name || ""}
                className="grayscale"
              />
              <AvatarFallback>
                {selectedWorkspace?.name?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar> */}
            {selectedWorkspace?.name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-[2px]">
          <Command>
            <CommandInput placeholder="Search workspace..." />
            <CommandList className="px-0.5 py-1">
              <CommandEmpty>No workspace found.</CommandEmpty>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={async () => {
                    setSelectedWorkspace(workspace);
                    const response = await execute({
                      workspaceId: workspace.id,  
                    });
                    if (!response) {
                      toast.error("Unable to change workspace");
                    }
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {/* <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={workspace.logoUrl || ""}
                      alt={workspace.name!}
                      className="grayscale"
                    />
                    <AvatarFallback>{workspace.name!.charAt(0)}</AvatarFallback>
                  </Avatar> */}
                  {workspace.name!}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedWorkspace?.id === workspace.id
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
