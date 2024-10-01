import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlignLeft,
  CircleEllipsis,
  Clock,
  FileText,
  MessageCircle,
  SquareCheckBig,
} from "lucide-react";
import { Button } from "../ui/button";
import { BasicInfoTimelineItem } from "./BasicInfoTimelineItem";
import { NewActivityForm } from "../forms/NewActivityForm";
import { Account, Contact, ContactEmail, ContactPhone } from "@database/types";

export default function TopTabs({
  account,
  accountContacts,
}: {
  account: Account;
  accountContacts: Contact[];
}) {
  return (
    <Tabs
      defaultValue="timeline"
      className="w-[70%] px-1"
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
