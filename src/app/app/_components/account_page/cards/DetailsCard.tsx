"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "@/providers/account-provider";
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
  if (isValidUrl(value)) return value;
  const handle = value.startsWith("@") ? value.slice(1) : value;

  switch (platform) {
    case "Instagram":
      return `https://instagram.com/${handle}`;
    case "Twiiter":
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

  if (isValidUrl(value)) {
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split("/").filter(Boolean);

      switch (platform) {
        case "linkedIn":
          if (pathParts[0] === "company") {
            return pathParts[1];
          } else if (pathParts[0] === "in") {
            return `@${pathParts[1]}`;
          }
          return pathParts.join("/");

        case "facebook":
          if (pathParts[0] === "pages") {
            return pathParts.slice(1).join("/");
          }
          return pathParts.join("/");

        case "Instagram":
        case "Twiiter":
          return `@${pathParts[pathParts.length - 1]}`;

        default:
          return value;
      }
    } catch {
      return value;
    }
  }

  switch (platform) {
    case "Instagram":
    case "Twiiter":
      return value.startsWith("@") ? value : `@${value}`;
    default:
      return value;
  }
};

const DescriptionField = ({
  value,
  onSave,
  isEditing,
  setIsEditing,
  placeholder,
}: {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  placeholder: string;
}) => {
  const [fieldValue, setFieldValue] = useState<string>(value || "");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current?.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const truncateText = (text: string, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="relative w-full">
      <Textarea
        ref={inputRef}
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
            onSave(fieldValue);
          }
        }}
        onBlur={() => {
          setIsEditing(false);
          if (fieldValue !== value) {
            onSave(fieldValue);
          }
        }}
        onClick={() => {
          if (!isEditing) {
            setIsEditing(true);
          }
        }}
        placeholder={placeholder}
        className={cn(
          "h-7 !min-h-7 w-full resize-none rounded-lg border-none px-2 py-1 text-black hover:bg-muted dark:text-white dark:hover:bg-muted",
          isEditing &&
            "h-20 focus:border-primary focus:ring-1 focus:ring-primary",
        )}
      />
    </div>
  );
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
      const clipboardRes = navigator.clipboard.writeText(valueToCopy);
      toast.success("Copied to clipboard");
    }
  };

  const isSocialMedia = (label: string): boolean => {
    return ["Instagram", "facebook", "linkedIn", "Twiiter"].includes(label);
  };

  const isClickableUrl = (value: string): boolean => {
    return isValidUrl(value) || isSocialMedia(label);
  };

  const displayValue = isSocialMedia(label)
    ? formatSocialMediaHandle(label, fieldValue)
    : isValidUrl(fieldValue)
      ? new URL(fieldValue).hostname +
        (new URL(fieldValue).pathname === "/"
          ? ""
          : new URL(fieldValue).pathname)
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

  const placeholder = `Set ${label} ${
    ["linkedIn", "Twiiter", "Instagram", "facebook", "website"].includes(label)
      ? "Url"
      : ""
  }`;

  const renderActionButtons = () => {
    return (
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
        {!isEditing && fieldValue && (
          <button
            onClick={handleEditClick}
            className="cursor-pointer rounded-md bg-muted p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-700 group-hover:opacity-100"
          >
            <Pencil size={14} />
          </button>
        )}
        {copyEnabled && fieldValue && (
          <button
            onClick={handleCopy}
            className="cursor-pointer rounded-md bg-muted p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-700 group-hover:opacity-100"
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
      <span className="flex !w-[10rem] items-center gap-1.5 text-gray-800 dark:text-gray-300">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <div className="group relative mx-1 flex w-full items-center">
        {customInput ||
          (isDescription ? (
            <DescriptionField
              value={fieldValue}
              onSave={(value: string) => {
                if (value !== fieldValue) {
                  onSave(value);
                }
              }}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              placeholder={placeholder}
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
                fieldValue &&
                  isClickableUrl(fieldValue) &&
                  "underline decoration-2 underline-offset-[2.5px]",
                fieldValue && isClickableUrl(fieldValue)
                  ? "text-primary"
                  : "text-black dark:text-white",
                inputClassName,
              )}
            />
          ))}
        {!customInput && renderActionButtons()}
      </div>
    </div>
  );
};

export function DetailsCard() {
  const { account } = useContext(AccountContext);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const { refresh } = useRouter();
  const [accordionOpen, setAccordionOpen] = useState("details");

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
          <span className="text-sm font-medium">Details</span>
        </AccordionTrigger>
        <AccordionContent className="grid w-full items-start justify-start gap-1.5 overflow-clip overflow-y-auto pl-0.5 pr-1 pt-1">
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
            onSave={(value: string) => handleUpdate("Instagram", value)}
            copyEnabled
          />
          <DetailField
            label="LinkedIn"
            icon={Linkedin}
            value={account?.linkedin}
            onSave={(value: string) => handleUpdate("LinkedIn", value)}
            copyEnabled
          />
          <DetailField
            label="Twitter"
            icon={Twitter}
            value={account?.twitter}
            onSave={(value: string) => handleUpdate("Twiiter", value)}
            copyEnabled
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
