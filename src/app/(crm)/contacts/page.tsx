import {
  Contact,
  Lead,
  contactsTable,
  leadsTable,
  userTable,
} from "@/db/schema";

import { ContactsColumns } from "./_components/ContactsColumns";
import { ContactsTable } from "./_components/ContactsTable";
import { Metadata } from "next";
import React from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/user";

export const metadata: Metadata = {
  title: "Contacts | Ascend",
  description: "List of Contacts",
};

async function ContactsPage() {
  const user = await getUser();
  const getUserContacts = async (): Promise<Contact[]> => {
    const userId = user?.id || "";
    const data = await db.query.contactsTable.findMany({
      where: eq(contactsTable.userId, userId),
      with: { lead: true },
    });
    return data as Contact[];
  };

  const getUserLeads = async (): Promise<Lead[]> => {
    const user = await getUser();
    const userId = user?.id || "";
    const data = await db.query.leadsTable.findMany({
      where: eq(leadsTable.userId, userId),
    });
    return data as Lead[];
  };

  const ContactsData = await getUserContacts();
  const LeadsData = await getUserLeads();
  return (
    <ContactsTable
      columns={ContactsColumns}
      tableData={ContactsData}
      leads={LeadsData}
    />
  );
}

export default ContactsPage;
