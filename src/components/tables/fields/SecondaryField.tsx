"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact, Account } from "@database/types";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";

interface SecondaryFieldProps {
  row: Row<any>;
}

export function SecondaryField({ row }: SecondaryFieldProps) {
  const derivedRow = row.original;
  const { id, account, contacts } = derivedRow;

  const renderAccount = () => (
    <div className="flex items-center gap-1">
      <Avatar className="h-6 w-6 rounded-lg bg-muted-foreground/20">
        <AvatarFallback className="bg-transparent">
          {account?.accountName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="ml-1 max-w-[6rem] truncate group-hover:underline">
        {account?.accountName}
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
            <Avatar className="h-6 w-6 rounded-lg bg-muted-foreground/20">
              <AvatarFallback className="bg-transparent">
                {visibleContact.contactName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
    <div className="group select-none border-l border-border px-2 py-1">
      <Link
        href={`/app/account/${id?.toLowerCase() ?? ""}`}
        replace={false}
        prefetch={true}
      >
        <div className="flex items-center gap-2">
          {contacts && contacts.length > 0 ? renderContacts() : renderAccount()}
        </div>
      </Link>
    </div>
  );
}
