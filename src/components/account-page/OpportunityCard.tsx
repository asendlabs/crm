"use client ";

import {
  Card
} from "@/components/ui/card";
import {
  Contact,
  ContactEmail,
  ContactPhone,
  Opportunity
} from "@database/types";
import { NewOpportunityForm } from "../forms/NewOpportunityForm";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
import { formatDate } from "@/utils";

export function OpportunityCard({
  opportunities,
  accountId,
}: {
  opportunities: Array<
    Opportunity & {
      contact: Contact & {
        contactPhone: ContactPhone;
        contactEmail: ContactEmail;
      };
    }
  >;
  accountId: string;
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <h1>Opportunities</h1>
          {opportunities && opportunities.length > 0 && (
            <p className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs">
              {opportunities.length > 0 ? opportunities.length : 0}
            </p>
          )}
        </div>
        <NewOpportunityForm accountId={accountId} />
      </div>
      <div className="flex flex-col gap-2 p-2">
        {opportunities.length > 0 ? (
          opportunities.map(
            (
              opportunity: Opportunity & {
                contact: Contact & {
                  contactPhone: ContactPhone;
                  contactEmail: ContactEmail;
                };
              },
            ) => (
              <Card key={opportunity.id}>
                <div className="flex items-center justify-between p-2">
                  <div>
                    <h1 className="flex gap-1 text-lg font-semibold">
                      {opportunity.title}
                      <span className="font-light">(${opportunity.value})</span>
                    </h1>
                    <p className="text-xs text-gray-700">
                      {opportunity.probability && (
                        <>
                          <span className="font-medium">
                            {opportunity.probability}%
                          </span>{" "}
                          probability on{" "}
                        </>
                      )}
                      <span className="font-medium">
                        {formatDate(opportunity?.expectedCloseDate) ?? "\u3164"}
                      </span>
                    </p>
                  </div>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 hover:bg-gray-200">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  {opportunity.contact && (
                    <>
                      <p className="text-center text-xs text-gray-200">
                        ----------------------------------------------
                      </p>
                      <div>
                        <p className="text-xs font-medium">Contact</p>
                        <div className="flex justify-between">
                          <h1>{opportunity.contact.contactName}</h1>
                          <div className="flex">
                            <button
                              className="flex h-6 w-7 items-center justify-center rounded border-y border-l border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                (window.location.href = `tel:${opportunity.contact.contactPhone.countryCode ?? ""}${opportunity.contact.contactPhone.phoneNumber ?? ""}`)
                              }
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="flex h-6 w-7 items-center justify-center rounded border-y border-r border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                (window.location.href = `mailto:${opportunity.contact.contactEmail.email ?? ""}`)
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
            Create an opportunity above.
          </p>
        )}
      </div>
    </Card>
  );
}
