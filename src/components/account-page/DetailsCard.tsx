import React from "react";
import { Card } from "../ui/card";
import { Account } from "@database/types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { StatusSwitcher } from "./StatusSwitcher";
import { CommandSeparator } from "../ui/command";

export function DetailsCard({ account }: { account: Account }) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <h1>Details</h1>
        </div>
      </div>
      <div className="grid gap-3 p-3">
        <div className="flex items-center gap-3">
          <Label className="w-28">Website</Label>
          <Input
            value={account?.website ?? ""}
            placeholder={`Enter ${account.type} URL`}
            className="h-8"
          />
        </div>
        <div className="flex items-center gap-3">
          <Label className="w-28">Address</Label>
          <Input
            value={account?.address ?? ""}
            placeholder={`Enter ${account.type} address`}
            className="h-8"
          />
        </div>
      </div>
    </Card>
  );
}
