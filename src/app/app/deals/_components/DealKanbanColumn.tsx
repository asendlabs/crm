import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { DealKanbanCard } from "./DealKanbanCard";
import { cva } from "class-variance-authority";
import { Circle, MoreHorizontal } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import React from "react";
export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: DealStage;
}

interface DealKanbanColumnProps {
  column: DealStage;
  deals: DealWithPrimaryContact[];
  isOverlay?: boolean;
}

export function DealKanbanColumn({
  column,
  deals,
  isOverlay,
}: DealKanbanColumnProps) {
  const dealsIds = useMemo(() => {
    return deals.map((deal) => deal.id);
  }, [deals]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.stage,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.stage}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "my-1 flex max-h-[86vh] min-h-[86vh] min-w-60 max-w-60 flex-shrink-0 cursor-pointer snap-center flex-col",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "opacity-30 ring-1 ring-muted-foreground/60",
          overlay: "ring-1 ring-primary",
        },
      },
    },
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      // Uncomment these lines to enable column drag and drop
      // {...attributes}
      // {...listeners}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <section className="flex items-center justify-start rounded-lg border px-2 py-[0.3rem]">
        <div
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: `#${column.color}` }}
        >
          <Circle className="h-3 w-3" strokeWidth={3} />
          {column.stage}
        </div>
        {/* <div>
          <MoreHorizontal className="size-4 text-gray-500" />
        </div> */}
      </section>
      <div className="flex max-h-full flex-col gap-2 overflow-y-auto pt-2">
        <SortableContext items={dealsIds}>
          {deals.map((deal) => (
            <DealKanbanCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function DealKanbanColumnContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dndContext = useDndContext();

  const variations = cva("-pl-2 flex", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-row items-center gap-3">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
