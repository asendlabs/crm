import { GoBackLink } from "@/components/GoBackLink";
import { selectedWorkspaceCookie } from "@/constants";
import { getAccountById, getAccountTypeById } from "@/data-access/accounts";
import { cookies } from "next/headers";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { AccountProvider } from "@/providers/accountProvider";
import { Header } from "@/components/account_page/Header";
import { Cards } from "@/components/account_page/Cards";
import { Panels } from "@/components/account_page/Panels";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return {};
  }
  const account = await getAccountById(id.toUpperCase());
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
  if (!account || !account.workspaceId || account.workspaceId !== workspaceId) {
    return {};
  }
  return {
    title: `${account.accountName} | ${account.type.charAt(0).toUpperCase() + account.type.slice(1)}s`,
    description: account.description,
  };
}

export default async function LeadAccountPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  const { tab } = searchParams;
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
  const account = await getAccountTypeById(id.toUpperCase(), "lead");
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
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
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
      deals={account.deals}
      activities={account.activities}
      tasks={account.tasks}
      emails={account.emails}
    >
      <main className="flex h-screen max-h-screen min-h-screen min-w-full flex-col">
        <Header className="w-full px-4 pb-3 pt-4" />
        <section className="grid h-full w-full grid-cols-[27%_1fr] overflow-hidden">
          <Cards className="grid w-full gap-1" />
          <Panels className="w-full" tab={tab as string | undefined} />
        </section>
      </main>
    </AccountProvider>
  );
}
