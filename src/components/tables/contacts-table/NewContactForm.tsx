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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, UploadCloud, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Close } from "@radix-ui/react-dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Lead } from "@/db/schema";
import React from "react";
import { contactSchema } from "@/schemas/contact.schema";
import { createContact } from "@/server/contact.action";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function NewContactForm({
  addContact,
  leadList,
}: {
  addContact: (newContact: any) => void;
  leadList: any[];
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
    const response = await createContact(data);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    setLoading(false);
    setOpen(false);
    addContact(response.data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex flex-row gap-1 max-h-8 max-w-20 rounded-lg text-sm items-center bg-primary text-white px-3 hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        <span>New</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <div className="hidden">
          <DialogTitle>Add Contact</DialogTitle>
        </div>
        <div className="w-full px-3.5 py-4 flex flex-row items-center justify-between border-b">
          <span className="text-sm">Create New Contact</span>
          <Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Close>
        </div>
        <div className="px-5 mb-3 py-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row rounded-full border border-input justify-center items-center h-16 w-16 text-muted-foreground">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          {...field}
                          placeholder="Person Name"
                          className="w-80 text-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a Lead" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {leadList.map((lead: Lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.leadName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="eg. john@acme.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="eg. 489-555-1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
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
export default NewContactForm;
