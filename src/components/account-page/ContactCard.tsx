"use client";

import { Card } from "@/components/ui/card";
import { Contact, ContactEmail, ContactPhone } from "@database/types";
import React from "react";
import { NewOpportunityForm } from "../forms/NewOpportunityForm";
import { MailIcon, PhoneIcon } from "lucide-react";

export function ContactCard({
  contacts,
}: {
  contacts: Array<
    Contact & { contactPhone: ContactPhone; contactEmail: ContactEmail }
  >;
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <h1>Contacts</h1>
          {contacts && contacts.length > 0 && (
            <p className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs">
              {contacts.length}
            </p>
          )}
        </div>
        <NewOpportunityForm />
      </div>
      <div className="p-2">
        {contacts ? (
          contacts.length > 0 &&
          contacts.map(
            (
              contact: Contact & {
                contactPhone: ContactPhone;
                contactEmail: ContactEmail;
              },
            ) => (
              <Card key={contact.id}>
                <div className="p-2">
                  <div className="flex justify-between">
                    <h1>{contact.contactName}</h1>
                    <div className="flex">
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-l border-y border-l border-gray-200 hover:bg-gray-200"
                        onClick={() =>
                          (window.location.href = `tel:${contact.contactPhone.countryCode ?? ""}${contact.contactPhone.phoneNumber ?? ""}`)
                        }
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-r border-y border-r border-gray-200 hover:bg-gray-200"
                        onClick={() =>
                          (window.location.href = `mailto:${contact.contactEmail.email ?? ""}`)
                        }
                      >
                        <MailIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          )
        ) : (
          <p className="py-2 text-center text-sm text-gray-500">
            Create a contact above.
          </p>
        )}
      </div>
    </Card>
  );
}
