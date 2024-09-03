import { AccountColumns } from "@/components/tables/accounts/AccountColumns";
import { AccountTable } from "@/components/tables/accounts/AccountTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Accounts | Asend",
  description: "List of Accounts",
};

async function AccountsPage() {
  return <AccountTable columns={AccountColumns} tableData={[]} />;
}

export default AccountsPage;
