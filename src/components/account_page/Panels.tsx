"use client";
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
import { useRouter } from "@/hooks/use-performance-router";

export function Panels({
  className,
  tab,
}: {
  className?: string;
  tab: string | undefined;
}) {
  const router = useRouter({
    fancy: false,
  });
  return (
    <section className={cn(className)}>
      <CustomTabs defaultValue={tab || "activity"} className="w-full">
        <CustomTabsList className="w-full select-none">
          <div onClick={() => router.push("?tab=activity")}>
            <CustomTabsTrigger value="activity">
              <Clock size={14} /> Activity
            </CustomTabsTrigger>
          </div>
          <div onClick={() => router.push("?tab=tasks")}>
            <CustomTabsTrigger value="tasks">
              <CheckSquare size={14} /> Tasks
            </CustomTabsTrigger>
          </div>
          <div onClick={() => router.push("?tab=analysis")}>
            <CustomTabsTrigger value="analysis">
              <AlignLeft size={14} /> Analysis
            </CustomTabsTrigger>
          </div>
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
