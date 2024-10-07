"use client";

import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { updateAccountAction } from "@/server/accounts";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Pencil, Check, Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DetailsCard() {
  const { account } = useContext(AccountContext);
  const [status, setStatus] = useState(account?.status || "");
  const [accountName, setAccountName] = useState(account?.accountName || "");
  const [website, setWebsite] = useState(account?.website || "");
  const [industry, setIndustry] = useState(account?.industry || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const { refresh } = useRouter();

  useEffect(() => {
    setStatus(account?.status || "");
    setAccountName(account?.accountName || "");
    setWebsite(account?.website || "");
    setIndustry(account?.industry || "");
  }, [account]);

  const handleUpdate = async (columnId: string, newValue: string) => {
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

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    handleUpdate("status", newStatus);
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
    <section className="grid h-full gap-1 rounded-md border p-2.5">
      <div className="flex select-none items-center justify-between">
        <span className="font-medium">Details</span>
      </div>
      <section className="grid max-h-40 items-start justify-start gap-2 overflow-clip overflow-y-auto py-1 pl-0.5 pr-1">
        {/* Lead Name */}
        <div className="group flex items-center">
          <span className="!w-[7.55rem] text-sm">Lead Name</span>
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
        <div className="flex items-center text-sm">
          <span className="!w-32 text-sm">Status</span>
          <Select
            value={status}
            onValueChange={handleStatusChange}
            defaultValue={status}
          >
            <SelectTrigger
              className={`h-7 w-full text-sm capitalize ring-0 ${
                status === "new"
                  ? "!text-purple-800"
                  : status === "contacted"
                    ? "!text-orange-800"
                    : status === "qualified"
                      ? "!text-blue-800"
                      : status === "unqualified"
                        ? "!text-red-800"
                        : status === "waste"
                          ? "!text-gray-500"
                          : status === "won"
                            ? "!text-green-800"
                            : ""
              }`}
            >
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="new"
                showIndicator={false}
                className="font-medium !text-purple-800 hover:!text-purple-700"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  New
                </div>
              </SelectItem>
              <SelectItem
                value="contacted"
                showIndicator={false}
                className="font-medium !text-orange-800 hover:!text-orange-700"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  Contacted
                </div>
              </SelectItem>
              <SelectItem
                value="qualified"
                showIndicator={false}
                className="font-medium !text-blue-800 hover:!text-blue-700"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  Qualified
                </div>
              </SelectItem>
              <SelectItem
                value="unqualified"
                showIndicator={false}
                className="font-medium !text-red-800 hover:!text-red-700"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  Unqualified
                </div>
              </SelectItem>
              <SelectItem
                value="waste"
                showIndicator={false}
                className="font-medium !text-gray-500 hover:!text-gray-400"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  Waste
                </div>
              </SelectItem>
              <SelectItem
                value="won"
                showIndicator={false}
                className="font-medium !text-green-800 hover:!text-green-700"
              >
                <div className="flex items-center gap-1.5">
                  <Circle
                    strokeWidth={4}
                    absoluteStrokeWidth
                    className="h-3 w-3"
                  />
                  Won
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Website */}
        <div className="group flex items-center">
          <span className="!w-[7.55rem] text-sm">Website</span>
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
          <span className="!w-[7.55rem] text-sm">Industry</span>
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
