import { Account, Contact, Opportunity } from "@database/types";
import React from "react";
import { GoBackLink } from "../GoBackLink";
import { CallButton } from "./CallButton";
import { MailButton } from "./MailButton";
import { WebsiteButton } from "./WebsiteButton";
import TopTabs from "./TopTabs";
import { OpportunityCardContainer } from "./OpportunityCardContainer";
import { MapPin } from "lucide-react";
import { StatusSwitcher } from "./StatusSwitcher";
import { ContactCardContainer } from "./ContactCardContainer";

export function AccountPage({ account }: { account: Account }) {
  return (
    <section className="">
      <div className="flex flex-col gap-3 px-6 py-6">
        <GoBackLink pagePath="leads" permanent={false} />
        <section className="grid grid-flow-row gap-3">
          <section className="flex flex-col gap-1 border-b border-gray-200 py-3">
            <div className="flex items-start justify-between">
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-semibold">
                    {account.accountName}
                  </h1>
                  <CallButton />
                  <MailButton />
                  <WebsiteButton />
                </div>
                <div className="flex flex-row items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm text-gray-500">
                    San Francisco, CA
                  </span>
                </div>
              </div>
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
            </div>
          </section>
          <section className="flex items-start justify-between gap-2">
            <TopTabs />{" "}
            <div className="h-full w-80 pl-2 py-1 grid gap-3">
              <ContactCardContainer contacts={[] as Contact[]} />
              <OpportunityCardContainer opportunities={[] as Opportunity[]} />
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}
