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
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { accountCreateSchema } from "@/schemas/account.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "@/hooks/use-performance-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountAction } from "@/server/accounts";
import { useServerAction } from "zsa-react";
import { CommandItem } from "@/components/ui/command";
import { CommandContext } from "@/providers/command-provider";

export function NewLeadForm({
  addLead,
  runCommandAction,
}: {
  addLead: (newLead: any) => void;
  runCommandAction?: (command: () => void) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { execute, data } = useServerAction(createAccountAction);
  const { setCommandOpen } = React.useContext(CommandContext);
  const formRef = React.useRef<HTMLFormElement>(null);

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
      addLead(data?.data);
      if (runCommandAction) {
        setOpen(false);
        setCommandOpen(false);
        router.push(`/app/leads/${data?.data.id.toLowerCase()}`);
      }
    } catch (error) {
      toast.error("Internal Error");
    } finally {
      setLoading(false);
      form.reset();
      if (!runCommandAction) {
        setOpen(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">new lead</DialogTitle>
      {runCommandAction ? (
        <CommandItem
          className="flex gap-2"
          onSelect={() => {
            setOpen(true);
          }}
        >
          <Building className="!size-[1.5rem] rounded-md border p-1" />
          <span>create new lead</span>
        </CommandItem>
      ) : (
        <DialogTrigger className="flex max-h-8 max-w-28 flex-row items-center gap-1 rounded-lg border px-3 text-sm">
          <Plus className="size-4" />
          <span>add lead</span>
        </DialogTrigger>
      )}
      <DialogContent className="flex flex-col py-2">
        <div className="mb-3 px-5">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 pt-2"
              onKeyDown={handleKeyDown}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>lead name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. acme inc"
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
                      <FormLabel>contact name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. john doe"
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
                    if (runCommandAction) {
                      setCommandOpen(false);
                    }
                  }}
                >
                  cancel
                </Button>
                <Button type="submit" className="h-8" disabled={loading}>
                  {loading ? "creating..." : "create new lead"}
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
