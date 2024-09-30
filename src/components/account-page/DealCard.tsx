"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Account,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
} from "@database/types";
import { NewDealForm } from "../forms/NewDealForm";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
import { formatDate } from "@/utils";
import { DealDialog } from "../deals/DealDialog";

export function DealCard({
  deals,
  account,
}: {
  deals: Array<
    Deal & {
      contact: Contact & {
        contactPhone: ContactPhone;
        contactEmail: ContactEmail;
      };
    }
  >;
  account: Account;
}) {
  // State to manage dialog open and selected deal
  const [selectedDeal, setSelectedDeal] = useState<
    (Deal & { contact: Contact }) | null
  >(null);

  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <h1>Deals</h1>
        <NewDealForm accountId={account.id} />
      </div>
      <div className="flex flex-col gap-2 p-2">
        {deals.length > 0 ? (
          deals.map(
            (
              deal: Deal & {
                contact: Contact & {
                  contactPhone: ContactPhone;
                  contactEmail: ContactEmail;
                };
              },
            ) => (
              <Card
                key={deal.id}
                onClick={() => setSelectedDeal(deal)} // Set the selected deal on click
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between p-2">
                  <div>
                    <h1 className="flex gap-1 text-lg font-semibold">
                      {deal.title}
                      <span className="font-light">(${deal.value})</span>
                    </h1>
                    <p className="text-xs text-gray-700">
                      {deal.probability && (
                        <>
                          <span className="font-medium">
                            {deal.probability}%
                          </span>{" "}
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
                  {deal.contact && (
                    <>
                      <p className="text-center text-xs text-gray-200">
                        ----------------------------------------------
                      </p>
                      <div>
                        <p className="text-xs font-medium">Contact</p>
                        <div className="flex justify-between">
                          <h1>{deal.contact.contactName}</h1>
                          <div className="flex">
                            <button
                              className="flex h-6 w-7 items-center justify-center rounded border-y border-l border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                (window.location.href = `tel:${deal.contact.contactPhone.countryCode ?? ""}${deal.contact.contactPhone.phoneNumber ?? ""}`)
                              }
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="flex h-6 w-7 items-center justify-center rounded border-y border-r border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                (window.location.href = `mailto:${deal.contact.contactEmail.email ?? ""}`)
                              }
                            >
                              <MailIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ),
          )
        ) : (
          <p className="py-2 text-center text-sm text-gray-500">
            Create an deal above.
          </p>
        )}
      </div>

      {/* DealDialog component */}
      {selectedDeal && (
        <DealDialog
          account={account}
          deal={selectedDeal}
          setSelectedDeal={setSelectedDeal}
        />
      )}
    </Card>
  );
}
