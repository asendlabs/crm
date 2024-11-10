"use client";
import { CommandItem } from "@/components/ui/command";
import { useRouter } from "@/hooks/use-performance-router";
import { useSearchParams } from "next/navigation";
import { SquareKanban as Board, Table as Grid } from "lucide-react";

interface ShowInViewCommandProps {
  runCommandAction: (command: () => void) => void;
}

export function ShowInViewCommand({
  runCommandAction,
}: ShowInViewCommandProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const existingView = searchParams.get("view");
  const existingViewIsBoard = existingView === "board";

  return existingView ? (
    <CommandItem
      className="flex gap-2"
      onSelect={() =>
        runCommandAction(() => {
          router.push(`?view=${existingViewIsBoard ? "grid" : "board"}`);
        })
      }
    >
      {existingViewIsBoard ? (
        <Grid className="p1 !size-[1.5rem] rounded-md border" />
      ) : (
        <Board className="p1 !size-[1.5rem] rounded-md border" />
      )}
      <span>Show in {existingViewIsBoard ? "grid" : "board"} view</span>
    </CommandItem>
  ) : (
    <></>
  );
}
