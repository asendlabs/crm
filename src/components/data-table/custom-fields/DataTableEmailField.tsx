"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";

interface DataTableEmailFieldProps {
  row: any;
}

export function DataTableEmailField({ row }: DataTableEmailFieldProps) {
  const contacts = row.original.contacts;
  const contactEmail = contacts && contacts.length > 0 ? contacts[0].email : "";

  return (
    <Link
      href={`mailto:${contactEmail || ""}`}
      className="group flex flex-row items-center justify-center"
      tabIndex={-1}
    >
      <Mail size={26.5} className="rounded-md p-1 group-hover:bg-slate-200" />
    </Link>
  );
}
