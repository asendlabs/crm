"use client ";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Contact,
  ContactEmail,
  ContactPhone,
  Opportunity,
} from "@database/types";
import React from "react";
import { NewOpportunityForm } from "../forms/NewOpportunityForm";
import { MailIcon, PhoneIcon } from "lucide-react";

export function OpportunityCard({
  opportunities,
}: {
  opportunities: Array<
    Opportunity & {
      contact: Contact & {
        contactPhone: ContactPhone;
        contactEmail: ContactEmail;
      };
    }
  >;
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <h1>Opportunities</h1>
          <p className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs">
            {opportunities.length > 0 ? opportunities.length : 0}
          </p>
        </div>
        <NewOpportunityForm />
      </div>
      <div className="p-2">
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
                <div className="p-2">
                  <h1 className="text-lg font-semibold">
                    ${opportunity.value}
                  </h1>
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">
                      {opportunity.probability}%
                    </span>{" "}
                    probability on{" "}
                    <span className="font-medium">
                      {opportunity.expectedCloseDate?.toLocaleString()}
                    </span>
                  </p>
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
