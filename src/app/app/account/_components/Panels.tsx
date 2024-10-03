import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";
import { cn } from "@/utils/tailwind";
import { MessageCircle, Clock, CheckSquare, AlignLeft } from "lucide-react";
import React from "react";

export function Panels({ className }: { className?: string }) {
  return (
    <section className={cn(className)}>
      <CustomTabs defaultValue="activity" className="w-full">
        <CustomTabsList className="select-none">
          <CustomTabsTrigger value="activity">
            <Clock size={14} /> Activity
          </CustomTabsTrigger>
          <CustomTabsTrigger value="tasks">
            <CheckSquare size={14} /> Tasks
          </CustomTabsTrigger>
          <CustomTabsTrigger value="analysis">
            <AlignLeft size={14} /> Analysis
          </CustomTabsTrigger>
          <CustomTabsTrigger value="ai">
            <MessageCircle size={14} /> AI
          </CustomTabsTrigger>
        </CustomTabsList>
        <CustomTabsContent value="activity">
          <p>View all activity related to this account.</p>
        </CustomTabsContent>
        <CustomTabsContent value="tasks">
          <p>Manage tasks assigned to this account.</p>
        </CustomTabsContent>
        <CustomTabsContent value="analysis">
          <p>Analyze account performance and trends.</p>
        </CustomTabsContent>
        <CustomTabsContent value="ai">
          <p>Explore AI-driven insights for this account.</p>
        </CustomTabsContent>
      </CustomTabs>
    </section>
  );
}
