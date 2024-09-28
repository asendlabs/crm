"use client ";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Opportunity } from "@database/types";
import React from "react";
import { NewOpportunityForm } from "../forms/NewOpportunityForm";
import { OpportunityCard } from "./OpportunityCard";

export function OpportunityCardContainer({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex gap-2 items-center">
          <h1>Opportunities</h1>
          <p className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs">
            1
          </p>
        </div>
        <NewOpportunityForm />
      </div>
      <div className="p-2">

      <OpportunityCard />
      </div>
    </Card>
  );
}
