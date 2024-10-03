"use client";
import { EntityActivityCard } from "@/components/activities/EntityActivityCard";
import { AccountContext } from "@/providers/accountProvider";
import { useContext } from "react";
import React from "react";

export function ActivityPanel() {
  const { activities } = useContext(AccountContext);
  return (
    <div className="grid max-h-[80vh] gap-1.5 overflow-y-scroll pr-5">
      {activities &&
        activities?.length > 0 &&
        activities.reverse().map((activity) => {
          if (activity.isEntityActivity) {
            if (activity.activityType === "entity_creation") {
              return (
                <EntityActivityCard
                  activityType="entity_creation"
                  key={activity.id}
                  createdAt={activity.createdAt || ""}
                  entitiyType={activity.entityType || ""}
                  entityTitle={activity.entityTitle || ""}
                />
              );
            }
            if (activity.activityType === "entity_deletion") {
              return (
                <EntityActivityCard
                  activityType="entity_deletion"
                  key={activity.id}
                  createdAt={activity.createdAt || ""}
                  entitiyType={activity.entityType || ""}
                  entityTitle={activity.entityTitle || ""}
                />
              );
            }
          }
        })}
    </div>
  );
}
