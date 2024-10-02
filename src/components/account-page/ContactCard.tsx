"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Contact, ContactEmail, ContactPhone, Account } from "@database/types";
import { NewContactForm } from "../forms/NewContactForm";
import { ArrowUpRight, MailIcon, PhoneIcon, Router } from "lucide-react";
import { ContactDialog } from "../contacts/ContactDialog";
import { useRouter } from "next/navigation";

export function ContactCard({
  contacts,
  account,
}: {
  contacts: Array<
    Contact & { contactPhone: ContactPhone; contactEmail: ContactEmail }
  >;
  account: Account;
}) {
  // State to manage dialog open and selected contact
  const [selectedContact, setSelectedContact] = useState<
    | (Contact & { contactPhone: ContactPhone; contactEmail: ContactEmail })
    | null
  >(null);
const router = useRouter()
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <h1>Contacts</h1>
        <NewContactForm accountId={account.id} />
      </div>
      <div className="flex flex-col gap-2 p-2">
        {contacts && contacts.length > 0 ? (
          contacts.map(
            (
              contact: Contact & {
                contactPhone: ContactPhone;
                contactEmail: ContactEmail;
              },
            ) => (
              <Card
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className="cursor-pointer"
              >
                <div className="flex w-full justify-between p-2">
                  <div className="flex items-center gap-2">
                    <h1 className="max-w-[11rem] truncate">
                      {contact.contactName}
                    </h1>
                    <div className="flex">
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-l border-y border-l border-gray-200 hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${contact.contactPhone.countryCode ?? ""}${contact.contactPhone.phoneNumber ?? ""}`;
                        }}
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-r border-y border-r border-gray-200 hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${contact.contactEmail.email ?? ""}`;
                        }}
                      >
                        <MailIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 hover:bg-gray-200">
                    <ArrowUpRight className="h-5 w-5" />
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

      {/* ContactDialog component */}
      {selectedContact && (
        <ContactDialog
refresh={() => router.refresh() }
          contact={selectedContact}
          setSelectedContact={setSelectedContact}
        />
      )}
    </Card>
  );
}
