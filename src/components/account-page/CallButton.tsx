"use client";
import { Phone } from "lucide-react";
import React from "react";

export function CallButton() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
      <Phone className="h-4 w-4" />
    </button>
  );
}
