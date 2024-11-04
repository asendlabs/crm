"use client";
import { cn } from "@/lib/utils/tailwind";
import {
  Building2,
  CircleUser,
  CreditCard,
  Eye,
  LucideIcon,
  Palette,
  SunMoon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface Item {
  label: string;
  href: string;
  icon: LucideIcon;
}

const allItems: Item[] = [
  {
    label: "account",
    href: "/app/settings/account",
    icon: CircleUser,
  },
  {
    label: "workspace",
    href: "/app/settings/workspace",
    icon: Building2,
  },
  {
    label: "billing",
    href: "/app/settings/billing",
    icon: CreditCard,
  },
  {
    label: "appearance",
    href: "/app/settings/appearance",
    icon: Palette,
  },
];

export function SidebarItem({
  label,
}: {
  label: "account" | "billing" | "appearance" | "workspace";
}) {
  const pathname = usePathname();
  const currentItem = allItems.find((item) => item.label === label);
  if (!currentItem) return <></>;
  // toast.info(`pathname: ${pathname}, currentItem.href: ${currentItem.href}`);
  const active = pathname === currentItem.href;
  return (
    <Link
      href={currentItem.href}
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg p-1.5 text-sm font-medium capitalize hover:bg-sidebar-accent",
        active && "!bg-muted/70",
      )}
    >
      <currentItem.icon className="size-4" />
      {currentItem.label}
    </Link>
  );
}
