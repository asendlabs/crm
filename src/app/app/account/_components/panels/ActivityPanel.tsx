"use client";
import { EntityActivityCard } from "@/components/activities/EntityActivityCard";
import { AccountContext } from "@/providers/accountProvider";
import { useContext } from "react";
import React from "react";

export function ActivityPanel() {
  const { activities } = useContext(AccountContext);
  return (
    <div className="grid max-h-[81vh] gap-1.5 overflow-y-auto pr-3">
      {activities &&
        activities?.length > 0 &&
        activities.reverse().map((activity) => {
          if (activity.isEntityActivity) {
            if (activity.activityType === "entity_creation") {
              return (
                <EntityActivityCard
                  activityId={activity.id}
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
                  activityId={activity.id}
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
