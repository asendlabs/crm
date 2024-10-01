import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, Clock, MessageCircle, SquareCheckBig } from "lucide-react";
import { TaskActivityCard } from "../activities/TaskActivityCard";
import { NewActivityForm } from "../forms/NewActivityForm";
import { Account, Activity, Contact } from "@database/types";
import { EntityActivityCard } from "../activities/EntityActivityCard";

export default function TopTabs({
  account,
  accountContacts,
  accountActivities,
}: {
  account: Account;
  accountContacts: Contact[];
  accountActivities: Activity[];
}) {
  return (
    <Tabs
      defaultValue="timeline"
      className="w-full px-1"
      orientation="horizontal"
    >
      <TabsList className="w-fit rounded-lg border bg-muted">
        <TabsTrigger
          value="timeline"
          className="flex w-[6.5rem] items-center gap-2 px-3 py-1.5"
        >
          <Clock size={16} />
          <span>Timeline</span>
        </TabsTrigger>
        <TabsTrigger
          value="tasks"
          className="flex w-[5.4rem] items-center gap-2 px-3 py-1.5"
        >
          <SquareCheckBig size={16} />
          <span>Tasks</span>
        </TabsTrigger>
        <TabsTrigger
          value="analysis"
          className="flex w-[7rem] items-center gap-2 px-3 py-1.5"
        >
          <AlignLeft size={16} />
          <span>Analysis</span>
        </TabsTrigger>
        <TabsTrigger
          value="ai"
          className="flex w-16 items-center gap-2 px-3 py-1.5"
        >
          <MessageCircle size={16} />
          <span>AI</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timeline" className="grid gap-1 px-1 py-2">
        <NewActivityForm account={account} contacts={accountContacts} />
        <div className="grid gap-1 px-1 py-2">
          <div className="grid grid-cols-1 gap-2 py-2">
            {accountActivities.length > 0 &&
              accountActivities
                .filter((activity) => activity.isEntityActivity)
                .map((activity) => (
                  <EntityActivityCard
                    entitiyType={activity?.entityType ?? "unknown"} // Fallback to "unknown" if null or undefined
                    activityType={
                      activity?.activityType ?? "defaultActivityType"
                    } // Fallback value
                    entityTitle={activity?.entityTitle ?? "Untitled"} // Fallback to "Untitled" if null or undefined
                    createdAt={activity?.createdAt ?? "N/A"} // Fallback to "N/A" if null or undefined
                  />
                ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="anaylsis" className="grid gap-1 px-1 py-2">
        <div className="">Content for analysis tab</div>
      </TabsContent>
      <TabsContent value="ai" className="grid gap-1 px-1 py-2">
        <div className="">Content for ai tab</div>
      </TabsContent>
      <TabsContent value="tasks" className="grid gap-1 px-1 py-2">
        <div className="">Content for Tasks tab</div>
      </TabsContent>
    </Tabs>
  );
}
