"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/hooks/use-performance-router";
import { cn } from "@/lib/utils/tailwind";
import {
  updateProfileFirstNameAction,
  updateProfileLastNameAction,
} from "@/server/profile";
import { updateSelectedWorkspaceNameAction } from "@/server/workspaces";
import React from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

interface Props {
  label: string;
  placeholder: string;
  defaultValue: string;
  isNotEditable?: boolean;
  isHidden?: boolean;
  entityType?: "firstName" | "lastName" | "name";
}

export function SettingsTextField({
  label,
  placeholder,
  defaultValue,
  isNotEditable,
  isHidden = false,
  entityType,
}: Props) {
  const [value, setValue] = React.useState(defaultValue);
  const [customDisabled, setCustomDisabled] = React.useState(false);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const { execute: executeUpdateWorkspace } = useServerAction(
    updateSelectedWorkspaceNameAction,
  );

  const { execute: executeUpdateProfileFirstName } = useServerAction(
    updateProfileFirstNameAction,
  );
  const { execute: executeUpdateProfileLastName } = useServerAction(
    updateProfileLastNameAction,
  );

  const router = useRouter();

  const handleBlur = async () => {
    if (value !== defaultValue && entityType) {
      setCustomDisabled(true);
      try {
        let data, err;
        switch (entityType) {
          case "firstName":
            [data, err] = await executeUpdateProfileFirstName({
              firstName: value,
            });
            if (err) {
              toast.error("Failed to update first name.");
            } else {
              toast.success("First name updated successfully.");
            }
            break;
          case "lastName":
            [data, err] = await executeUpdateProfileLastName({
              lastName: value,
            });
            if (err) {
              toast.error("Failed to update last name.");
            } else {
              toast.success(`${label} updated successfully.`);
            }
            break;
          case "name":
            [data, err] = await executeUpdateWorkspace({
              updatedName: value,
            });
            if (err) {
              toast.error("Failed to update workspace name.");
            } else {
              toast.success("Workspace name updated successfully.");
            }
            break;
          default:
            throw new Error("Unknown entity type");
        }
      } catch (error) {
        toast.error("Failed to update field.");
        console.error(error);
      } finally {
        setCustomDisabled(false);
        router.refresh();
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
          disabled={isNotEditable || isHidden || customDisabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (value === defaultValue && !entityType) {
              return;
            }
            if (e.key === "Enter") {
              await handleBlur();
            }
          }}
          onBlur={handleBlur}
        />
      </div>
    </section>
  );
}
