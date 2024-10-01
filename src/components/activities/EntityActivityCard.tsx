import { formatDate, timeAgo } from "@/utils";
import { Handshake, Trash, User } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export function EntityActivityCard({
  entitiyType,
  activityType,
  entityTitle,
  createdAt,
}: {
  entitiyType: string;
  activityType: string;
  entityTitle: string;
  createdAt: Date | string;
}) {
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
      <span className="flex gap-1 px-3 py-1 text-gray-500">
        {formatDate(createdAt)} ({timeAgo(createdAt.toString())})
      </span>
    </section>
  );
}
