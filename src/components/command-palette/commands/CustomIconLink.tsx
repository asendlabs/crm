"use client";
import { CommandItem } from "@/components/ui/command";
import { LucideIcon } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";

interface CustomIconLinkProps {
  url: string;
  title: string;
  Icon: LucideIcon;
  runCommandFunction: (command: () => void) => void;
}

export function CustomIconLink({
  url,
  title,
  runCommandFunction,
  Icon,
}: CustomIconLinkProps) {
  const router = useRouter();
  return (
    <CommandItem
      className="flex gap-2"
      onSelect={() => runCommandFunction(() => router.push(url))}
    >
      <Icon className="!size-[1.5rem] rounded-md border p-1" />
      <span>
        {title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
      </span>
    </CommandItem>
  );
}
