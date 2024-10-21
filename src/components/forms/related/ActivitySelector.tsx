"use client";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import React from "react";

export function ActivitySelector({
  type,
  ActivityIcon,
  activityType,
  setActivityType,
}: {
  type: string;
  ActivityIcon: LucideIcon;
  activityType: "email" | "call" | "message" | "comment";
  setActivityType: (type: "email" | "call" | "message" | "comment") => void;
}) {
  return (
    <div className="flex-1">
      <Button
        key={type}
        variant={activityType === type ? "default" : "outline"}
        size="icon"
        onClick={() =>
          setActivityType(type as "email" | "call" | "message" | "comment")
        }
        type="button"
      >
        <ActivityIcon className="size-4" />
        <span className="sr-only">{type}</span>
      </Button>
    </div>
  );
}
