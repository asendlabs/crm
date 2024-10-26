"use client";

import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { updateAccountAction } from "@/server/accounts";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/hooks/use-performance-router";
import { Pencil, Check, Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountStatus } from "@/types/entities";

export function DetailsCard() {
  const { account } = useContext(AccountContext);
  const [status, setStatus] = useState<AccountStatus | undefined>(
    account?.status ?? undefined,
  );
  const [accountName, setAccountName] = useState(account?.accountName || "");
  const [website, setWebsite] = useState(account?.website || "");
  const [industry, setIndustry] = useState(account?.industry || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const { refresh } = useRouter();

  // Fetch lead statuses from workspace (JSON object)
  const accountStatuses: AccountStatus[] =
    (account?.workspace?.accountStatuses as AccountStatus[]) || [];

  useEffect(() => {
    setStatus(account?.status || undefined);
    setAccountName(account?.accountName || "");
    setWebsite(account?.website || "");
    setIndustry(account?.industry || "");
  }, [account]);

  // Handle updates to the status and color
  const handleUpdate = async (
    columnId: string,
    newValue: string | AccountStatus,
  ) => {
    try {
      const [data, err] = await updateAccountActionCaller.execute({
        itemId: account?.id ?? "",
        columnId,
        newValue,
      });
      if (err) {
        toast.error(err?.message);
      } else {
        refresh();
      }
    } catch (error) {
      toast.error("An error occurred while updating the account.");
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    const selectedStatus = accountStatuses.find(
      (statusObj: AccountStatus) => statusObj.status === newStatus,
    );
    if (selectedStatus) {
      setStatus(selectedStatus);
      handleUpdate("status", JSON.stringify(selectedStatus));
    }
  };

  const handleIndustryBlur = (newIndustry: string) => {
    setIsEditingWebsite(false);
    setIndustry(newIndustry);
    handleUpdate("industry", newIndustry);
  };

  const handleAccountNameBlur = (newAccountName: string) => {
    setIsEditingName(false);
    setAccountName(newAccountName);
    handleUpdate("accountName", newAccountName);
  };

  const handleWebsiteBlur = (newWebsite: string) => {
    setIsEditingWebsite(false);
    setWebsite(newWebsite);
    handleUpdate("website", newWebsite);
  };

  return (
    <section className="grid h-full gap-1 border-b px-4 py-3">
      <div className="flex select-none items-center justify-between">
        <span className="font-medium">Details</span>
      </div>
      <section className="grid max-h-40 items-start justify-start gap-2 overflow-clip overflow-y-auto py-1 pl-0.5 pr-1">
        {/* Lead Name */}
        <div className="group flex items-center">
          <span className="!w-[9rem] text-sm capitalize">
            {account?.type} Name
          </span>
          <div className="relative w-full">
            <Input
              value={accountName}
              onBlur={(e) => handleAccountNameBlur(e.target.value)}
              onChange={(e) => setAccountName(e.target.value)}
              onDoubleClick={() => setIsEditingName(!isEditingName)}
              readOnly={!isEditingName}
              className="h-7 !w-full truncate pr-8"
            />
            <Button
              onClick={() => setIsEditingName(!isEditingName)}
              variant="ghost"
              className="absolute right-1 top-1/2 h-6 -translate-y-1/2 transform p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isEditingName ? <Check size={12} /> : <Pencil size={12} />}
            </Button>
          </div>
        </div>

        {/* Status (Always Editable) */}
        {account?.type !== "client" && (
          <div className="flex items-center overflow-x-hidden text-sm">
            <span className="!w-[9.5rem] text-sm">Status</span>
            <Select
              value={status?.status || ""} // Use string status, default to empty string if undefined
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="!ring-none h-7 w-full text-sm font-medium capitalize !outline-none ring-0 focus:ring-offset-[-1]">
                <SelectValue>
                  {status ? (
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: `#${status.color}` }}
                    >
                      <Circle
                        strokeWidth={4}
                        absoluteStrokeWidth
                        className={`h-3 w-3`}
                      />
                      {status.status}
                    </div>
                  ) : (
                    "Select Status"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accountStatuses.map((statusObj: AccountStatus) => (
                  <SelectItem
                    key={statusObj.status}
                    value={statusObj.status}
                    showIndicator={false}
                    className="font-medium"
                    style={{
                      color: `#${statusObj.color}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Circle
                        strokeWidth={4}
                        absoluteStrokeWidth
                        className={`h-3 w-3`}
                      />
                      {statusObj.status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Website */}
        <div className="group flex items-center">
          <span className="!w-[9rem] text-sm">Website</span>
          <div className="relative w-full">
            <Input
              value={website}
              onBlur={(e) => handleWebsiteBlur(e.target.value)}
              onChange={(e) => setWebsite(e.target.value)}
              onDoubleClick={() => setIsEditingWebsite(!isEditingWebsite)}
              readOnly={!isEditingWebsite}
              className="h-7 !w-full truncate pr-8"
            />
            <Button
              onClick={() => setIsEditingWebsite(!isEditingWebsite)}
              variant="ghost"
              className="absolute right-1 top-1/2 h-6 -translate-y-1/2 transform p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isEditingWebsite ? <Check size={12} /> : <Pencil size={12} />}
            </Button>
          </div>
        </div>

        {/* Industry */}
        <div className="group flex items-center">
          <span className="!w-[9rem] text-sm">Industry</span>
          <div className="relative w-full">
            <Input
              value={industry}
              onBlur={(e) => handleIndustryBlur(e.target.value)}
              onChange={(e) => setIndustry(e.target.value)}
              onDoubleClick={() => setIsEditingIndustry(!isEditingIndustry)}
              readOnly={!isEditingIndustry}
              className="h-7 !w-full truncate pr-8"
            />
            <Button
              onClick={() => setIsEditingIndustry(!isEditingIndustry)}
              variant="ghost"
              className="absolute right-1 top-1/2 h-6 -translate-y-1/2 transform p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isEditingIndustry ? <Check size={12} /> : <Pencil size={12} />}
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}
