"use client";
import { CommandItem } from "@/components/ui/command";
import { LucideIcon } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";

interface CustomIconLinkProps {
  url: string;
  title: string;
  Icon: LucideIcon;
  runCommandAction: (command: () => void) => void;
}

export function CustomIconLink({
  url,
  title,
  runCommandAction,
  Icon,
}: CustomIconLinkProps) {
  const router = useRouter();
  return (
    <CommandItem
      className="flex gap-2"
      onSelect={() => runCommandAction(() => router.push(url))}
    >
      <Icon className="!size-[1.5rem] rounded-md border p-1" />
      <span>{title}</span>
    </CommandItem>
  );
}
