"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "@/hooks/use-performance-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactAction } from "@/server/contacts";
import { useServerAction } from "zsa-react";
import { contactCreateSchema } from "@/schemas/contact.schema";
import { Account } from "@/database";
import { CommandItem } from "@/components/ui/command";
import { CommandContext } from "@/providers/command-provider";

export function NewContactForm({
  addContact,
  accountId,
  accounts,
  runCommandAction,
}: {
  addContact?: (newContact: any) => void;
  accountId?: string;
  accounts?: Account[];
  runCommandAction?: (command: () => void) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { execute } = useServerAction(createContactAction);
  const formRef = React.useRef<HTMLFormElement>(null);

  const { setCommandOpen } = React.useContext(CommandContext);

  const contactform = useForm<z.infer<typeof contactCreateSchema>>({
    resolver: zodResolver(contactCreateSchema),
    defaultValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      accountId: accountId || "",
      jobTitle: "",
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
    }
  };

  async function onSubmit(values: z.infer<typeof contactCreateSchema>) {
    if (loading) return;

    setLoading(true);
    try {
      const [data, err] = await execute({
        ...values,
      });

      if (err) {
        toast.error("Failed to create contact.");
        return;
      }

      if (addContact && data?.data) {
        addContact(data.data);
      }

      contactform.reset();
      setOpen(false);

      if (data?.data) {
        router.push(
          `/app/${data.data.account.type + "s"}/${data.data.accountId}?contact=${data.data.id}`,
        );
      }
      if (runCommandAction) {
        setOpen(false);
        setCommandOpen(false);
        router.push(
          `/app/${data.data.account.type + "s"}/${data.data.accountId}?contact=${data.data.id}`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the contact.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">New Contact Form</DialogTitle>
      {runCommandAction ? (
        <CommandItem
          className="flex gap-2"
          onSelect={() => {
            setOpen(true);
          }}
        >
          <Users className="!size-[1.5rem] rounded-md border p-1" />
          <span>Create new contact</span>
        </CommandItem>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className="flex h-6 w-fit max-w-36 flex-row items-center gap-0.5 rounded-lg border border-border px-3 text-sm"
        >
          <Plus className="size-4" />
          <span>Add contact</span>
        </div>
      )}
      <DialogContent className="flex flex-col py-2">
        <div className="mb-3 px-5">
          <Form {...contactform}>
            <form
              ref={formRef}
              className="flex flex-col gap-4 pt-2"
              onSubmit={contactform.handleSubmit(onSubmit)}
              onKeyDown={handleKeyDown}
            >
              <div className="flex flex-col gap-5">
                {!accountId && accounts && (
                  <FormField
                    control={contactform.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>lead or client</FormLabel>
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
                    if (runCommandAction) {
                      setCommandOpen(false);
                    }
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
