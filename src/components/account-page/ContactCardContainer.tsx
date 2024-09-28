"use client ";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Contact } from "@database/types";
import React from "react";
import { ContactCard } from "./ContactCard";
import { NewOpportunityForm } from "../forms/NewOpportunityForm";

export function ContactCardContainer({
  contacts,
}: {
  contacts: Contact[];
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <h1>Contacts</h1>
          <p className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs">
            1
          </p>
        </div>
        <NewOpportunityForm />
      </div>
      <div className="p-2">
        <ContactCard />
      </div>
    </Card>
  );
}
