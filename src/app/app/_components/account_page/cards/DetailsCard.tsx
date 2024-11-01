"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { updateAccountAction } from "@/server/accounts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Pencil,
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

// Utility functions for handling URLs and social media values
const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const getSocialMediaUrl = (platform: string, value: string): string => {
  if (!value) return "";

  // If it's already a full URL, return it
  if (isValidUrl(value)) return value;

  // Remove @ if present
  const handle = value.startsWith("@") ? value.slice(1) : value;

  switch (platform) {
    case "Instagram":
      return `https://instagram.com/${handle}`;
    case "Twitter":
      return `https://twitter.com/${handle}`;
    case "LinkedIn":
      return handle.includes("/")
        ? `https://linkedin.com/${handle}`
        : handle.match(/^[\w\s-]+$/)
          ? `https://linkedin.com/company/${handle}`
          : `https://linkedin.com/in/${handle}`;
    case "Facebook":
      return handle.includes("/")
        ? `https://facebook.com/${handle}`
        : `https://facebook.com/${handle}`;
    default:
      return value;
  }
};

const formatSocialMediaHandle = (platform: string, value: string): string => {
  if (!value) return "";

  // If it's a full URL, extract the handle/name
  if (isValidUrl(value)) {
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split("/").filter(Boolean);

      switch (platform) {
        case "LinkedIn":
          if (pathParts[0] === "company") {
            return pathParts[1];
          } else if (pathParts[0] === "in") {
            return `@${pathParts[1]}`;
          }
          return pathParts.join("/");

        case "Facebook":
          if (pathParts[0] === "pages") {
            return pathParts.slice(1).join("/");
          }
          return pathParts.join("/");

        case "Instagram":
        case "Twitter":
          return `@${pathParts[pathParts.length - 1]}`;

        default:
          return value;
      }
    } catch {
      return value;
    }
  }

  // For non-URL inputs
  switch (platform) {
    case "Instagram":
    case "Twitter":
      return value.startsWith("@") ? value : `@${value}`;
    default:
      return value;
  }
};

interface DetailFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string | null | undefined;
  onSave: (value: string) => void;
  inputClassName?: string;
  customInput?: React.ReactNode;
  copyEnabled?: boolean;
  isDescription?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({
  label,
  icon: Icon,
  value,
  onSave,
  inputClassName = "",
  customInput,
  copyEnabled = false,
  isDescription = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const router = useRouter();

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fieldValue) {
      const valueToCopy = isSocialMedia(label)
        ? getSocialMediaUrl(label, fieldValue)
        : fieldValue;
      navigator.clipboard.writeText(valueToCopy);
      toast.success("Copied to clipboard");
    }
  };

  const isSocialMedia = (label: string): boolean => {
    return ["Instagram", "Facebook", "LinkedIn", "Twitter"].includes(label);
  };

  const isClickableUrl = (value: string): boolean => {
    return isValidUrl(value) || isSocialMedia(label);
  };

  const displayValue = isSocialMedia(label)
    ? formatSocialMediaHandle(label, fieldValue)
    : isValidUrl(fieldValue)
      ? new URL(fieldValue).hostname + new URL(fieldValue).pathname
      : fieldValue;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing && fieldValue && isClickableUrl(fieldValue)) {
      e.preventDefault();
      const url = isSocialMedia(label)
        ? getSocialMediaUrl(label, fieldValue)
        : fieldValue.startsWith("http")
          ? fieldValue
          : `https://${fieldValue}`;

      if (url.startsWith(window.location.origin)) {
        router.push(url);
      } else {
        window.open(url, "_blank");
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFieldClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      if (fieldValue && isClickableUrl(fieldValue)) {
        handleClick(e);
      } else {
        setIsEditing(true);
      }
    }
  };

  const placeholder = `Set ${label.charAt(0).toUpperCase() + label.slice(1)}`;

  const renderActionButtons = () => {
    return (
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
        {!isEditing && fieldValue && (
          <button
            onClick={handleEditClick}
            className="cursor-pointer rounded bg-muted p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-700 group-hover:opacity-100"
          >
            <Pencil size={14} />
          </button>
        )}
        {copyEnabled && fieldValue && (
          <button
            onClick={handleCopy}
            className="cursor-pointer rounded bg-muted p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-700 group-hover:opacity-100"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group flex w-full items-center text-sm",
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
              onClick={handleFieldClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setIsEditing(false);
                  if (fieldValue !== value) {
                    onSave(fieldValue);
                  }
                }
              }}
              onBlur={() => {
                setIsEditing(false);
                if (fieldValue !== value) {
                  onSave(fieldValue);
                }
              }}
              readOnly={!isEditing}
              className={cn(
                "m-0 ml-1 !h-7 !min-h-7 w-full max-w-full resize-none truncate break-words px-2 py-1 hover:bg-muted",
                !isEditing
                  ? "cursor-text border-none bg-transparent"
                  : "!h-20 !resize-y",
                inputClassName,
              )}
            />
          ) : (
            <Input
              ref={inputRef as any}
              value={isEditing ? fieldValue : displayValue}
              placeholder={placeholder}
              onChange={(e) => setFieldValue(e.target.value)}
              onClick={handleFieldClick}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                  if (fieldValue !== value) {
                    onSave(fieldValue);
                  }
                }
              }}
              onBlur={() => {
                setIsEditing(false);
                if (fieldValue !== value) {
                  onSave(fieldValue);
                }
              }}
              readOnly={!isEditing}
              className={cn(
                "m-0 h-7 w-full truncate px-2 py-1 hover:bg-muted",
                !isEditing && "cursor-pointer border-none bg-transparent",
                fieldValue && isClickableUrl(fieldValue) && "underline",
                fieldValue && isClickableUrl(fieldValue)
                  ? "text-blue-700"
                  : "text-black",
                inputClassName,
              )}
            />
          ))}
        {renderActionButtons()}
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
        <AccordionContent className="grid w-full items-start justify-start gap-1.5 overflow-clip overflow-y-auto pl-0.5 pr-1 pt-1">
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
          <DetailField
            label="Description"
            icon={AlignLeft}
            value={account?.description}
            onSave={(value: string) => handleUpdate("description", value)}
            isDescription
          />
          <DetailField
            label="Instagram"
            icon={Instagram}
            value={account?.instagram}
            onSave={(value: string) => handleUpdate("instagram", value)}
            copyEnabled
          />
          {/* <DetailField
            label="Facebook"
            icon={Facebook}
            value={account?.facebook}
            onSave={(value: string) => handleUpdate("facebook", value)}
            copyEnabled
          /> */}
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
