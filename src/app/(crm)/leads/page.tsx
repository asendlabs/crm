import { LeadsColumns } from "./_components/LeadsColumns";
import { LeadsTable } from "./_components/LeadsTable";
import { Metadata } from "next";
import React from "react";
import axios from "axios";
import { db } from "@/db";

export type Lead = {
  id: string;
  company: string;
  email: string;
  website: string;
  address: string;
  phone: string;
};

const getLeads = async (): Promise<Lead[]> => {
  const response = await axios.get(
    "https://66a6ee9d23b29e17a1a3c02d.mockapi.io/leads"
  );
  const { data } = response;
  return data as Lead[];
};

export const metadata: Metadata = {
  title: "Leads",
  description: "List of leads",
};

async function LeadsPage() {
  const fetchedLeads = await getLeads();
  return <LeadsTable columns={LeadsColumns} tableData={fetchedLeads} />;
}

export default LeadsPage;
