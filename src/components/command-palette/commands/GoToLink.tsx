"use client";
import { CommandItem } from "@/components/ui/command";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";

interface GoToLinkProps {
  url: string;
  title: string;
  runCommandFunction: (command: () => void) => void;
}

export function GoToLink({ url, title, runCommandFunction }: GoToLinkProps) {
  const router = useRouter();
  return (
    <CommandItem
      className="flex gap-2"
      onSelect={() => runCommandFunction(() => router.push(url))}
    >
      <ArrowUpRight className="!size-[1.5rem] rounded-md border p-1" />
      <span>Go to {title.toLowerCase()}</span>
    </CommandItem>
  );
}
