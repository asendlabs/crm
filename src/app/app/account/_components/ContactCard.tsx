import { Card } from "@/components/ui/card";
import { ContactWithDetails } from "@/types/entities";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";

export function ContactCard({ contact }: { contact: ContactWithDetails }) {
  return (
    <Card key={contact.id} className="cursor-pointer">
      <div className="flex w-full justify-between px-2 py-1 text-sm">
        <div className="flex items-center gap-2">
          <h1 className="max-w-[5rem] truncate">{contact.contactName}</h1>
          <div className="flex">
            <button
              className="rounded-y flex h-6 w-7 items-center justify-center rounded-l border-y border-l border-gray-200 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${contact.contactPhone?.countryCode ?? ""}${contact.contactPhone?.phoneNumber ?? ""}`;
              }}
            >
              <PhoneIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded-y flex h-6 w-7 items-center justify-center rounded-r border-y border-r border-gray-200 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${contact.contactEmail?.email ?? ""}`;
              }}
            >
              <MailIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-200 hover:bg-gray-200">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
