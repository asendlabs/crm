"use client";
import { formatDate, timeAgo } from "@/utils";
import {
  EllipsisIcon,
  Handshake,
  Loader2,
  Trash,
  TrashIcon,
  User,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServerAction } from "zsa-react";
import { deleteActivityAction } from "@/server/activity";
import { useRouter } from "next/navigation";

export function EntityActivityCard({
  entitiyType,
  activityType,
  entityTitle,
  createdAt,
  activityId,
}: {
  entitiyType: string;
  activityType: string;
  entityTitle: string;
  createdAt: Date | string;
  activityId: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const deleteActivityActionCaller = useServerAction(deleteActivityAction);
  const router = useRouter();
  return (
    <section className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        {entitiyType === "deal" ? (
          <Handshake className="h-4 w-4 text-gray-500" />
        ) : entitiyType === "contact" ? (
          <User className="h-4 w-4 text-gray-500" />
        ) : (
          "\u3164"
        )}
        <div className="flex items-center gap-1.5 py-1">
          <span className="rounded-md bg-muted-foreground/20 px-2 py-0.5">
            {entityTitle}
          </span>
          <span className="py-0.5">
            {activityType === "entity_creation" ? "was created" : "was deleted"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex gap-1 px-3 py-1 text-gray-500">
          {formatDate(createdAt)} ({timeAgo(createdAt.toString())})
        </span>
        <Button
          size={"icon"}
          className="h-6 w-7"
          variant={"outline"}
          onClick={async () => {
            setLoading(true);
            try {
              const [data, err] = await deleteActivityActionCaller.execute({
                itemIds: [activityId],
              });
              if (!err) {
                router.refresh();
              }
            } catch (error) {
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TrashIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </section>
  );
}
