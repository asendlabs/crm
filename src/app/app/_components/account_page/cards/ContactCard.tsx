"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Check,
  Copy,
  Loader,
  MailIcon,
  MoreVertical,
  PhoneIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { cn } from "@/lib/utils/tailwind";

const emailSchema = z.string().email();
const phoneSchema = z.string().min(7);

export function ContactCard({
  contact,
  isOpen,
  clickable = true,
}: {
  contact: ContactWithDetails;
  isOpen: boolean;
  clickable?: boolean;
}) {
  const [open, setOpen] = useState(isOpen);
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

  const isValidEmail = emailSchema.safeParse(
    contact.contactEmail?.email,
  ).success;
  const isValidPhone = phoneSchema.safeParse(
    contact.contactPhone?.phoneNumber,
  ).success;

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
          email: values.contactEmail || "",
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      if (values.contactPhone !== contact.contactPhone?.phoneNumber) {
        const [data, err] = await updateContactPhoneActionCaller.execute({
          contactId: contact.id,
          phoneNumber: values.contactPhone || "",
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
        if (open) router.push("?contact=");
      }}
    >
      <DialogTitle className="sr-only">Edit Contact</DialogTitle>
      <Card key={contact.id} className="cursor-pointer">
        <div className="relative flex w-full items-center justify-between px-2 py-2.5 text-sm">
          <div className="flex-col">
            <h1
              onClick={() => {
                setOpen(true);
                router.push(`?contact=${contact.id}`);
              }}
              className={cn(
                "max-w-[11rem] truncate px-1",
                clickable ? "max-w-[14.5rem] text-base font-medium" : "",
              )}
            >
              {contact.contactName}
            </h1>
            {clickable && (
              <div className="grid gap-1.5 px-1 py-0.5 text-xs">
                {contact.contactEmail?.email && (
                  <p className="group flex items-center gap-1 truncate font-normal">
                    <span className="font-medium opacity-80">Email</span>
                    <span className="rounded-md border px-1 font-medium text-blue-700 hover:text-blue-600 hover:underline">
                      {contact.contactEmail?.email}
                    </span>
                    <Copy className="size-5 rounded bg-muted p-1 group-hover:border" />{" "}
                    {/* TODO: Add copy functionality */}
                  </p>
                )}
                {contact.contactPhone?.phoneNumber && (
                  <p className="group flex items-center gap-1 truncate font-normal">
                    <span className="font-medium opacity-80">Phone</span>
                    <span className="rounded-md border px-1 font-medium text-orange-700 hover:text-blue-600 hover:underline">
                      {contact.contactPhone?.countryCode ??
                        "" + contact.contactPhone?.phoneNumber}
                    </span>
                    <Copy className="size-5 rounded bg-muted p-1 group-hover:border" />
                    {/* TODO: Add copy functionality */}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!clickable && (
              <div className="flex space-x-1">
                {isValidPhone && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-7 rounded-l"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${contact.contactPhone?.countryCode ?? ""}${contact.contactPhone?.phoneNumber ?? ""}`;
                    }}
                  >
                    <PhoneIcon className="size-4" />
                  </Button>
                )}
                {isValidEmail && (
                  <Button
                    size="icon"
                    variant="outline"
                    className={`h-6 w-7 ${isValidPhone ? "rounded-r" : "rounded"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${contact.contactEmail?.email ?? ""}`;
                    }}
                  >
                    <MailIcon className="size-4" />
                  </Button>
                )}
              </div>
            )}
            {clickable && (
              <Button
                size="icon"
                variant="outline"
                className="absolute right-3 top-3 h-6 w-7"
                onClick={() => setOpen(true)}
              >
                <MoreVertical className="size-4" />
              </Button>
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
                      <Loader className="size-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Trash className="size-4" />
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
                    form.reset();
                    router.push("?deal=");
                  }}
                >
                  Cancel
                </Button>
                {saveButtonEnabled && (
                  <Button className="h-8" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader className="size-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Check className="size-4" />
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
