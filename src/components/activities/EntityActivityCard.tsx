"use client";
import { formatDate, timeAgo } from "@/utils";
import {
  Building,
  Edit,
  EllipsisIcon,
  Handshake,
  Loader2,
  MoreVertical,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServerAction } from "zsa-react";
import { deleteActivityAction } from "@/server/activity";
import { useRouter } from "next/navigation";
import { ActivityWithContact } from "@/types/entities";

export function EntityActivityCard({
  activity,
}: {
  activity: ActivityWithContact;
}) {
  const [deleting, setDeleting] = React.useState(false);
  const deleteActivityActionCaller = useServerAction(deleteActivityAction);
  const router = useRouter();
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const [, err] = await deleteActivityActionCaller.execute({
        itemIds: [activity.id],
      });
      if (!err) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };
  return (
    <section className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {activity.entityType === "deal" ? (
          <Handshake className="h-4 w-4 text-gray-500" />
        ) : activity.entityType === "contact" ? (
          <User className="h-4 w-4 text-gray-500" />
        ) : activity.entityType === "account" ? (
          <Building className="h-4 w-4 text-gray-500" />
        ) : (
          "\u3164"
        )}
        <div className="flex items-center gap-1 py-1">
          <span className="capitalize">{activity.entityType}</span>
          <span className="rounded-md border px-2 py-0.5">
            {activity.entityTitle}
          </span>
          <span className="py-0.5">
            {activity.activityType === "entity_creation"
              ? "was created"
              : "was deleted"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex gap-1 px-3 py-1 text-gray-500">
          {/* {formatDate(activity.createdAt)} ( */}
          {timeAgo(activity.createdAt.toString())}
        </span>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="mr-0.5 h-6 w-7"
              variant={"outline"}
            >
              <MoreVertical className="h-4 w-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={handleDelete}>
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
