"use client";

import React, { useContext, useState, useEffect } from "react";
import { AccountContext } from "@/providers/accountProvider";
import Link from "@/components/performance-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle, Loader, MoreVertical, Share, Trash } from "lucide-react";
import { useServerAction } from "zsa-react";
import { deleteAccountAction, updateAccountAction } from "@/server/accounts";
import { toast } from "sonner";
import { useRouter } from "@/hooks/use-performance-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AccountShareDialog from "./AccountShareDialog";
import { PageTitle } from "@/components/PageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountStatus } from "@/types/entities";

export function Header({ className }: { className?: string }) {
  const { account } = useContext(AccountContext);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<AccountStatus | undefined>(
    account?.status ?? undefined,
  );
  const deleteActivityActionCaller = useServerAction(deleteAccountAction);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const router = useRouter();
  const accountStatuses: AccountStatus[] =
    (account?.workspace?.accountStatuses as AccountStatus[]) || [];

  useEffect(() => {
    setStatus(account?.status || undefined);
  }, [account]);

  const handleStatusChange = async (newStatus: string) => {
    const selectedStatus = accountStatuses.find(
      (statusObj: AccountStatus) => statusObj.status === newStatus,
    );
    if (selectedStatus) {
      setStatus(selectedStatus);
      try {
        const [, err] = await updateAccountActionCaller.execute({
          itemId: account?.id ?? "",
          columnId: "status",
          newValue: JSON.stringify(selectedStatus),
        });
        if (err) {
          toast.error(err?.message);
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error("An error occurred while updating the status.");
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const [, err] = await deleteActivityActionCaller.execute({
        itemIds: [account?.id!],
      });
      if (!err) {
        router.replace(`/app/${account?.type}s/`);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        "Something Went Wrong, Please contact support if issue persists.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleConvertToClient = async () => {
    if (account?.type === "client") {
      toast.error("This account is already a client.");
      return;
    }

    setConverting(true);
    try {
      const [, err] = await updateAccountActionCaller.execute({
        itemId: account?.id!,
        columnId: "type",
        newValue: "client",
      });
      if (!err) {
        toast.success("Converted to client successfully");
        router.push(`/app/clients/${account?.id}`);
      } else {
        toast.error("Failed to convert account to client.");
      }
    } catch (error) {
      toast.error(
        "Something Went Wrong, Please contact support if issue persists.",
      );
    } finally {
      setConverting(false);
    }
  };
  return (
    <section
      className={cn(
        "flex items-center justify-between border-b border-border",
        className,
      )}
    >
      {/* <SidebarTrigger /> */}
      <PageTitle>
        <div className="text-lg">
          <Link
            className="capitalize opacity-70 hover:opacity-90"
            href={`/app/${account?.type}s/`}
          >
            {account?.type}
          </Link>
          {" / "}
          <span className="font-medium">{account?.accountName || ""}</span>
        </div>
      </PageTitle>
      <div className="flex gap-2">
        {account?.type !== "client" && (
          <>
            <Select
              value={status?.status || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className={cn(
                  "ml-2 h-7 w-fit cursor-pointer items-center gap-1 bg-transparent px-2 text-sm font-medium capitalize hover:bg-muted",
                )}
              >
                {status ? (
                  <div
                    className="flex items-center gap-1.5"
                    style={{ color: `#${status.color}` }}
                  >
                    <Circle
                      strokeWidth={4}
                      absoluteStrokeWidth
                      className="h-3 w-3"
                    />
                    {status.status}
                  </div>
                ) : (
                  "Select Status"
                )}
              </SelectTrigger>
              <SelectContent>
                {accountStatuses.map((statusObj: AccountStatus) => (
                  <SelectItem
                    key={statusObj.status}
                    value={statusObj.status}
                    showIndicator={false}
                    className="font-medium"
                    style={{ color: `#${statusObj.color}` }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Circle
                        strokeWidth={4}
                        absoluteStrokeWidth
                        className="h-3 w-3"
                      />
                      {statusObj.status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="h-7"
              onClick={handleConvertToClient}
              variant={"outline"}
              disabled={converting}
            >
              {converting ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert"
              )}
            </Button>
          </>
        )}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="mr-0.5 h-7 w-7"
              variant={"outline"}
            >
              <MoreVertical className="size-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={handleDelete} className="h-7">
              {deleting ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 size-4" />
                  Delete
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShareDialogOpen(true)}
              className="h-7"
            >
              <Share className="mr-2 size-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="p-4">
          <AccountShareDialog
            entityId={account?.id ?? ""}
            entityType="account"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
