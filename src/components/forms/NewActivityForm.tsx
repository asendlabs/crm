"use client";
import { AccountContext } from "@/providers/accountProvider";
import { activityCreateSchema } from "@/schemas/activity.schema";
import { createActivityAction } from "@/server/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { PopoverContent, Popover, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import { cn } from "@/utils/tailwind";
import { ActivityType } from "@/types/entities";

export function NewActivityForm({
  activityType,
  setActivityFormOpen,
}: {
  activityType: ActivityType;
  setActivityFormOpen: (open: boolean) => void;
}) {
  const { account, contacts } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();
  const { execute } = useServerAction(createActivityAction);
  const form = useForm<z.infer<typeof activityCreateSchema>>({
    resolver: zodResolver(activityCreateSchema),
    defaultValues: {
      type: activityType,
      title: "",
      content: "",
      contactId: contacts?.[Math.floor(Math.random() * contacts.length)]?.id,
      accountId: account?.id,
      date: new Date(),
    },
  });

  const { control, watch, handleSubmit, reset } = form;
  async function onSubmit(values: z.infer<typeof activityCreateSchema>) {
    setLoading(true);
    try {
      const [data, err] = await execute({
        ...values,
      });
      if (!err) {
        reset();
        refresh();
      } else {
        toast.error(
          `Failed to ${activityType === "comment" ? "add comment" : activityType === "message" ? "log message" : "log call"}`,
        );
      }
    } catch (error) {
      toast.error("An error occurred while creating the activity.");
    } finally {
      setLoading(false);
      setActivityFormOpen(false);
    }
  }
  return (
    <>
      {
        activityType !== "email" ? (
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-2 rounded-md border px-4 py-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex w-full gap-2">
                {activityType !== "comment" && (
                  <FormField
                    control={control}
                    name="contactId"
                    render={({ field }) => (
                      <FormItem className="w-full !space-y-0.5">
                        <FormLabel className="text-xs">Contact</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Choose Contact" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contacts?.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.contactName}
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
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full !space-y-0.5">
                      <FormLabel className="text-xs">
                        {activityType === "comment"
                          ? "Comment Title"
                          : activityType === "message"
                            ? "Message Title"
                            : activityType === "call"
                              ? "Call Title"
                              : "Activity Title"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Enter title`}
                          className="h-8"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {activityType !== "comment" && (
                  <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="w-full !space-y-0.5">
                        <FormLabel className="text-xs">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-8 w-full pl-3 text-left",
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
                )}
              </div>
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full !space-y-0.5">
                    <FormLabel className="text-xs">
                      {activityType === "comment"
                        ? "Comment"
                        : activityType === "message"
                          ? "Message Description"
                          : activityType === "call"
                            ? "Call Description"
                            : "Activity Description"}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-30 h-7"
                  onClick={() => {
                    setLoading(false);
                    setActivityFormOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-7" disabled={loading}>
                  {loading
                    ? "Creating..."
                    : activityType === "comment"
                      ? "Add Comment"
                      : activityType === "message"
                        ? "Log Message"
                        : activityType === "call"
                          ? "Log Call"
                          : "Create Activity"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          ""
        ) //New Email Form Here
      }
    </>
  );
}
