// import { leadTable, userTable } from "@/db/schema/tables";

// import { Lead } from "@/database/schemas/types";
import { LeadsColumns } from "@/components/tables/leads-table/LeadsColumns";
import { LeadsTable } from "@/components/tables/leads-table/LeadsTable";
import { Metadata } from "next";
import React from "react";
import { db } from "@/database/connection";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";

export const metadata: Metadata = {
  title: "Leads | Asend",
  description: "List of Leads",
};

async function LeadsPage() {
  // const getUserLeads = async (): Promise<Lead[]> => {
  //   const user = await getUser();
  //   const userId = user?.id || "";
  //   const data = await db.query.leadTable.findMany({
  //     where: eq(leadTable.userId, userId),
  //     with: {
  //       contacts: true,
  //     },
  //   });
  //   return data as Lead[];
  // };

  // const LeadsData = await getUserLeads();
  // return <LeadsTable columns={LeadsColumns} tableData={LeadsData} />;
  return <div>Leads</div>;
}

export default LeadsPage;
