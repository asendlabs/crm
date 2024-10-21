"use client";
import { AccountContext } from "@/providers/accountProvider";
import { taskCreateSchema } from "@/schemas/task.schema";
import { createTaskAction } from "@/server/tasks";
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
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  HourglassIcon,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { PopoverContent, Popover, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils/tailwind";
import { format } from "date-fns";

export function NewTaskForm({
  setTaskFormOpen,
}: {
  setTaskFormOpen: (open: boolean) => void;
}) {
  const { account } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();
  const { execute } = useServerAction(createTaskAction);

  const form = useForm<z.infer<typeof taskCreateSchema>>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
      stage: "todo",
      priority: "medium",
      accountId: account?.id || "",
      description: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  async function onSubmit(values: z.infer<typeof taskCreateSchema>) {
    setLoading(true);
    try {
      const [data, err] = await execute(values);
      if (!err) {
        reset();
        refresh();
      } else {
        toast.error("Failed to create task.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the task.");
    } finally {
      setLoading(false);
      setTaskFormOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid !max-w-full gap-2 rounded-lg border px-4 py-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex max-w-full gap-2 overflow-hidden p-1">
          {/* Task Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full min-w-36 space-y-0.5">
                <FormLabel className="text-xs">Task Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="eg. Send Follow up Email"
                    className="h-8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="mt-[0.38rem] grid w-fit">
                <FormLabel className="mb-[-0.25rem] text-xs">
                  Due Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex h-8 w-56 items-center pl-3 text-left",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date || null);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stage
          <FormField
            control={control}
            name="stage"
            render={({ field }) => (
              <FormItem className="!w-96 space-y-0.5">
                <FormLabel className="text-xs">Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`h-8 font-medium ${field.value === "todo" ? "!text-green-800" : field.value === "in_progress" ? "!text-yellow-800" : field.value === "done" ? "!text-blue-800" : ""}`}
                    >
                      <SelectValue placeholder="Choose Stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem
                      value="todo"
                      showIndicator={false}
                      className="font-medium !text-green-800 hover:!text-green-800"
                    >
                      <div className="flex flex-row items-center gap-1.5">
                        <CheckCircleIcon className="size-4" />
                        Todo
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="in_progress"
                      showIndicator={false}
                      className="font-medium !text-yellow-800 hover:!text-yellow-800"
                    >
                      <div className="flex flex-row items-center gap-1.5">
                        <HourglassIcon className="size-4" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="done"
                      showIndicator={false}
                      className="font-medium !text-blue-800 hover:!text-blue-800"
                    >
                      <div className="flex flex-row items-center gap-1.5">
                        <CheckIcon className="size-4" />
                        Done
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Priority */}
          <FormField
            control={control}
            name="priority"
            render={({ field }) => (
              <FormItem className="!w-72 space-y-0.5">
                <FormLabel className="text-xs">Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`h-8 ${field.value === "low" ? "!text-blue-800" : field.value === "medium" ? "!text-yellow-800" : field.value === "high" ? "!text-red-800" : ""} font-medium`}
                    >
                      <SelectValue placeholder="Choose Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value="low"
                      showIndicator={false}
                      className="font-medium !text-blue-800 hover:!text-blue-800"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      showIndicator={false}
                      className="font-medium !text-yellow-800 hover:!text-yellow-800"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="high"
                      showIndicator={false}
                      className="font-medium !text-red-800 hover:!text-red-800"
                    >
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTaskFormOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
