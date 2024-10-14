import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "./DealKanbanColumn";
import { DealDragData } from "./DealKanbanCard";

type DraggableData = ColumnDragData | DealDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Deal") {
    return true;
  }

  return false;
}
