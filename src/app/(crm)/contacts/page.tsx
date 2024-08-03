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
  const getUserContacts = async () => {
    const userId = user?.id || "";
    const data = await db.query.contactsTable.findMany({
      where: eq(contactsTable.userId, userId),
      with: { lead: true },
    });
    return data;
  };

  const ContactsData = await getUserContacts();
  const lead  =  ContactsData.forEach((contact, index) => {
    contact.lead = contact.lead[index] ;
  });
  return (
    <ContactsTable
      columns={ContactsColumns}
      tableData={ContactsData}
      leads={lead}
    />
  );
}

export default ContactsPage;
