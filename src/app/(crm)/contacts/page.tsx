// import { Contact, Lead } from "@/database/schemas/types";
// import { contactTable, leadTable } from "@/db/schema/tables";

import { ContactsColumns } from "@/components/tables/contacts-table/ContactsColumns";
import { ContactsTable } from "@/components/tables/contacts-table/ContactsTable";
import { Metadata } from "next";
import React from "react";
import { db } from "@/database";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/user.action";

export const metadata: Metadata = {
  title: "Contacts | Asend",
  description: "List of Contacts",
};

async function ContactsPage() {
  // const user = await getUser();
  // const getUserContacts = async (): Promise<Contact[]> => {
  //   const userId = user?.id || "";
  //   const data = await db.query.contactTable.findMany({
  //     where: eq(contactTable.userId, userId),
  //     with: {
  //       lead: true,
  //     },
  //   });
  //   return data as Contact[];
  // };

  // const getUserLeads = async (): Promise<Lead[]> => {
  //   const user = await getUser();
  //   const userId = user?.id || "";
  //   const data = await db.query.leadTable.findMany({
  //     where: eq(leadTable.userId, userId),
  //   });
  //   return data as Lead[];
  // };

  // const ContactsData = await getUserContacts();
  // const LeadsData = await getUserLeads();
  // return (
  //   <ContactsTable
  //     columns={ContactsColumns}
  //     tableData={ContactsData}
  //     leads={LeadsData}
  //   />
  // );
  return <div>Contacts</div>;
}

export default ContactsPage;
