import { ContactWithDetails, DealStage } from "@/types/entities";
import { DealWithPrimaryContact } from "@/types/entities";
import { Circle, GripHorizontal, Plus } from "lucide-react";
import React from "react";
import { DealKanbanItem } from "./DealKanbanItem";

interface Props {
  dealStage: DealStage;
  deals: DealWithPrimaryContact[];
  setProvidedDeals: (deals: DealWithPrimaryContact[]) => void;
}

export function DealKanbanColumn({ dealStage, deals}: Props) {
  return (
    <section className="flex w-full min-w-64 max-w-64 flex-col gap-2">
        <section className="flex items-center justify-between border-b pr-8">
          <div
            className="flex items-center gap-1.5 py-1.5 text-sm font-medium"
            style={{ color: `#${dealStage.color}` }}
          >
            <Circle className="h-3 w-3" strokeWidth={3} />
            {dealStage.stage}
          </div>
          <div>
            <GripHorizontal className="h-4 w-4 text-gray-500" />
          </div>
        </section>
        <section className="first flex flex-col gap-2 mr-8">
          {deals
            .filter(
              (deal: DealWithPrimaryContact) =>
                deal.stage.stage === dealStage.stage,
            )
            .map((deal: DealWithPrimaryContact) => (
              <DealKanbanItem key={deal.id} deal={deal}/>
            ))}
        </section>
    </section>
  );
}
