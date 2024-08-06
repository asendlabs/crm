"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Close } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Lead } from "@/db/schema/types";
import React from "react";
import { contactSchema } from "@/schemas/contact.schema";
import { createContact } from "@/server/contact.action";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function NewContactForm({
  addContact,
  leadList,
}: {
  addContact: (newContact: any) => void;
  leadList: Lead[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactName: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof contactSchema>) => {
    setLoading(true);
    try {
      const response = await createContact(data);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      addContact(response.data);
    } catch (error) {
      toast.error("Internal Error");
    } finally {
      setOpen(false);
      setLoading(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex max-h-8 max-w-28 flex-row items-center gap-1 rounded-lg bg-primary px-3 text-sm text-white hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        <span>New</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <div className="hidden">
          <DialogTitle>Add New Contact</DialogTitle>
        </div>
        <div className="flex w-full flex-row items-center justify-between border-b px-3.5 pb-2 pt-4">
          <span className="text-sm">Create New Contact</span>
          <Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Close>
        </div>
        <div className="mb-3 px-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="eg. Acme Inc"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // Updated to use value instead of defaultValue
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a Lead" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {leadList && leadList.length > 0 ? (
                            leadList.map((lead: Lead) => (
                              <SelectItem key={lead.id} value={lead.id}>
                                {lead.leadName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="disabled" disabled>
                              No Leads Found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end gap-2 py-2">
                <Button
                  type="button"
                  variant="outline"
                  tabIndex={-1}
                  className="w-30 h-7"
                  onClick={() => {
                    setLoading(false);
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-7" disabled={loading}>
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
