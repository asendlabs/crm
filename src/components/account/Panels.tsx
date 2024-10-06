import { EntityActivityCard } from "@/components/activities/EntityActivityCard";
import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";
import { cn } from "@/utils/tailwind";
import { MessageCircle, Clock, CheckSquare, AlignLeft } from "lucide-react";
import React from "react";
import { ActivityPanel } from "./ActivityPanel";
import { TaskPanel } from "./TaskPanel";

export function Panels({ className }: { className?: string }) {
  return (
    <section className={cn(className)}>
      <CustomTabs defaultValue="activity" className="w-full">
        <CustomTabsList className="w-full select-none">
          <CustomTabsTrigger value="activity">
            <Clock size={14} /> Activity
          </CustomTabsTrigger>
          <CustomTabsTrigger value="tasks">
            <CheckSquare size={14} /> Tasks
          </CustomTabsTrigger>
          <CustomTabsTrigger value="analysis">
            <AlignLeft size={14} /> Analysis
          </CustomTabsTrigger>
        </CustomTabsList>
        <CustomTabsContent value="activity" className="w-full">
          <ActivityPanel />
        </CustomTabsContent>
        <CustomTabsContent value="tasks">
          <TaskPanel />
        </CustomTabsContent>
        <CustomTabsContent value="analysis">
          <p>Analyze account performance and trends.</p>
        </CustomTabsContent>
      </CustomTabs>
    </section>
  );
}
