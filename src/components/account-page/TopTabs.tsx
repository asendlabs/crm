import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft  , CircleEllipsis, Clock, FileText, MessageCircle, SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";

export default function TopTabs() {
  return (
    <Tabs
      defaultValue="timeline"
      className="w-[80%] p-1"
      orientation="horizontal"
    >
      <TabsList className="w-full rounded-lg border bg-muted">
        <TabsTrigger
          value="timeline"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <Clock size={16} />
          <span>Timeline</span>
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <FileText size={16} />
          <span>Notes</span>
        </TabsTrigger>
        <TabsTrigger
          value="tasks"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <SquareCheckBig size={16} />
          <span>Tasks</span>
        </TabsTrigger>
        <TabsTrigger
          value="chat"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <MessageCircle size={16} />
          <span>Chat</span>
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <AlignLeft size={16} />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger
          value="analyze"
          className="flex w-full items-center gap-2 px-3 py-1.5"
        >
          <CircleEllipsis size={16} />
          <span>Details</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timeline">
        <div className="mt-2">Content for Timeline tab</div>
      </TabsContent>
      <TabsContent value="notes">
        <div className="mt-2">Content for Notes tab</div>
      </TabsContent>
      <TabsContent value="chat">
        <div className="mt-2">Content for Chat tab</div>
      </TabsContent>
      <TabsContent value="tasks">
        <div className="mt-2">Content for Tasks tab</div>
      </TabsContent>
    </Tabs>
  );
}
