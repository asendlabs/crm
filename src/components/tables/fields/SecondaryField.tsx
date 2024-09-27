"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@database/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SecondaryFieldProps {
  getValue: () => any;
  row: any;
}

export function SecondaryField({ getValue, row }: SecondaryFieldProps) {
  const initialValue = getValue();
  const contacts = row.original.contacts;
  const id = row.original.id;
  const router = useRouter();

  return (
    <div
      className="select-none border-l border-gray-200 px-2 py-1 group min-w-36"
      onClick={() => router.push(`/app/leads/${id}`)}
    >
      <div className="flex items-center gap-1">
        {contacts && contacts.length > 0 ? (
          <Avatar className="h-6 w-6 rounded-lg bg-muted-foreground/20">
            <AvatarFallback className="bg-transparent">{contacts[0].contactName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          ""
        )}
        {contacts &&
          contacts.length > 0 &&
          contacts.map((contact: Contact, index: number) => (
            <p key={index} className="group-hover:underline ml-1">{contact.contactName}</p>
          ))}
      </div>
    </div>
  );
}
