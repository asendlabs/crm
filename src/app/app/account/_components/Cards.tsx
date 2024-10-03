"use client";
import React, { useContext } from "react";
import { cn } from "@/utils/tailwind";
import { AccountContext } from "@/providers/accountProvider";
import { ContactCard } from "./cards/ContactCard";
import { NewContactForm } from "@/components/forms/NewContactForm";
import { NewDealForm } from "@/components/forms/NewDealForm";
import { DealCard } from "./cards/DealCard";
export function Cards({ className }: { className?: string }) {
  const { contacts, deals, account } = useContext(AccountContext);
  return (
    <section
      className={cn(
        className,
        "flex h-full flex-col justify-start gap-2 border-r",
      )}
    >
      <section className="grid gap-2 rounded-md border p-2.5">
        <div className="flex items-center justify-between">
          <span className="font-medium">Contacts</span>
          <NewContactForm accountId={account?.id} />
        </div>
        <div className="grid max-h-36 gap-1.5 overflow-y-scroll">
          {contacts?.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>
      <section className="grid gap-2 rounded-md border p-2.5">
        <div className="flex items-center justify-between">
          <span className="font-medium">Deals</span>
          <NewDealForm accountId={account?.id} />
        </div>
        <div className="grid max-h-36 gap-1.5 overflow-y-scroll">
          {deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      </section>
    </section>
  );
}
