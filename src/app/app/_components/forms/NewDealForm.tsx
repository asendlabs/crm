"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "@/hooks/use-performance-router";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";

import { createDealAction } from "@/server/deal";
import { dealCreateSchema } from "@/schemas/deal.schema";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils/tailwind";
import {
  Account,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
} from "@database/types";
import { useServerAction } from "zsa-react";
import { DealWithPrimaryContact } from "@/types/entities";

export function NewDealForm({
  accountId,
  accounts,
  fullButton,
  accessPoint,
  addDeal,
  addDealKanban,
}: {
  accountId?: string;
  accessPoint?: "accountPage" | "grid" | "board";
  accounts?: Account[];
  fullButton?: boolean;
  addDeal?: (deal: any) => void;
  addDealKanban?: (deal: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { execute } = useServerAction(createDealAction);

  const dealform = useForm<z.infer<typeof dealCreateSchema>>({
    resolver: zodResolver(dealCreateSchema),
    defaultValues: {
      title: "",
      value: "",
      accountId: accountId || "", // Default accountId if passed
    },
  });

  async function onSubmit(values: z.infer<typeof dealCreateSchema>) {
    setLoading(true);
    try {
      const [data, err] = await execute(values);
      if (err) {
        toast.error("Failed to create deal.");
        return;
      }
      if (addDeal && addDealKanban) {
        addDeal(data?.data);
        addDealKanban(data?.data);
      }
      setOpen(false);
      dealform.reset();
      router.push(
        `/app/${data?.data.account.type + "s"}/${data?.data.accountId}?deal=${data?.data.id}`,
      );
    } catch (error) {
      toast.error("An error occurred while creating the deal.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">New Deal Form</DialogTitle>
      {fullButton ? (
        <DialogTrigger className="flex max-h-8 max-w-28 flex-row items-center gap-1 rounded-lg bg-primary px-3 text-sm text-white hover:bg-primary/90">
          <Plus className="size-4" />
          <span>New</span>
        </DialogTrigger>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className="flex h-6 max-w-36 flex-row items-center gap-1 rounded-lg border border-border px-3 text-sm"
        >
          <Plus className="size-4" />
          <span>Add Deal</span>
        </div>
      )}

      <DialogContent className="py-0.5">
        <div className="mb-3 px-5">
          <Form {...dealform}>
            <form
              className="flex flex-col gap-4 pt-3"
              onSubmit={dealform.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5">
                {!accountId && accounts && (
                  <FormField
                    control={dealform.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem className="flex-1 pt-1">
                        <FormLabel>Lead or Client</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a lead or client" />
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
                  control={dealform.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Deal Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. New Product Line Expansion"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dealform.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="eg. 10,000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dealform.control}
                  name="expectedCloseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Close</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-9 w-full pl-3 text-left",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLoading(false);
                    dealform.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create New Deal"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
