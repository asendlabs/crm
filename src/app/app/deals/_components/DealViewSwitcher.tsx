import { Views } from "@/providers/dealsViewProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind";
import { SquareKanban as Board, Table as Grid } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";
import { revalidatePath } from "next/cache";

interface DealViewSwitcherProps {
  view: Views;
  setView: (view: Views) => void;
}

export function DealViewSwitcher({ view, setView }: DealViewSwitcherProps) {
  const gridActive = view === "grid";
  const boardActive = view === "board";
  const router = useRouter({
    fancy: true,
  });
  return (
    <div>
      <div className="flex h-8 items-center rounded-lg ring-1 ring-border">
        <Button
          variant="ghost"
          className={cn(
            "flex h-8 w-fit min-w-8 items-center gap-1 rounded-lg !border-none !bg-transparent p-0 text-sm",
            boardActive && "!bg-muted-foreground/10 !px-2.5",
          )}
          onClick={() => {
            setView("board");
            router.push("?view=board");
          }}
        >
          <Board className="size-4" />
          {boardActive && <>board</>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex h-8 w-fit min-w-8 items-center gap-1 rounded-lg !border-none !bg-transparent p-0 text-sm",
            gridActive && "!bg-muted-foreground/10 !px-2.5",
          )}
          onClick={() => {
            setView("grid");
            router.push("?view=grid");
          }}
        >
          <Grid className="size-4" />
          {gridActive && <>grid</>}
        </Button>
      </div>
    </div>
  );
}
