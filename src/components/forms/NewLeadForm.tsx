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

import { Button } from "@/components/ui/button";
import { Close } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import { createContact } from "@/server/contact.action";
import { createLead } from "@/server/lead.action";
import { leadSchema } from "@/validation/lead.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function NewLeadForm({ addLead }: { addLead: (newLead: any) => void }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      leadName: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof leadSchema>) => {
    setLoading(true);
    try {
      const leadRes = await createLead(data.leadName);
      if (!leadRes.success) {
        toast.error(leadRes.message);
        return;
      }
      if (
        data.contactName !== "" &&
        data.contactName !== undefined &&
        data.contactName !== null
      ) {
        const contactRes = await createContact({
          leadId: leadRes.data?.id || "",
          contactName: data.contactName,
        });
        if (!contactRes.success) {
          toast.error(contactRes.message);
          return;
        }
      }
      addLead(leadRes.data);
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
          <DialogTitle>Add New Lead</DialogTitle>
        </div>
        <div className="flex w-full flex-row items-center justify-between border-b px-3.5 pb-2 pt-4">
          <span className="text-sm">Create New Lead</span>
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
                name="leadName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Name</FormLabel>
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
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="eg. John Doe"
                        className="w-full"
                      />
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
                  {loading ? "Creating..." : "Create New Lead"}
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
