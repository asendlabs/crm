import { Lead, leadsTable, userTable } from "@/db/schema";

import { LeadsColumns } from "./_components/LeadsColumns";
import { LeadsTable } from "./_components/LeadsTable";
import { Metadata } from "next";
import React from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/user";

export const metadata: Metadata = {
  title: "Leads | Ascend",
  description: "List of Leads",
};

async function LeadsPage() {
  const getUserLeads = async (): Promise<Lead[]> => {
    const user = await getUser();
    const userId = user?.id || "";
    const data = await db.query.leadsTable.findMany({
      where: eq(leadsTable.userId, userId),
    });
    return data as Lead[];
  };

  const LeadsData = await getUserLeads();
  return <LeadsTable columns={LeadsColumns} tableData={LeadsData} />;
}

export default LeadsPage;
