import { GoBackLink } from "@/components/go-back-link";
import { selectedWorkspaceCookie } from "@/constants";
import { getAccountById, getAccountTypeById } from "@/data-access/accounts";
import { cookies } from "next/headers";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { AccountProvider } from "@/providers/account-provider";
import { Header } from "@/app/app/_components/account_page/Header";
import { Panels } from "@/app/app/_components/account_page/Panels";
import { Cards } from "@/app/app/_components/account_page/Cards";
import { decryptFromBase64URI } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
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

  const decodedWorkspaceId = decryptFromBase64URI(workspaceId);
  if (
    !account ||
    !account.workspaceId ||
    account.workspaceId !== decodedWorkspaceId
  ) {
    return {};
  }
  return {
    title: `${account.accountName} | ${account.type.toLowerCase()}s`,
    description: account.description,
  };
}

export default async function LeadAccountPage(props: Props) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true}>
          <span className="text-center text-2xl font-semibold">
            We couldn't find what you were looking for.
          </span>
        </GoBackLink>
      </div>
    );
  }
  const account = await getAccountTypeById(id.toUpperCase(), "lead");
  if (!account) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true}>
          <span className="text-center text-2xl font-semibold">
            We couldn't find what you were looking for.
          </span>
        </GoBackLink>
      </div>
    );
  }
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const decodedWorkspaceId = decryptFromBase64URI(workspaceId);
  if (!decodedWorkspaceId || account.workspaceId !== decodedWorkspaceId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <GoBackLink pagePath="leads" permanent={true}>
          <span className="text-center text-2xl font-semibold">
            We couldn't find what you were looking for.
          </span>
        </GoBackLink>
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
        <section className="grid h-full w-full grid-cols-[19.5rem_1fr] overflow-hidden">
          <Cards className="grid w-full gap-1" />
          <Panels className="w-full" />
        </section>
      </main>
    </AccountProvider>
  );
}
