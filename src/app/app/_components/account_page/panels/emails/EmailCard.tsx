"use client";
import { Email } from "@database/types";
import { ArrowUpRight, Mail, MoreVertical } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { formatMinimal, timeAgo } from "@/lib/utils";

export function EmailCard({ email }: { email: Email }) {
  const [timestampHovered, setTimestampHovered] = React.useState(false);
  return (
    <section className="relative flex flex-col gap-1 rounded-lg border px-2 py-4 pt-3 text-sm">
      <div className="flex w-fit cursor-pointer gap-1 rounded-lg border px-2 font-medium">
        {email.fromName}{" "}
        <span className="text-gray-600 hover:text-blue-500 hover:underline">
          {`<${email.fromEmail}>`}
        </span>
      </div>
      <div className="h-fit w-3/4 truncate px-1">{email.snippet}</div>
      <div
        className="absolute right-3 top-2 cursor-pointer text-xs font-medium text-gray-600 hover:underline"
        onMouseOver={() => setTimestampHovered(true)}
        onMouseOut={() => setTimestampHovered(false)}
      >
        {timestampHovered ? (
          <span className="capitalize">
            {email?.emailTimestamp ? formatMinimal(email.emailTimestamp) : ""}
          </span>
        ) : email?.emailTimestamp ? (
          timeAgo(email.emailTimestamp.toString())
        ) : (
          ""
        )}
      </div>
      <div className="absolute bottom-3 right-3">
        <Button size="icon" variant="outline" className="h-6 w-7">
          <ArrowUpRight className="size-4 p-[0.05rem]" />
        </Button>
      </div>
    </section>
  );
}
