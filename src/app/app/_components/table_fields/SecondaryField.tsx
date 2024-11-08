"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact, Account } from "@database/types";
import { Row } from "@tanstack/react-table";
import Link from "@/components/performance-link";
import React from "react";
import { cn } from "@/lib/utils/tailwind";

interface SecondaryFieldProps {
  row: Row<any>;
  urlType: string;
  accountId: string;
  entityId?: string;
  entityType?: string;
  showAvatar?: boolean;
}

export function SecondaryField({
  row,
  urlType,
  accountId,
  entityId,
  entityType,
  showAvatar = true,
}: SecondaryFieldProps) {
  const derivedRow = row.original;
  const { account, contacts } = derivedRow;

  const searchParams = showAvatar
    ? entityType + "=" + (contacts?.[0]?.id ? contacts?.[0]?.id : entityId)
    : "";

  const renderEmpty = () => {
    return (
      <div className="flex items-center gap-1 py-0.5 text-slate-400">-</div>
    );
  };

  const renderAccount = () => (
    <div className="flex items-center gap-1">
      {showAvatar && (
        <Avatar className="size-6 rounded-lg bg-muted-foreground/20">
          <AvatarFallback className="bg-transparent">
            {account?.accountName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <p className="ml-1 max-w-[6rem] truncate group-hover:underline">
        {entityId ? row.original.title : account?.accountName}
      </p>
    </div>
  );

  const renderContacts = () => {
    const visibleContact = contacts[0];
    const hiddenContactsCount = contacts.length - 1;

    return (
      <>
        {visibleContact && (
          <div className="flex items-center gap-1">
            {showAvatar && (
              <Avatar className="size-6 rounded-lg bg-muted-foreground/20">
                <AvatarFallback className="bg-transparent">
                  {visibleContact.contactName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <p className="ml-1 max-w-[6rem] truncate group-hover:underline">
              {visibleContact.contactName}
            </p>
          </div>
        )}
        {hiddenContactsCount > 0 && (
          <p className="ml-1 flex text-gray-500">+{hiddenContactsCount} more</p>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        "group select-none border-border px-2 py-1",
        showAvatar && "border-l",
        !showAvatar && "px-1",
      )}
    >
      <Link
        href={`/app/${urlType}s/${accountId?.toLowerCase() ?? ""}?${searchParams}`}
        replace={false}
        prefetch={true}
      >
        <div className="flex items-center gap-2">
          {contacts && contacts.length > 0
            ? renderContacts()
            : account
              ? renderAccount()
              : renderEmpty()}
        </div>
      </Link>
    </div>
  );
}
