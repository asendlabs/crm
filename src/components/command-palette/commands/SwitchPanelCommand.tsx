"use client";
import { CommandItem } from "@/components/ui/command";
import { useRouter } from "@/hooks/use-performance-router";
import { LucideIcon } from "lucide-react";

interface SwitchPanelCommandProps {
  panel: string;
  PanelIcon: LucideIcon;
  runCommandFunction: (command: () => void) => void;
}

export function SwitchPanelCommand({
  runCommandFunction,
  PanelIcon,
  panel,
}: SwitchPanelCommandProps) {
  const router = useRouter();
  return (
    <CommandItem
      className="flex gap-2"
      onSelect={() =>
        runCommandFunction(() => {
          router.replace(`?panel=${panel}`);
        })
      }
    >
      <PanelIcon className="!size-[1.5rem] rounded-md border p-1" />
      <span>Switch to {panel} panel</span>
    </CommandItem>
  );
}
