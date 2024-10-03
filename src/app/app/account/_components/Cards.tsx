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
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Contacts</span>
          <NewContactForm accountId={account?.id} />
        </div>
        <div className="grid max-h-48 gap-1.5 overflow-y-auto">
          {contacts?.length ? (
            contacts?.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))
          ) : (
            <span className="pb-5 pt-4 text-center text-sm">
              No contacts found.
            </span>
          )}
        </div>
      </section>
      <section className="grid gap-2 rounded-md border p-2.5">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Deals</span>
          <NewDealForm accountId={account?.id} />
        </div>
        <div className="grid max-h-56 gap-1.5 overflow-y-auto">
          {deals?.length ? (
            deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <span className="pb-5 pt-4 text-center text-sm">
              No deals found.
            </span>
          )}
        </div>
      </section>
    </section>
  );
}
