import { AccountColumns } from "@/components/tables/accounts/AccountColumns";
import { AccountTable } from "@/components/tables/accounts/AccountTable";
import { svFetchAllWorkspaceAccounts } from "@/server/accounts";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Accounts | Asend",
  description: "List of Accounts",
};

async function AccountsPage() {
  const { data } = await svFetchAllWorkspaceAccounts();
  return <AccountTable columns={AccountColumns} tableData={data} />;
}

export default AccountsPage;
