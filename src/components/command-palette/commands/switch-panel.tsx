"use client";
import { CommandItem } from "@/components/ui/command";
import { useRouter } from "@/hooks/use-performance-router";
import { LucideIcon } from "lucide-react";

interface SwitchPanelCommandProps {
  panel: string;
  PanelIcon: LucideIcon;
  runCommandAction: (command: () => void) => void;
}

export function SwitchPanelCommand({
  runCommandAction,
  PanelIcon,
  panel,
}: SwitchPanelCommandProps) {
  const router = useRouter();
  return (
    <CommandItem
      className="flex gap-2"
      onSelect={() =>
        runCommandAction(() => {
          router.replace(`?panel=${panel}`);
        })
      }
    >
      <PanelIcon className="!size-[1.5rem] rounded-md border p-1" />
      <span>Switch to {panel} Panel</span>
    </CommandItem>
  );
}
