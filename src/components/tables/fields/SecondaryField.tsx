"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact, Account, Deal } from "@database/types"; // Assuming these types exist
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
  const array = row.original[arrayName] as (Contact | Account | Deal)[];
  const id = row.original.id;

  // Get first two items to display and the remaining items for truncation
  const visibleItems = (array && array.length > 0 && array.slice(0, 1)) || [];
  const hiddenItemsCount =
    (array && array.length > 1 && array.length - 1) || null;

  return (
    <div className="group select-none border-l border-border px-2 py-1">
      <Link
        href={`/app/leads/${id?.toLowerCase() ?? ""}`}
        replace={false}
        prefetch={true}
      >
        <div className="flex items-center gap-2">
          {array && array.length > 0 ? (
            <>
              {visibleItems &&
                visibleItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Avatar className="h-6 w-6 rounded-lg bg-muted-foreground/20">
                      <AvatarFallback className="bg-transparent">
                        {"contactName" in item &&
                          (item as Contact).contactName.charAt(0).toUpperCase()}
                        {"accountName" in item &&
                          (item as Account).accountName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="ml-1 max-w-[5rem] truncate group-hover:underline">
                      {"contactName" in item && (item as Contact).contactName}
                      {"accountName" in item && (item as Account).accountName}
                    </p>
                  </div>
                ))}
              {hiddenItemsCount && hiddenItemsCount > 0 && (
                <p className="ml-1 flex text-gray-500">
                  +{hiddenItemsCount} more
                </p>
              )}
            </>
          ) : (
            <span>{"\u3164"}</span> // Empty space if no items are present
          )}
        </div>
      </Link>
    </div>
  );
}
