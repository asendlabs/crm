"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DealKanbanColumn,
  DealKanbanColumnContainer,
} from "./DealKanbanColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DealKanbanCard } from "./DealKanbanCard";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import { changeDealStageAction } from "@/server/deal";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Router } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";
import { int } from "drizzle-orm/mysql-core";

export type ColumnId = string;

export function DealKanbanBoard({
  initialDeals,
  defaultCols,
}: {
  initialDeals: DealWithPrimaryContact[];
  defaultCols: DealStage[];
}) {
  const [columns, setColumns] = useState<DealStage[]>(defaultCols);
  const pickedUpDealColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.stage), [columns]);
  const [dragEnd, setDragEnd] = useState<boolean>(false);
  const [deals, setDeals] = useState<DealWithPrimaryContact[]>(initialDeals);
  const [activeColumn, setActiveColumn] = useState<DealStage | null>(null);
  const [originalStage, setOriginalStage] = useState<DealStage | null>(null);
  const [activeDeal, setActiveDeal] = useState<DealWithPrimaryContact | null>(
    null,
  );
  const { execute } = useServerAction(changeDealStageAction);
  const { refresh } = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This effect will only run when `activeDeal?.stage` changes, ensuring it only triggers when necessary.

  useEffect(() => {
    if (!activeDeal || !dragEnd) return;

    // Check if the stage actually changed
    if (activeDeal.stage !== originalStage) {
      execute({ dealId: activeDeal.id, newStage: activeDeal.stage }).then(
        ([data, err]) => {
          if (err) {
            toast.error(err.message);
            console.error("Failed to update deal stage:", err);
          }
        },
      );
    }
  }, [dragEnd]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    }),
  );

  function getDraggingDealData(dealId: UniqueIdentifier, columnId: ColumnId) {
    const dealsInColumn = deals.filter((deal) => deal.stage.stage === columnId);
    const dealPosition = dealsInColumn.findIndex((deal) => deal.id === dealId);
    const column = columns.find((col) => col.stage === columnId);
    return {
      dealsInColumn,
      dealPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.stage} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Deal") {
        pickedUpDealColumn.current = active.data.current.deal.stage.stage;
        const { dealsInColumn, dealPosition, column } = getDraggingDealData(
          active.id,
          pickedUpDealColumn.current,
        );
        return `Picked up Deal ${
          active.data.current.deal.title
        } at position: ${dealPosition + 1} of ${
          dealsInColumn.length
        } in column ${column?.stage}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.stage} was moved over ${
          over.data.current.column.stage
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Deal" &&
        over.data.current?.type === "Deal"
      ) {
        const { dealsInColumn, dealPosition, column } = getDraggingDealData(
          over.id,
          over.data.current.deal.stage.stage,
        );
        if (over.data.current.deal.stage.stage !== pickedUpDealColumn.current) {
          return `Deal ${
            active.data.current.deal.title
          } was moved over column ${column?.stage} in position ${
            dealPosition + 1
          } of ${dealsInColumn.length}`;
        }
        return `Deal was moved over position ${dealPosition + 1} of ${
          dealsInColumn.length
        } in column ${column?.stage}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpDealColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.stage
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Deal" &&
        over.data.current?.type === "Deal"
      ) {
        const { dealsInColumn, dealPosition, column } = getDraggingDealData(
          over.id,
          over.data.current.deal.stage.stage,
        );
        if (over.data.current.deal.stage.stage !== pickedUpDealColumn.current) {
          return `Deal was dropped into column ${column?.stage} in position ${
            dealPosition + 1
          } of ${dealsInColumn.length}`;
        }
        return `Deal was dropped into position ${dealPosition + 1} of ${
          dealsInColumn.length
        } in column ${column?.stage}`;
      }
      pickedUpDealColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpDealColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Deal") {
      setActiveDeal(data.deal);
      setOriginalStage(data.deal.stage);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    setDragEnd(true);

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeData?.type === "Column") {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.stage === activeId,
        );

        const overColumnIndex = columns.findIndex(
          (col) => col.stage === overId,
        );

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    } else if (activeData?.type === "Deal") {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId);
        const overIndex = deals.findIndex((t) => t.id === overId);
        return arrayMove(deals, activeIndex, overIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveADeal = activeData?.type === "Deal";
    const isOverADeal = overData?.type === "Deal";

    if (!isActiveADeal) return;

    // Handle moving deals between columns
    if (isActiveADeal && isOverADeal) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId);
        const overIndex = deals.findIndex((t) => t.id === overId);
        const activeDeal = deals[activeIndex];
        const overDeal = deals[overIndex];

        if (activeDeal.stage.stage !== overDeal.stage.stage) {
          // If moving to a different column, update the stage
          activeDeal.stage = overDeal.stage;
        }

        return arrayMove(deals, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Handle dropping a deal directly onto a column
    if (isActiveADeal && isOverAColumn) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId);
        const activeDeal = deals[activeIndex];
        const newStage = columns.find((col) => col.stage === overId);

        if (
          activeDeal &&
          newStage &&
          activeDeal.stage.stage !== newStage.stage
        ) {
          activeDeal.stage = newStage;
          return [...deals];
        }

        return deals;
      });
    }
  }

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <DealKanbanColumnContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <DealKanbanColumn
              key={col.stage}
              column={col}
              deals={deals.filter((deal) => deal.stage.stage === col.stage)}
            />
          ))}
        </SortableContext>
      </DealKanbanColumnContainer>

      {isMounted &&
        document.body &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <DealKanbanColumn
                isOverlay
                key={activeColumn.stage}
                column={activeColumn}
                deals={deals.filter(
                  (deal) => deal.stage.stage === activeColumn.stage,
                )}
              />
            )}
            {activeDeal && <DealKanbanCard deal={activeDeal} isOverlay />}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
