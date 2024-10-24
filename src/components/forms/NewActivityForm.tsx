"use client";
import { AccountContext } from "@/providers/accountProvider";
import { activityCreateSchema } from "@/schemas/activity.schema";
import { createActivityAction } from "@/server/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useRouter } from "@/hooks/use-performance-router";
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
import { format } from "date-fns";
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
      content: "",
      accountId: account?.id,
      date: new Date(),
    },
  });

  const { control, handleSubmit, reset } = form;

  async function onSubmit(values: z.infer<typeof activityCreateSchema>) {
    setLoading(true);
    try {
      const [data, err] = await execute({
        ...values,
        type: activityType,
      });
      if (!err) {
        reset();
        refresh();
      } else {
        toast.error(
          `Failed to ${activityType === "call" ? "log call" : "create activity"}`,
        );
      }
    } catch (error) {
      toast.error("An error occurred while creating the activity.");
    } finally {
      setLoading(false);
      setActivityFormOpen(false);
    }
  }

  useEffect(() => {
    form.reset();
  }, [activityType]);

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2 rounded-lg border px-4 py-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {activityType !== "comment" && (
          <div className="flex gap-2">
            <FormField
              control={control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
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
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
                  <FormLabel className="text-xs">
                    {activityType === "call"
                      ? "Call Purpose"
                      : "Activity Title"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`Enter title for ${activityType}`}
                      className="h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
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
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel className="text-xs">
                {activityType === "comment"
                  ? "Comment"
                  : activityType === "call"
                    ? "Call Notes"
                    : "Activity Description"}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={`Enter ${activityType === "comment" ? "comment" : "notes"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActivityFormOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
