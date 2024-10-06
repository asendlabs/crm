"use client";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { updateAccountAction } from "@/server/accounts";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export function DetailsCard() {
  const { account } = useContext(AccountContext);
  const [updating, setUpdating] = useState(false);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const { refresh } = useRouter();

  const handleUpdate = async (columnId: string, newValue: string) => {
    setUpdating(true);
    try {
      const [data, err] = await updateAccountActionCaller.execute({
        itemId: account?.id ?? "",
        columnId,
        newValue,
      });
      if (err) {
        toast.error(err?.message);
      }
      refresh();
    } catch (error) {
      toast.error("An error occurred while updating the account.");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <section className="grid h-full gap-1 rounded-md border p-2.5">
      <div className="flex select-none items-center justify-between">
        <span className="font-medium">Details</span>
      </div>
      <section className="grid max-h-48 items-start justify-start gap-2 overflow-y-auto py-1 pl-0.5 pr-1">
        {/* Content Starts from here */}
        <div className="flex items-center">
          <span className="w-36 text-sm">Lead Name</span>
          <Input
            defaultValue={account?.accountName}
            onBlur={async (e) => {
              await handleUpdate("accountName", e.target.value);
            }}
            disabled={updating}
            className="h-7"
          />
        </div>
        <div className="flex items-center text-sm">
          <span className="w-36 text-sm">Status</span>
          <Input
            defaultValue={account?.status}
            onBlur={async (e) => {
              await handleUpdate("status", e.target.value);
            }}
            disabled={updating}
            className="captialize h-7 border-none ring-0"
          />
        </div>
        <div className="flex items-center">
          <span className="w-36 text-sm">Website</span>
          <Input
            defaultValue={account?.website ?? ""}
            className="h-7"
            disabled={updating}
          />
        </div>
        <div className="flex items-center">
          <span className="w-36 text-sm">Industry</span>
          <Input
            defaultValue={account?.website ?? ""}
            className="h-7"
            disabled={updating}
          />
        </div>
        <div className="flex items-center">
          <span className="w-36 text-sm">Address</span>
          <Input
            defaultValue={account?.website ?? ""}
            className="h-7"
            disabled={updating}
          />
        </div>
      </section>
    </section>
  );
}
