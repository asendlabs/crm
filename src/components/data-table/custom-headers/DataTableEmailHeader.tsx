"use client";

import { Mail } from "lucide-react";
import React from "react";

function DataTableEmailHeader() {
  return (
    <div className="flex items-center justify-center">
      <Mail size={18} />
      <span className="sr-only">Email</span>
    </div>
  );
}

export default DataTableEmailHeader;
