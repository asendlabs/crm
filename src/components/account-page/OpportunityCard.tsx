import React from "react";
import { Card } from "../ui/card";
import { MailIcon, PhoneIcon } from "lucide-react";

export function OpportunityCard() {
  return (
    <Card>
      <div className="p-2">
        <h1 className="text-lg font-semibold">$10,000</h1>
        <p className="text-xs text-gray-700">
          <span className="font-medium">60%</span>{" "}
          probability on <span className="font-medium">{" "}26 September 2024</span>
        </p>
        <p className="text-center text-xs text-gray-200">
          ----------------------------------------------
        </p>
        <div>
          <p className="text-xs font-medium">Contact</p>
          <div className="flex justify-between">
            <h1>Waris Reshi</h1>
            <div className="flex">
              <button className="flex h-6 w-7 items-center justify-center rounded border-y border-l border-gray-200 hover:bg-gray-200">
                <PhoneIcon className="h-4 w-4" />
              </button>
              <button className="flex h-6 w-7 items-center justify-center rounded border-y border-r border-gray-200 hover:bg-gray-200">
                <MailIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
