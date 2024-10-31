"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind";
import React from "react";
import { toast } from "sonner";

interface Props {
  label: string;
  placeholder: string;
  defaultValue: string;
  isNotEditable?: boolean;
  isHidden?: boolean;
}

export function SettingsTextField({
  label,
  placeholder,
  defaultValue,
  isNotEditable,
  isHidden = false,
}: Props) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleBlur = async () => {
    if (value !== defaultValue) {
      try {
        toast.info("Old value: " + defaultValue + " | New value: " + value);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <section className="flex w-full flex-col gap-2.5">
      <div className="flex w-full flex-col gap-0.5">
        {label !== "" && <span className="text-sm">{label}</span>}
        <Input
          type={isHidden ? "password" : "text"}
          className={cn("w-full", isHidden && "!select-none")}
          readOnly={isNotEditable || isHidden}
          disabled={isNotEditable || isHidden}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </section>
  );
}
