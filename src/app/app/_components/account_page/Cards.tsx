"use client";
import React, { useContext, useState } from "react";
import { cn } from "@/lib/utils/tailwind";
import { AccountContext } from "@/providers/accountProvider";
import { ContactCard } from "./cards/ContactCard";
import { NewContactForm } from "@/app/app/_components/forms/NewContactForm";
import { NewDealForm } from "@/app/app/_components/forms/NewDealForm";
import { DealCard } from "./cards/DealCard";
import { DetailsCard } from "./cards/DetailsCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQueryState } from "nuqs";
export function Cards({ className }: { className?: string }) {
  const { contacts, deals, account } = useContext(AccountContext);
  const [accordionOpen, setAccordionOpen] = useState(["deals", "contacts"]);

  return (
    <ScrollArea
      className={cn(
        className,
        "flex !max-h-full flex-col justify-start border-r",
      )}
    >
      <section className="rounded-lg">
        <DetailsCard />
      </section>{" "}
      <Accordion
        type="multiple"
        value={accordionOpen}
        onValueChange={setAccordionOpen}
      >
        <AccordionItem className="flex flex-col px-4" value="contacts">
          <AccordionTrigger className="relative flex select-none items-center justify-between">
            <span className="text-sm font-medium">contacts</span>
            <div className="absolute right-6">
              {/* TODO: fix button can't be descendant of AccordionTrigger */}
              <NewContactForm accountId={account?.id} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid gap-2">
            {contacts?.length ? (
              contacts?.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            ) : (
              <span />
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deals" className="flex flex-col border-b px-4">
          <AccordionTrigger className="relative flex select-none items-center justify-between">
            <span className="text-sm font-medium">deals</span>
            <div className="absolute right-6">
              {/* TODO: fix button can't be descendant of AccordionTrigger */}
              <NewDealForm accountId={account?.id} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid gap-2 !p-0 !pb-4">
            {deals?.length ? (
              deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <span />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}
