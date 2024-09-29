"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { accountCreateSchema } from "@/schemas/account.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountAction } from "@/server/accounts";
import { useServerAction } from "zsa-react";

export function NewLeadForm({ addLead }: { addLead: (newLead: any) => void }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { execute, data } = useServerAction(createAccountAction);
  const form = useForm<z.infer<typeof accountCreateSchema>>({
    resolver: zodResolver(accountCreateSchema),
    defaultValues: {
      accountName: "",
      contactName: "",
      type: "lead",
    },
  });

  const handleSubmit = async (values: z.infer<typeof accountCreateSchema>) => {
    setLoading(true);
    try {
      const [data, err] = await execute({
        accountName: values.accountName,
        type: values.type,
        contactName: values.contactName,
      });
      if (err) {
        toast.error(err.message);
        return;
      }
      console.log(data?.data);
      addLead(data?.data);
      // router.push(`/app/leads/${data?.data.id.toLowerCase()}`);
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
      <DialogContent className="flex flex-col py-2">
        <div className="mb-3 px-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 pt-2"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Lead Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. Acme Inc"
                          className="h-9 w-full"
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
              </div>
              <div className="flex flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  tabIndex={-1}
                  className="w-30 h-8"
                  onClick={() => {
                    setLoading(false);
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8" disabled={loading}>
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
