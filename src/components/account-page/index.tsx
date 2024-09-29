import {
  Account,
  Contact,
  ContactEmail,
  ContactPhone,
  Opportunity,
} from "@database/types";
import React from "react";
import TopTabs from "./TopTabs";
import { OpportunityCard } from "./OpportunityCard";
import { StatusSwitcher } from "./StatusSwitcher";
import { ContactCard } from "./ContactCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DetailsCard } from "./DetailsCard";

export function AccountPage({
  account,
  accountContacts,
  accountOpportunities,
}: {
  account: Account;
  accountContacts: Array<
    Contact & { contactPhone: ContactPhone; contactEmail: ContactEmail }
  >;
  accountOpportunities: Array<
    Opportunity & {
      contact: Contact & {
        contactPhone: ContactPhone;
        contactEmail: ContactEmail;
      };
    }
  >;
}) {
  return (
    <section className="max-h-screen">
      <div className="flex flex-col gap-3 py-4">
        <section className="grid grid-flow-row gap-3">
          <section className="flex flex-col justify-center gap-1 border-b border-gray-200 px-3 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1">
                <Link
                  href={"/app/leads"}
                  className="text-lg font-medium text-gray-400 hover:text-gray-900"
                >
                  Leads
                </Link>
                <h1 className="text-lg font-medium">/</h1>
                <h1 className="text-lg font-medium">{account.accountName}</h1>
              </div>
              <div className="flex gap-2">
                <StatusSwitcher
                  currentStatus={account.status}
                  statuses={[
                    "New",
                    "Potential",
                    "Qualified",
                    "Unqualified",
                    "Closed",
                    "Waste",
                  ]}
                />
                <Button className="h-8">Convert to Customer</Button>
              </div>
            </div>
          </section>
          <section className="flex items-start justify-between gap-2 px-3">
            <TopTabs />{" "}
            <div className="grid h-full w-[22rem] gap-3 overflow-y-auto py-1 pl-2">
              <ContactCard contacts={accountContacts} accountId={account.id} />
              <OpportunityCard
                opportunities={accountOpportunities}
                accountId={account.id}
              />
              <DetailsCard account={account} />
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}
