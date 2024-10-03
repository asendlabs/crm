"use client";
import React, { useContext } from "react";
import { AccountContext } from "@/providers/accountProvider";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { cn } from "@/utils/tailwind";

export function Header({ className }: { className?: string }) {
  const { account } = useContext(AccountContext);
  return (
    <section
      className={cn(
        "flex items-center justify-between border-b border-border",
        className,
      )}
    >
      <div className="text-lg">
        <Link
          className="capitalize opacity-70 hover:opacity-90"
          href={`/app/${account?.type}s/`}
        >
          {account?.type}
        </Link>
        {" / "}
        <span className="font-medium">{account?.accountName}</span>
      </div>
      <Button className="h-7">Convert to Client</Button>
    </section>
  );
}
