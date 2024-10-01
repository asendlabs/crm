"use client";
import { Account, Contact, ContactEmail, ContactPhone } from "@database/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, X } from "lucide-react";
import { formatDate } from "@/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface ContactDialogProps {
  contact: Contact & { contactEmail: ContactEmail; contactPhone: ContactPhone };
  setSelectedContact: (
    contact:
      | (Contact & { contactEmail: ContactEmail; contactPhone: ContactPhone })
      | null,
  ) => void;
}

export function ContactDialog({
  contact,
  setSelectedContact,
}: ContactDialogProps) {
  const [open, setOpen] = useState(true);
  function handleClose() {
    setOpen(false);
    setSelectedContact(null);
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-4">
        <div className="flex justify-between">
          <span className="mr-1 text-xl font-medium">
            {contact.contactName}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
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
              <Label className="w-28">Email</Label>
              <Input
                value={contact.contactEmail?.email ?? ""}
                readOnly
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Phone</Label>
              <Input
                value={contact.contactPhone?.phoneNumber ?? ""}
                readOnly
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Job Title</Label>
              <Input value={contact.jobTitle ?? ""} readOnly className="h-8" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
