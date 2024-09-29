import { CheckIcon } from "lucide-react";
import React from "react";

interface BasicInfoTimelineItemProps {
  title?: string;
  description?: string;
  time?: string;
}


export function BasicInfoTimelineItem({title, description, time}: BasicInfoTimelineItemProps) {
  return (
    <section className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <CheckIcon className="h-4 w-4 text-gray-500" />
        <div className="flex items-center gap-2 py-1">
          Waris completed the task
          <span className="rounded-md bg-muted-foreground/20 px-2 py-0.5">
            Send Proposal
          </span>
        </div>
      </div>
      <span className="flex gap-1 px-3 py-1 text-gray-500">02 Days Ago</span>
    </section>
  );
}
