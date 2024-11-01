"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown, Hexagon, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Workspace } from "@database/types";
import { toast } from "sonner";
import { useRouter } from "@/hooks/use-performance-router";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedWorkspaceAction } from "@/server/workspaces";
import { useServerAction } from "zsa-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind";

export function WorkspaceSwitcher({
  workspaces,
  cookieSelectedWorkspaceId,
}: {
  workspaces: Workspace[];
  cookieSelectedWorkspaceId: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<Workspace | null>(null);
  const [loading, setLoading] = React.useState(true);
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

      setLoading(false);
    };

    workspaceLogic();
  }, [workspaces, cookieSelectedWorkspaceId, execute]);

  if (loading)
    return (
      <div className="flex w-full items-center justify-between px-2">
        <div className="flex items-center">
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="ml-auto size-4 rounded" />
      </div>
    );

  return (
    <SidebarMenu className="mt-1">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="m-[0.34rem] mb-0 w-[97%] rounded-lg border px-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {/* <Avatar className="bg-sidebar-primary text-sidebar-primary-foreground size-7 rounded-md">
                <AvatarImage
                  src={""} // You can add the workspace logo here
                  alt={selectedWorkspace?.name || ""}
                  className="rounded-lg"
                />
                <AvatarFallback className="!bg-transparent">
                  <Hexagon className="size-4" fill="currentColor" />
                </AvatarFallback>
              </Avatar> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedWorkspace?.name}
                </span>
                {/* <span className="truncate text-xs">{"Free Plan"}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={async () => {
                  setSelectedWorkspace(workspace);
                  const response = await execute({ workspaceId: workspace.id });
                  if (!response) {
                    toast.error("Unable to change workspace");
                  }
                  setOpen(false);
                }}
                className={cn(
                  "gap-2 p-2",
                  selectedWorkspace?.id === workspace.id ? "text-primary" : "",
                )}
              >
                {/* <Avatar className="size-6">
                  <AvatarImage
                    src={""}
                    alt={workspace.name || ""}
                    className="rounded-lg"
                  />
                  <AvatarFallback>{workspace.name?.charAt(0)}</AvatarFallback>
                </Avatar> */}
                {workspace.name}
                <DropdownMenuShortcut>
                  ⌘{workspaces.indexOf(workspace) + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowNewWorkspaceDialog(true)}
              className="cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* <Dialog
        open={showNewWorkspaceDialog}
        onOpenChange={setShowNewWorkspaceDialog}
      >
        <DialogContent className="p-5">
          New workspace form goes here
        </DialogContent>
      </Dialog> */}
    </SidebarMenu>
  );
}
