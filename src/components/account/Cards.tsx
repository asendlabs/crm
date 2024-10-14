"use client";
import React, { useContext } from "react";
import { cn } from "@/utils/tailwind";
import { AccountContext } from "@/providers/accountProvider";
import { ContactCard } from "./ContactCard";
import { NewContactForm } from "@/components/forms/NewContactForm";
import { NewDealForm } from "@/components/forms/NewDealForm";
import { DealCard } from "./DealCard";
import { DetailsCard } from "./DetailsCard";
import { ScrollArea } from "../ui/scroll-area";
export function Cards({ className }: { className?: string }) {
  const { contacts, deals, account } = useContext(AccountContext);
  return (
    <ScrollArea
      className={cn(
        className,
        "flex !max-h-full flex-col justify-start border-r",
      )}
    >
      {" "}
      <section className="rounded-lg">
        <DetailsCard />
      </section>{" "}
      <section className="flex flex-col gap-2 border-b px-4 py-3">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Deals</span>
          <NewDealForm accountId={account?.id} />
        </div>
        <div className="grid gap-2">
          {deals?.length ? (
            deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <span className="pb-5 pt-4 text-center text-sm">
              No deals found.
            </span>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-2 px-4 py-3">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Contacts</span>
          <NewContactForm accountId={account?.id} />
        </div>
        <div className="gap-2 grid">
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
    </ScrollArea>
  );
}
