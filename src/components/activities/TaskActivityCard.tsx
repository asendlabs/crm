import { CheckIcon, Ellipsis, EllipsisVertical, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { formatDate, timeAgo } from "@/utils";

interface TaskActivityProps {
  taskName: string;
  completedAt: Date | string;
  activityId: string;
}

export function TaskActivityCard({
  taskName,
  completedAt,
  activityId,
}: TaskActivityProps) {
  return (
    <section className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <CheckIcon className="h-4 w-4 text-gray-500" />
        <div className="flex items-center gap-2 py-1">
          Completed the task
          <span className="rounded-lg bg-muted-foreground/20 px-2 py-0.5">
            {taskName}
          </span>
        </div>
      </div>
      <span className="flex items-center gap-2 px-3 py-1 text-gray-500">
        {formatDate(completedAt)} ({timeAgo(completedAt.toString())})
        <Button variant="ghost" className="h-5 w-5" size="icon">
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      </span>
    </section>
  );
}
