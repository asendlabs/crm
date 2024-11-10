import { cn } from "@/lib/utils/tailwind";
import { Hexagon } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-1 w-full min-w-1 items-center justify-center rounded-sm bg-black",
        className,
      )}
    >
      <Hexagon className="h-[85%] w-[85%] text-inherit" fill="#ffffff" />
    </div>
  );
}
