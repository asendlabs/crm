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
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOpportunityAction } from "@/server/opportunity";
import { useServerAction } from "zsa-react";
import { opportunityCreateSchema } from "@/schemas/opportunity.schema";
import { Calendar } from "../ui/calendar";
import { cn } from "@/utils/tailwind";
import { Account } from "@database/types";

export function NewOpportunityForm({
  addOpportunity,
  accountId,
  accounts,
}: {
  addOpportunity?: (newOpportunity: any) => void;
  accountId?: string;
  accounts?: Account[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { execute, data } = useServerAction(createOpportunityAction);
  const opportunityform = useForm<z.infer<typeof opportunityCreateSchema>>({
    resolver: zodResolver(opportunityCreateSchema),
    defaultValues: {
      title: "",
      value: "",
      accountId: accountId || "", // Default accountId if passed
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof opportunityCreateSchema>) {
    try {
      setLoading(true);
      const [data, err] = await execute({
        ...values,
      });
      if (!err) {
        toast.success("Opportunity created successfully!");
        opportunityform.reset();
        setOpen(false);
        router.refresh(); // Refresh the page or data
      } else {
        toast.error("Failed to create opportunity.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the opportunity.");
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
          <Form {...opportunityform}>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={opportunityform.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5">
                {!accountId && accounts && (
                  <FormField
                    control={opportunityform.control}
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
                                placeholder="Choose a lead or customer"
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
                  control={opportunityform.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Opportunity Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="eg. New Product Line Expansion"
                          className="h-9 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={opportunityform.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="eg. 10,000"
                          className="h-9 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={opportunityform.control}
                  name="expectedCloseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Close</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-9 w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            className="select-none"
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            {...field}
                          />
                        </PopoverContent>
                      </Popover>
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
                    opportunityform.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8" disabled={loading}>
                  {loading ? "Creating..." : "Create New Opportunity"}
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
