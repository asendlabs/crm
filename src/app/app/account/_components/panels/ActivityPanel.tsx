"use client";
import { EntityActivityCard } from "@/components/activities/EntityActivityCard";
import { NewActivityForm } from "@/components/forms/NewActivityForm";
import { Button } from "@/components/ui/button";
import { AccountContext } from "@/providers/accountProvider";
import { ActivityType } from "@/types/entities";
import {
  LucideIcon,
  Mail,
  MailPlus,
  MessageSquare,
  MessageSquarePlus,
  Phone,
  PhoneCall,
  Plus,
  PlusCircle,
} from "lucide-react";
import { useContext, useState } from "react";
import React from "react";

type ActivityButton = {
  type: ActivityType;
  icon: LucideIcon;
  label: string;
};

const activityButtons: ActivityButton[] = [
  {
    type: "comment",
    icon: PlusCircle,
    label: "Comment",
  },
  {
    type: "message",
    icon: MessageSquare,
    label: "Message",
  },
  {
    type: "call",
    icon: PhoneCall,
    label: "Call",
  },
  {
    type: "email",
    icon: MailPlus,
    label: "Email",
  },
];

export function ActivityPanel() {
  const { activities } = useContext(AccountContext);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>("comment");
  return (
    <section className="grid w-full gap-3">
      <section className="absolute right-5 top-[4.12rem]">
        <div className="flex gap-2">
          {/* <Button
            className="inline-flex !h-fit !max-h-fit gap-1.5 px-1.5 py-1"
            variant={"outline"}
          >
            <PhoneCall size={14} />
            Log Call
          </Button> */}
          {activityButtons.map((button) => (
            <Button
              key={button.type}
              className="inline-flex !h-fit !max-h-fit gap-1.5 px-1.5 py-1"
              variant={"outline"}
              onClick={() => {
                if (activityFormOpen) {
                  setActivityFormOpen(false);
                } else if (button.type !== "email") {
                  setActivityType(button.type);
                  setActivityFormOpen(true);
                } else return;
              }}
            >
              <button.icon size={14} />
              {button.label}
            </Button>
          ))}
        </div>
      </section>
      {activityFormOpen && (
        <NewActivityForm
          activityType={activityType}
          setActivityFormOpen={setActivityFormOpen}
        />
      )}
      <div
        className={`grid ${activityFormOpen ? "max-h-[70vh]" : "max-h-[81vh]"} gap-1.5 overflow-y-auto pr-3`}
      >
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
    </section>
  );
}
