"use client";
import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";
import { cn } from "@/lib/utils/tailwind";
import { Clock, CheckSquare } from "lucide-react";
import React, { useEffect } from "react";
import { ActivityPanel } from "./panels/activities";
import { TaskPanel } from "./panels/tasks";
import { useRouter } from "@/hooks/use-performance-router";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

type Panels = "activity" | "tasks";

export function Panels({ className }: { className?: string }) {
  const [panel, setPanel] = useQueryState("panel");

  useEffect(() => {
    if (!panel) setPanel("activity");
  }, []);

  return (
    <section className={cn(className)}>
      <CustomTabs
        value={panel ?? "activity"}
        onValueChange={setPanel} // Cast `value` as `Panels`
        className="w-full"
      >
        <CustomTabsList className="w-full select-none">
          <CustomTabsTrigger
            value="activity"
            className="flex items-center gap-2"
          >
            <Clock size={14} /> Activity
          </CustomTabsTrigger>
          <CustomTabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare size={14} /> Tasks
          </CustomTabsTrigger>
        </CustomTabsList>
        <CustomTabsContent value="activity" className="w-full">
          <ActivityPanel />
        </CustomTabsContent>
        <CustomTabsContent value="tasks">
          <TaskPanel />
        </CustomTabsContent>
      </CustomTabs>
    </section>
  );
}
