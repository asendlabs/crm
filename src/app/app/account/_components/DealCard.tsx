import { Card } from "@/components/ui/card";
import { DealWithPrimaryContact } from "@/types/entities";
import { formatDate } from "@/utils";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { ContactCard } from "./ContactCard";

export function DealCard({ deal }: { deal: DealWithPrimaryContact }) {
  return (
    <Card key={deal.id} className="grid cursor-pointer">
      <div className="flex items-center justify-between p-2">
        <div>
          <h1 className="flex gap-1 font-light">
            <span className="max-w-[7rem] truncate !font-semibold">
              {deal.title}
            </span>
            (<span className="max-w-[7rem] truncate">${deal.value}</span>)
          </h1>
          <p className="text-xs text-gray-700">
            {deal.probability && (
              <>
                <span className="font-medium">{deal.probability}%</span>{" "}
                probability on{" "}
              </>
            )}
            <span className="font-medium">
              {formatDate(deal?.expectedCloseDate) ?? "\u3164"}
            </span>
          </p>
        </div>
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 hover:bg-gray-200">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      {deal.primaryContact && <ContactCard contact={deal?.primaryContact} />}
    </Card>
  );
}
