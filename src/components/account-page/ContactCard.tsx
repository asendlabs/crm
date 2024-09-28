import React from "react";
import { Card } from "../ui/card";
import { MailIcon, PhoneIcon } from "lucide-react";

export function ContactCard() {
  return (
    <Card className="">
      <div className="p-2">
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
    </Card>
  );
}
