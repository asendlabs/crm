"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactAction } from "@/server/contacts";
import { useServerAction } from "zsa-react";
import { contactCreateSchema } from "@/schemas/contact.schema";
import { Account } from "@database/types";

export function NewContactForm({
  addContact,
  accountId,
  accounts,
}: {
  addContact?: (newContact: any) => void;
  accountId?: string;
  accounts?: Account[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { execute, data } = useServerAction(createContactAction);
  const contactform = useForm<z.infer<typeof contactCreateSchema>>({
    resolver: zodResolver(contactCreateSchema),
    defaultValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      accountId: accountId || "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof contactCreateSchema>) {
    try {
      setLoading(true);
      const [data, err] = await execute({
        ...values,
      });
      if (!err) {
        toast.success("Contact created successfully!");
        contactform.reset();
        setOpen(false);
        router.refresh(); // Refresh the page or data
      } else {
        toast.error("Failed to create contact.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the contact.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex max-h-8 max-w-28 flex-row items-center gap-1 rounded-lg bg-primary px-3 text-sm text-white hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        <span>New</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col py-2">
        <div className="mb-3 px-5">
          <Form {...contactform}>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={contactform.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5">
                {!accountId && accounts && (
                  <FormField
                    control={contactform.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Choose a lead or client"
                                className="h-9"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={contactform.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. John Doe"
                          className="h-9 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactform.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. abc@example.com"
                          className="h-9 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  tabIndex={-1}
                  className="w-30 h-8"
                  onClick={() => {
                    setLoading(false);
                    contactform.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8" disabled={loading}>
                  {loading ? "Creating..." : "Create New Contact"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogDescription className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
