"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact, Account, Opportunity } from "@database/types"; // Assuming these types exist
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";

interface SecondaryFieldProps {
  getValue: () => any;
  row: Row<any>;
  arrayName: string;
}

export function SecondaryField({
  getValue,
  row,
  arrayName,
}: SecondaryFieldProps) {
  const array = row.original[arrayName] as (Contact | Account | Opportunity)[];
  const id = row.original.id;

  return (
    <div className="group min-w-36 select-none border-l border-gray-200 px-2 py-1">
      <Link
        href={`/app/leads/${id?.toLowerCase() ?? ""}`}
        replace={false}
        prefetch={true}
      >
        <div className="flex items-center gap-1">
          {array && array.length > 0 ? (
            <Avatar className="h-6 w-6 rounded-lg bg-muted-foreground/20">
              <AvatarFallback className="bg-transparent">
                {"contactName" in array[0] &&
                  (array[0] as Contact).contactName.charAt(0).toUpperCase()}
                {"accountName" in array[0] &&
                  (array[0] as Account).accountName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            "\u3164"
          )}
          {array && array.length > 0
            ? array.map((item, index) => (
                <p key={index} className="ml-1 group-hover:underline">
                  {"contactName" in item && (item as Contact).contactName}
                  {"accountName" in item && (item as Account).accountName}
                </p>
              ))
            : "\u3164"}
        </div>
      </Link>
    </div>
  );
}
