"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { updateAccountAction } from "@/server/accounts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { useRouter } from "@/hooks/use-performance-router";
import {
  IdCard,
  Circle,
  LucideIcon,
  Globe,
  Component,
  Copy,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  AlignLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountStatus } from "@/types/entities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/tailwind";

interface DetailFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string | null | undefined;
  onSave: (value: string) => void;
  inputClassName?: string;
  customInput?: React.ReactNode;
  copyEnabled?: boolean;
  isDescription?: boolean; // New prop for description field
}

const DetailField: React.FC<DetailFieldProps> = ({
  label,
  icon: Icon,
  value,
  onSave,
  inputClassName = "",
  customInput,
  copyEnabled = false,
  isDescription = false, // Default to false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleCopy = () => {
    if (fieldValue) {
      navigator.clipboard.writeText(fieldValue);
      toast.success(`${label} copied to clipboard`);
    }
  };

  const isUrl = (label: string, value: string): boolean => {
    const validLabels = [
      "Instagram",
      "Facebook",
      "LinkedIn",
      "Twitter",
      "Website",
    ];
    return validLabels.includes(label);
  };

  const placeholder = `Set ${label.charAt(0).toUpperCase() + label.slice(1)}`;

  return (
    <div
      className={cn(
        "group flex items-center text-sm",
        isEditing && isDescription && "mt-1 items-start",
      )}
    >
      <span className="flex !w-[10rem] items-center gap-1.5 capitalize text-gray-800">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <div className="group relative mx-1 flex w-full items-center">
        {customInput ||
          (isDescription ? (
            <Textarea
              ref={inputRef as any}
              value={fieldValue}
              placeholder={placeholder}
              onChange={(e) => setFieldValue(e.target.value)}
              onClick={() => setIsEditing(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                  if (fieldValue !== value) {
                    onSave(fieldValue);
                  }
                }
              }}
              onBlur={(e) => {
                setIsEditing(false);
                if (e.target.value !== value) {
                  onSave(e.target.value);
                }
              }}
              readOnly={!isEditing}
              className={`m-0 ml-1 !h-7 !min-h-7 w-fit max-w-full resize-none truncate break-words px-2 py-1 hover:bg-muted ${!isEditing ? "cursor-text border-none bg-transparent" : "!h-20 !resize-y"} ${inputClassName}`}
            />
          ) : (
            <Input
              ref={inputRef as any}
              value={fieldValue}
              placeholder={placeholder}
              onChange={(e) => setFieldValue(e.target.value)}
              onClick={() => setIsEditing(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                  if (fieldValue !== value) {
                    onSave(fieldValue);
                  }
                }
              }}
              onBlur={(e) => {
                setIsEditing(false);
                if (e.target.value !== value) {
                  onSave(e.target.value);
                }
              }}
              readOnly={!isEditing}
              className={`m-0 h-7 w-full truncate px-2 py-1 hover:bg-muted ${!isEditing ? "cursor-text border-none bg-transparent" : ""} ${inputClassName} ${fieldValue && isUrl(label, fieldValue) && "underline"} ${
                isUrl(label, fieldValue) ? "text-blue-700" : "text-black"
              }`}
            />
          ))}
        {copyEnabled && (
          <Copy
            size={22}
            className="absolute right-1 top-1/2 ml-1 -translate-y-1/2 cursor-pointer rounded bg-muted p-1 text-gray-500 opacity-0 hover:text-gray-700 group-hover:opacity-100"
            onClick={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

export function DetailsCard() {
  const { account } = useContext(AccountContext);
  const [status, setStatus] = useState<AccountStatus | undefined>(
    account?.status ?? undefined,
  );
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const { refresh } = useRouter();
  const accountStatuses: AccountStatus[] =
    (account?.workspace?.accountStatuses as AccountStatus[]) || [];

  const [accordionOpen, setAccordionOpen] = useState("details");

  useEffect(() => {
    setStatus(account?.status || undefined);
  }, [account]);

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

  const handleStatusChange = (newStatus: string) => {
    const selectedStatus = accountStatuses.find(
      (statusObj: AccountStatus) => statusObj.status === newStatus,
    );
    if (selectedStatus) {
      setStatus(selectedStatus);
      handleUpdate("status", JSON.stringify(selectedStatus));
    }
  };

  const StatusSelectInput = (
    <Select value={status?.status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className="ml-2 h-7 w-full cursor-pointer bg-transparent px-2 text-sm font-medium capitalize hover:bg-muted">
        <SelectValue>
          {status ? (
            <div
              className="flex items-center gap-1.5"
              style={{ color: `#${status.color}` }}
            >
              <Circle strokeWidth={4} absoluteStrokeWidth className="h-3 w-3" />
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
            style={{ color: `#${statusObj.color}` }}
          >
            <div className="flex items-center gap-1.5">
              <Circle strokeWidth={4} absoluteStrokeWidth className="h-3 w-3" />
              {statusObj.status}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Accordion
      type="single"
      className="w-full"
      collapsible
      defaultValue={accordionOpen}
      onValueChange={setAccordionOpen}
    >
      <AccordionItem className="grid h-full border-b px-4" value="details">
        <AccordionTrigger className="flex select-none items-center justify-between pb-2.5">
          <span className="text-sm font-medium capitalize">Details</span>
        </AccordionTrigger>
        <AccordionContent className="grid items-start justify-start gap-1.5 overflow-clip overflow-y-auto pl-0.5 pr-1 pt-1">
          {account?.type !== "client" && (
            <DetailField
              label="Status"
              icon={Component}
              value={status?.status || ""}
              onSave={() => {}}
              customInput={StatusSelectInput}
            />
          )}
          <DetailField
            label="Name"
            icon={IdCard}
            value={account?.accountName}
            onSave={(value: string) => handleUpdate("accountName", value)}
            copyEnabled
          />
          <DetailField
            label="Website"
            icon={Globe}
            value={account?.website}
            onSave={(value: string) => handleUpdate("website", value)}
            copyEnabled
          />
          {/* <DetailField
            label="Description"
            icon={AlignLeft}
            value={account?.description}
            onSave={(value: string) => handleUpdate("description", value)}
            isDescription
          /> */}
          <DetailField
            label="Instagram"
            icon={Instagram}
            value={account?.instagram}
            onSave={(value: string) => handleUpdate("instagram", value)}
            copyEnabled
          />
          <DetailField
            label="Facebook"
            icon={Facebook}
            value={account?.facebook}
            onSave={(value: string) => handleUpdate("facebook", value)}
            copyEnabled
          />
          <DetailField
            label="LinkedIn"
            icon={Linkedin}
            value={account?.linkedin}
            onSave={(value: string) => handleUpdate("linkedin", value)}
            copyEnabled
          />
          <DetailField
            label="Twitter"
            icon={Twitter}
            value={account?.twitter}
            onSave={(value: string) => handleUpdate("twitter", value)}
            copyEnabled
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
