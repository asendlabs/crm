"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contactUpdateSchema } from "@/schemas/contact.schema";
import {
  deleteContactAction,
  updateContactAction,
  updateContactEmailAction,
  updateContactPhoneAction,
} from "@/server/contacts";
import { ContactWithDetails } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  Check,
  Ellipsis,
  EllipsisVertical,
  Loader2,
  MailIcon,
  PhoneIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";

export function ContactCard({
  contact,
  clickable = true,
}: {
  contact: ContactWithDetails;
  clickable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContactActionCaller = useServerAction(deleteContactAction);
  const updateContactActionCaller = useServerAction(updateContactAction);
  const updateContactEmailActionCaller = useServerAction(
    updateContactEmailAction,
  );
  const updateContactPhoneActionCaller = useServerAction(
    updateContactPhoneAction,
  );

  const form = useForm<z.infer<typeof contactUpdateSchema>>({
    resolver: zodResolver(contactUpdateSchema),
    defaultValues: {
      contactName: contact.contactName,
      contactEmail: contact.contactEmail?.email ?? "",
      contactPhone: contact.contactPhone?.phoneNumber ?? "",
    },
  });
  const { control, watch } = form;
  const nameValue = watch("contactName");
  const emailValue = watch("contactEmail");
  const phoneValue = watch("contactPhone");

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof contactUpdateSchema>) => {
    setIsSubmitting(true);
    try {
      if (values.contactName !== contact.contactName) {
        const [data, err] = await updateContactActionCaller.execute({
          itemId: contact.id,
          columnId: "contactName",
          newValue: values.contactName,
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      if (values.contactEmail !== contact.contactEmail?.email) {
        const [data, err] = await updateContactEmailActionCaller.execute({
          contactId: contact.id,
          email: values.contactEmail,
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      if (values.contactPhone !== contact.contactPhone?.phoneNumber) {
        const [data, err] = await updateContactPhoneActionCaller.execute({
          contactId: contact.id,
          phoneNumber: values.contactPhone,
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the contact.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const hasChanges = [
      contact.contactName !== nameValue,
      contact.contactEmail?.email !== emailValue,
      contact.contactPhone?.phoneNumber !== phoneValue,
    ].some(Boolean);
    setSaveButtonEnabled(hasChanges);
  }, [contact, nameValue, emailValue, phoneValue]);

  return (
    <Dialog
      open={open && clickable}
      onOpenChange={(newOpen) => {
        if (clickable) {
          form.reset();
          setOpen(newOpen);
        }
      }}
    >
      <Card
        key={contact.id}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex w-full items-center justify-between px-2 py-2 text-sm">
          <h1 className="max-w-[6rem] truncate">{contact.contactName}</h1>
          <div className="flex gap-1">
            <div className="flex">
              <button
                className="rounded-y flex h-6 w-7 items-center justify-center rounded-l border-y border-l border-gray-200 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${contact.contactPhone?.countryCode ?? ""}${contact.contactPhone?.phoneNumber ?? ""}`;
                }}
              >
                <PhoneIcon className="h-4 w-4" />
              </button>
              <button
                className="rounded-y flex h-6 w-7 items-center justify-center rounded-r border-y border-r border-gray-200 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${contact.contactEmail?.email ?? ""}`;
                }}
              >
                <MailIcon className="h-4 w-4" />
              </button>
            </div>
            {clickable && (
              <div className="flex h-6 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 hover:bg-gray-200">
                <Ellipsis className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </Card>
      <DialogContent className="p-4">
        <div className="">
          <h1 className="text-xl font-medium">{contact.contactName}</h1>
          <p className="text-sm">{contact.contactEmail?.email ?? ""}</p>
        </div>
        <Form {...form}>
          <form
            className="grid gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="eg. John Doe"
                      className="h-9 w-full"
                      autoFocus={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="eg. abc@example.com"
                      className="h-9 w-full"
                      autoFocus={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="eg. 1234567890"
                      className="h-9 w-full"
                      autoFocus={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex w-full !justify-between pt-3">
              <div>
                <Button
                  className="h-8"
                  variant={"destructive"}
                  type="button"
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      const [data, err] =
                        await deleteContactActionCaller.execute({
                          itemIds: [contact.id],
                        });
                    } catch (error) {
                    } finally {
                      setIsDeleting(false);
                      setOpen(false);
                      router.refresh();
                    }
                  }}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Trash className="h-4 w-4" />
                      Delete Contact
                    </span>
                  )}
                </Button>
              </div>
              <div className="flex gap-1.5">
                <Button
                  className="h-8"
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                {saveButtonEnabled && (
                  <Button className="h-8" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
