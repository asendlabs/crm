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
import { useSearchParams } from "next/navigation";

type Panels = "activity" | "tasks";

export function Panels({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPanel = (searchParams.get("panel") as Panels) || "activity";

  const [panelState, setPanelState] = React.useState<Panels>(initialPanel);

  useEffect(() => {
    setPanelState(initialPanel);
  }, [initialPanel]);

  useEffect(() => {
    router.push(`?panel=${panelState}`);
  }, [panelState]);

  return (
    <section className={cn(className)}>
      <CustomTabs
        value={panelState}
        onValueChange={(value) => setPanelState(value as Panels)} // Cast `value` as `Panels`
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
