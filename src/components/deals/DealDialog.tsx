"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Account, Contact, Deal } from "@database/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";
import { useServerAction } from "zsa-react";
import { updateDealAction, deleteDealAction } from "@/server/deal";
import { cn } from "@/utils/tailwind";
import { toast } from "sonner";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";

interface DealDialogProps {
  account: Account;
  deal: Deal & { primaryContact: Contact };
  contactList: Contact[];
  setSelectedDeal: (deal: (Deal & { primaryContact: Contact }) | null) => void;
}

export function DealDialog({
  account,
  deal,
  contactList,
  setSelectedDeal,
}: DealDialogProps) {
  const [open, setOpen] = useState(true);
  const [dealState, setDealState] = useState<
    Deal & { primaryContact: Contact }
  >({
    ...deal,
    expectedCloseDate: deal.expectedCloseDate
      ? new Date(deal.expectedCloseDate)
      : null,
  });

  const updateDealActionHook = useServerAction(updateDealAction);
  const deleteDealActionHook = useServerAction(deleteDealAction);
  const router = useRouter();

  // Handle deal update for individual fields
  async function handleUpdateDeal(field: string, value: string | Date | null) {
    if (value === null) return; // Skip if value is null
    await updateDealActionHook.execute({
      columnId: field,
      itemId: dealState.id,
      newValue: value,
    });
    router.refresh();
  }

  // Handle dialog close and update each field
  async function handleClose() {
    setOpen(false);
    setSelectedDeal(null);

    const updates: Partial<Deal> = {};

    // Check for value changes
    if (dealState.value !== deal.value) {
      updates.value = dealState.value;
    }

    // Check for stage changes
    if (dealState.stage !== deal.stage) {
      updates.stage = dealState.stage;
    }

    // Check for expectedCloseDate changes
    const formattedCloseDate = dealState.expectedCloseDate
      ? dealState.expectedCloseDate.toISOString().substring(0, 10)
      : "";
    const originalCloseDate = deal.expectedCloseDate
      ? new Date(deal.expectedCloseDate).toISOString().substring(0, 10)
      : "";

    if (formattedCloseDate !== originalCloseDate) {
      updates.expectedCloseDate = dealState.expectedCloseDate;
    }

    // Check for primaryContactId changes
    if (dealState.primaryContactId !== deal.primaryContact?.id) {
      updates.primaryContactId = dealState.primaryContactId;
    }

    // If no updates, return early
    if (Object.keys(updates).length === 0) return;

    // Batch update all changes
    await updateDealActionHook.execute({
      itemId: dealState.id,
      full: updates,
    });

    router.refresh();
  }

  // Handle deal delete
  async function handleDelete() {
    await deleteDealActionHook.execute({ itemIds: [dealState.id] });
    await handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-4">
        <div className="flex justify-between">
          <span className="mr-1 text-xl font-medium">{deal.title}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-3">
            <Label className="w-28">Deal Amount</Label>
            <Input
              value={dealState.value ?? ""}
              onChange={(e) =>
                setDealState((prev) => ({ ...prev, value: e.target.value }))
              }
              onBlur={async (e) => {
                await handleUpdateDeal("value", e.target.value);
              }}
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-28">Stage</Label>
            <Input
              value={dealState.stage ?? ""}
              onChange={(e) =>
                setDealState((prev) => ({ ...prev, stage: e.target.value }))
              }
              onBlur={async (e) => {
                await handleUpdateDeal("stage", e.target.value);
              }}
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-28">Contact</Label>
            <Select
              value={dealState.primaryContactId ?? ""}
              onValueChange={(value) => {
                setDealState((prev) => ({
                  ...prev,
                  primaryContactId: value,
                }));
                // Update the deal immediately on selection
                handleUpdateDeal("primaryContactId", value);
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Choose a contact" className="h-9" />
              </SelectTrigger>
              <SelectContent>
                {contactList.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.contactName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-28">Close Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 w-full pl-3 text-left font-normal",
                    !dealState.expectedCloseDate && "text-muted-foreground",
                  )}
                >
                  {dealState.expectedCloseDate
                    ? format(new Date(dealState.expectedCloseDate), "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    dealState.expectedCloseDate
                      ? new Date(dealState.expectedCloseDate)
                      : undefined
                  }
                  onSelect={async (date) => {
                    await handleUpdateDeal("expectedCloseDate", date ?? null);
                    setDealState((prev) => ({
                      ...prev,
                      expectedCloseDate: date ?? null,
                    }));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
