"use client";

import { Account, Contact, ContactEmail, ContactPhone } from "@database/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Save, Trash, X } from "lucide-react";
import { useServerAction } from "zsa-react";
import {
  createContactEmailAction,
  createContactPhoneAction,
  deleteContactAction,
  updateContactAction,
  updateContactEmailAction,
  updateContactPhoneAction,
} from "@/server/contacts";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ContactDialogProps {
  contact: Contact & { contactEmail: ContactEmail; contactPhone: ContactPhone };
  setSelectedContact: (
    contact:
      | (Contact & { contactEmail: ContactEmail; contactPhone: ContactPhone })
      | null,
  ) => void;
  refresh: () => void;
}

export function ContactDialog({
  contact,
  setSelectedContact,
  refresh,
}: ContactDialogProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  // Server actions
  const updateContactActionHook = useServerAction(updateContactAction);
  const deleteContactActionHook = useServerAction(deleteContactAction);
  const updateContactEmailActionHook = useServerAction(
    updateContactEmailAction,
  );
  const updateContactPhoneActionHook = useServerAction(
    updateContactPhoneAction,
  );
  const createContactEmailActionHook = useServerAction(
    createContactEmailAction,
  );
  const createContactPhoneActionHook = useServerAction(
    createContactPhoneAction,
  );

  // Local state
  const [localState, setLocalState] = useState<
    Contact & { contactEmail: ContactEmail; contactPhone: ContactPhone }
  >({ ...contact });
  const [email, setEmail] = useState(localState.contactEmail?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    localState.contactPhone?.phoneNumber ?? "",
  );
  const [canEdit, setCanEdit] = useState(false); // Local state for edit mode

  // Add this function to handle edit button click
  async function handleEdit() {
    setCanEdit((prev) => !prev); // Toggle edit mode
  }

  // Handle dialog close and updates
  async function handleClose() {
    setOpen(false); // Close the dialog
    refresh();
    setSelectedContact(null);
    // Collect all updates
    const updates = [
      { field: "jobTitle", value: localState.jobTitle || "" }, // Default to empty string if null
      { field: "email", value: email || "" }, // Default to empty string if null
      { field: "phoneNumber", value: phoneNumber || "" }, // Default to empty string if null
    ];

    const updatePromises = updates.map(async ({ field, value }) => {
      const currentValue = contact[field as keyof typeof contact];

      // Proceed only if value has changed
      if (value !== currentValue) {
        switch (field) {
          case "email":
            await handleEmailUpdate(value); // value is guaranteed to be string
            break;
          case "phoneNumber":
            await handlePhoneUpdate(value); // value is guaranteed to be string
            break;
          default:
            await handleUpdateContact(field, value); // value is guaranteed to be string
        }
      }
    });

    await Promise.all(updatePromises); // Wait for all updates to finish
    refresh();
    router.refresh(); // Refresh the router after all updates
  }

  // Update a specific contact field
  async function handleUpdateContact(field: string, value: string) {
    // Change type to string
    if (!value) return; // Prevent update if value is null
    await updateContactActionHook.execute({
      columnId: field,
      itemId: localState.id,
      newValue: value,
    });
    setLocalState((prev) => ({ ...prev, [field]: value })); // Update local state
  }

  // Delete contact
  async function handleDelete() {
    setOpen(false);
    setSelectedContact(null);
    await deleteContactActionHook.execute({ itemIds: [localState.id] });
    router.refresh();
  }

  // Handle email update
  async function handleEmailUpdate(value: string) {
    // Change type to string
    setEmail(value);

    if (!localState.contactEmail) {
      const [data, err] = await createContactEmailActionHook.execute({
        contactId: localState.id,
        email: value,
      });
      if (!err) {
        setLocalState((prev) => ({ ...prev, contactEmail: data?.data }));
      }
    } else {
      await updateContactEmailActionHook.execute({
        contactId: localState.id,
        email: value,
      });
    }
  }

  // Handle phone number update
  async function handlePhoneUpdate(value: string) {
    // Change type to string
    setPhoneNumber(value);

    if (!localState.contactPhone) {
      const [data, err] = await createContactPhoneActionHook.execute({
        contactId: localState.id,
        phoneNumber: value,
      });
      if (!err) {
        setLocalState((prev) => ({ ...prev, contactPhone: data?.data }));
      }
    } else {
      await updateContactPhoneActionHook.execute({
        contactId: localState.id,
        phoneNumber: value,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={async () => {
        await handleClose();
      }}
    >
      <DialogContent className="p-4">
        <div className="flex justify-between">
          <span className="mr-1 flex items-center gap-2 text-xl font-medium">
            {contact.contactName}
          </span>
          <div className="flex gap-1">
            {canEdit ? (
              <Button
                variant="outline"
                size="icon"
                className="flex h-8 w-16 gap-1 text-green-700 "
                onClick={handleEdit} // Call handleEdit on button click to save
              >
                Save
                <Save className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="flex h-8 w-16 gap-1 text-blue-800"
                onClick={handleEdit} // Call handleEdit on button click to edit
              >
                Edit
                <Pencil className="h-3 w-3" />
              </Button>
            )}
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
        <div>
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <Label className="w-28">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleEmailUpdate(email)} // Update on blur
                disabled={!canEdit} // Make input read-only based on canEdit state
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Phone</Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => handlePhoneUpdate(phoneNumber)} // Update on blur
                className="h-8"
                disabled={!canEdit} // Make input read-only based on canEdit state
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-28">Job Title</Label>
              <Input
                value={localState.jobTitle ?? ""}
                className="h-8"
                onChange={(e) =>
                  setLocalState((prev) => ({
                    ...prev,
                    jobTitle: e.target.value,
                  }))
                }
                onBlur={
                  () =>
                    handleUpdateContact("jobTitle", localState.jobTitle || "") // Ensure jobTitle is string
                }
                disabled={!canEdit} // Make input read-only based on canEdit state
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
