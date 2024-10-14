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
import { useRouter } from "next/navigation";

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

  const [deals, setDeals] = useState<DealWithPrimaryContact[]>(initialDeals);

  const [activeColumn, setActiveColumn] = useState<DealStage | null>(null);

  const [activeDeal, setActiveDeal] = useState<DealWithPrimaryContact | null>(
    null,
  );

  const { execute } = useServerAction(changeDealStageAction);

  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only set `isMounted` to true when on the client-side
    setIsMounted(true);
  }, []);

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

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Deal") {
      setActiveDeal(data.deal);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveDeal(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.stage === activeId,
      );

      const overColumnIndex = columns.findIndex((col) => col.stage === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
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

    // Im dropping a Deal over another Deal
    if (isActiveADeal && isOverADeal) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId);
        const overIndex = deals.findIndex((t) => t.id === overId);
        const activeDeal = deals[activeIndex];
        const overDeal = deals[overIndex];
        if (
          activeDeal &&
          overDeal &&
          activeDeal.stage.stage !== overDeal.stage.stage
        ) {
          const newStage = overDeal.stage;
          execute({ dealId: activeDeal.id, newStage }).then(([data, err]) => {
            if (err) {
              console.error("Failed to update deal stage:", err);
              // You might want to show an error message to the user here
            }
            router.refresh();
          });
          activeDeal.stage = newStage;
          return arrayMove(deals, activeIndex, overIndex - 1);
        }

        return arrayMove(deals, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Deal over a column
    if (isActiveADeal && isOverAColumn) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId);
        const activeDeal = deals[activeIndex];
        if (activeDeal) {
          const newStage = columns.find((col) => col.stage === overId);
          if (newStage) {
            execute({ dealId: activeDeal.id, newStage }).then(([data, err]) => {
              if (err) {
                console.error("Failed to update deal stage:", err);
                // You might want to show an error message to the user here
              }
            });
            activeDeal.stage = newStage;
          }
          return arrayMove(deals, activeIndex, activeIndex);
        }
        return deals;
      });
    }
  }
}
