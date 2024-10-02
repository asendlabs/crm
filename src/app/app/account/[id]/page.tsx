import { GoBackLink } from "@/components/GoBackLink";
import { selectedWorkspaceCookie } from "@/config";
import { getAccountById } from "@/data-access/accounts";
import { Contact, ContactEmail, ContactPhone } from "@database/types";
import { cookies } from "next/headers";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { AccountContext } from "@/contexts/account-context";
import { Header } from "@/components/account-page/Header";
import { AccountProvider } from "@/providers/AccountProvider";

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
  const account = await getAccountById(id.toUpperCase());
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  if (!account || !account.workspaceId || account.workspaceId !== workspaceId) {
    return {};
  }
  return {
    title: `${account.accountName} | accounts`,
    description: account.description,
  };
}

export default async function AccountPage({ params, searchParams }: Props) {
  const { id } = params;
  if (!id) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true} />
        <span className="text-center text-2xl font-semibold">
          We couldn't find what you were looking for.
        </span>
      </div>
    );
  }
  const account = await getAccountById(id.toUpperCase());
  if (!account) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true} />
        <span className="text-center text-2xl font-semibold">
          We couldn't find what you were looking for.
        </span>
      </div>
    );
  }
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  if (!account.workspaceId || account.workspaceId !== workspaceId) {
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
    <AccountProvider
      account={account}
      contacts={account.contacts}
      activities={account.activites}
      deals={account.deals}
    >
      <Header />
    </AccountProvider>
  );
}
