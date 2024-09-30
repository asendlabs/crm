"use client";
import { Account, Contact, Opportunity } from "@database/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, X } from "lucide-react";
import { formatDate } from "@/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface OpportunityDialogProps {
  account: Account;
  opportunity: Opportunity & { contact: Contact };
  setSelectedOpportunity: (opportunity: Opportunity & { contact: Contact } | null) => void;
}

export function OpportunityDialog({
  account,
  opportunity,
  setSelectedOpportunity,
}: OpportunityDialogProps) {
  const [open, setOpen] = useState(true);
  function handleClose() {
    setOpen(false);
    setSelectedOpportunity(null);
  }
  return (
    <Dialog open={open} onOpenChange={handleClose} >
      <DialogContent className="p-4">
        <div className="flex justify-between">
          <span className="mr-1 text-xl font-medium">{opportunity.title}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4"/>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
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
        <div>
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <Label className="w-28">Deal Amount</Label>
              <Input value={opportunity.value ?? ""} readOnly className="h-8" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Stage</Label>
              <Input value={opportunity.stage ?? ""} readOnly className="h-8" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Contact</Label>
              <Input
                value={opportunity.contact?.contactName ?? ""}
                readOnly
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Close Date</Label>
              <Input
                value={formatDate(opportunity.expectedCloseDate)}
                readOnly
                className="h-8"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
