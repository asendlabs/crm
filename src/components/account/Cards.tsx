"use client";
import React, { useContext } from "react";
import { cn } from "@/utils/tailwind";
import { AccountContext } from "@/providers/accountProvider";
import { ContactCard } from "./ContactCard";
import { NewContactForm } from "@/components/forms/NewContactForm";
import { NewDealForm } from "@/components/forms/NewDealForm";
import { DealCard } from "./DealCard";
import { DetailsCard } from "./DetailsCard";
export function Cards({ className }: { className?: string }) {
  const { contacts, deals, account } = useContext(AccountContext);
  return (
    <section
      className={cn(
        className,
        "flex !max-h-full flex-col justify-start overflow-y-auto border-r",
      )}
    >      <section className="rounded-lg">
        <DetailsCard />
      </section>      <section className="grid gap-2 px-4 py-3 border-b">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Deals</span>
          <NewDealForm accountId={account?.id} />
        </div>
        <div className="grid max-h-40 h-40 gap-1.5 overflow-hidden hover:overflow-y-auto">
          {deals?.length ? (
            deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <span className="pb-5 pt-4 text-center text-sm">
              No deals found.
            </span>
          )}
        </div>
      </section>
      <section className="grid gap-2 border-b px-4   py-3">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Contacts</span>
          <NewContactForm accountId={account?.id} />
        </div>
        <div className="grid max-h-40 h-40 items-start gap-1.5 overflow-hidden overflow-y-auto">
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


    </section>
  );
}
