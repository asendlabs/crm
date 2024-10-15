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
import { useSearchParams } from "next/navigation";
export function Cards({ className }: { className?: string }) {
  const { contacts, deals, account } = useContext(AccountContext);
  const searchParams = useSearchParams();

  const openContactId = searchParams.get("contact");
  const openDealId = searchParams.get("deal");

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
      <section className="flex flex-col gap-2 border-b px-4 pb-6 pt-4">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Deals</span>
          <NewDealForm accountId={account?.id} />
        </div>
        <div className="grid gap-2">
          {deals?.length ? (
            deals?.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isOpen={openDealId === deal.id}
              />
            ))
          ) : (
            <span />
          )}
        </div>
      </section>
      <section className="flex flex-col gap-2 px-4 py-5">
        <div className="flex select-none items-center justify-between">
          <span className="font-medium">Contacts</span>
          <NewContactForm accountId={account?.id} />
        </div>
        <div className="grid gap-2">
          {contacts?.length ? (
            contacts?.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isOpen={openContactId === contact.id}
              />
            ))
          ) : (
            <span />
          )}
        </div>
      </section>
    </ScrollArea>
  );
}
