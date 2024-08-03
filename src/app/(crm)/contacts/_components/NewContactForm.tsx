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
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Close } from "@radix-ui/react-dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { contactSchema } from "@/schemas/contact.schema";
import { createContact } from "../_lib/contact.action";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function NewContactForm({ addContact }: { addContact: (newContact: any) => void }) {
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
        <div className="w-full px-3 py-4 flex flex-row items-center justify-between border-b">
          <div />
          <Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Close>
        </div>
        <div className="px-5 mb-3 py-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          {...field}
                          placeholder="Company Name"
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
                <Button
                  type="submit"
                  className="w-full"
                  variant={"outline"}
                  disabled={loading}
                >
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
