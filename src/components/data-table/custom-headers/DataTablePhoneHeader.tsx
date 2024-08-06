"use client";

import { Mail, Phone } from "lucide-react";

import React from "react";

function DataTablePhoneHeader() {
  return (
    <div className="flex items-center justify-center">
      <Phone size={18} />
      <span className="sr-only">Phone</span>
    </div>
  );
}

export default DataTablePhoneHeader;
