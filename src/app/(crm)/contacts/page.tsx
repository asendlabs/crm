import { Contact, contactsTable, leadsTable, userTable } from "@/db/schema";

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
  const getUserContacts = async (): Promise<Contact[]> => {
    const user = await getUser();
    const userId = user?.id || "";
    const data = await db.query.contactsTable.findMany({
      where: eq(contactsTable.userId, userId),
    });
    return data as Contact[];
  };

  const ContactsData = await getUserContacts();
  return <ContactsTable columns={ContactsColumns} tableData={ContactsData} />;
}

export default ContactsPage;
