import { AccountPage } from "@/components/account-page";
import { GoBackLink } from "@/components/GoBackLink";
import { selectedWorkspaceCookie } from "@/config";
import { getAccountById } from "@/data-access/accounts";
import { Contact, ContactEmail, ContactPhone } from "@database/types";
import { cookies } from "next/headers";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;
  if (!id) {
    return {};
  }
  const lead = await getAccountById(id.toUpperCase());
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  if (!lead || !lead.workspaceId || lead.workspaceId !== workspaceId) {
    return {};
  }
  return {
    title: `${lead.accountName} | Leads`,
    description: lead.description,
  };
}

export default async function AccountRoute({ params, searchParams }: Props) {
  const { id } = params;
  if (!id) {
    return <div>Not Found</div>;
  }
  const lead = await getAccountById(id.toUpperCase());
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  if (!lead || !lead.workspaceId || lead.workspaceId !== workspaceId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true} />
        <span className="text-center text-2xl font-semibold">
          We couldn't find what you were looking for.
        </span>
      </div>
    );
  }
  return (
    <div>
      <AccountPage
        account={lead}
        accountContacts={lead.contacts as any}
        accountDeals={lead.deals as any}
      />
    </div>
  );
}
