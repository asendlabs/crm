import { AccountPage } from "@/components/account-page";
import { GoBackLink } from "@/components/GoBackLink";
import { selectedWorkspaceCookie } from "@/config";
import { getAccountById } from "@/data-access/accounts";
import { cookies } from "next/headers";
import React from "react";

export default async function AccountRoute({
  params,
}: {
  params: { id: string };
}) {
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
      <AccountPage account={lead} />
    </div>
  );
}
