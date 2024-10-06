"use client";

import {
  Loader2,
  PhoneCall,
  Check,
  ArrowUpRight,
  Trash,
  Edit,
  MoreVertical,
} from "lucide-react";
import React, { useEffect } from "react";
import { ActivityWithContact } from "@/types/entities";
import { Button } from "../ui/button";
import { useServerAction } from "zsa-react";
import { deleteActivityAction, updateActivityAction } from "@/server/activity";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Arrow } from "@radix-ui/react-dropdown-menu";

const activityUpdateSchema = z.object({
  content: z.string().optional(),
});

export function CallLogActivityCard({
  activity,
}: {
  activity: ActivityWithContact;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const deleteActivityActionCaller = useServerAction(deleteActivityAction);
  const updateActivityActionCaller = useServerAction(updateActivityAction);

  const router = useRouter();

  const form = useForm<z.infer<typeof activityUpdateSchema>>({
    resolver: zodResolver(activityUpdateSchema),
    defaultValues: {
      content: activity.content ?? "", // Set the default value to the activity's content
    },
  });

  const { control, handleSubmit, watch } = form;
  const notesValue = watch("content");

  useEffect(() => {
    if (activity.content && notesValue !== activity.content) {
      setSaveButtonEnabled(true);
    } else {
      setSaveButtonEnabled(false);
    }
  }, [notesValue, activity.content]);

  const onSubmit = async (values: z.infer<typeof activityUpdateSchema>) => {
    setIsSubmitting(true);
    try {
      const [data, err] = await updateActivityActionCaller.execute({
        itemId: activity?.id,
        columnId: "content",
        newValue: values.content ?? "",
      });
      if (!err) {
        router.refresh();
        setOpen(false);
      } else {
        toast.error(`Failed to update activity`);
      }
    } catch (error) {
      toast.error("An error occurred while updating the activity.");
    } finally {
      setIsSubmitting(false);
      setSaveButtonEnabled(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const [, err] = await deleteActivityActionCaller.execute({
        itemIds: [activity.id],
      });
      if (!err) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <PhoneCall className="h-4 w-4 text-gray-500" />
        <div className="flex max-w-[35.5rem] items-center gap-1 truncate py-1">
          Call{" "}
          {activity.associatedContact?.contactName && (
            <>
              with
              <span className="rounded-md border px-2 py-0.5">
                {activity.associatedContact?.contactName}
              </span>
            </>
          )}
          {activity.title && (
            <>
              for
              <div className="rounded-md border px-2 py-0.5">
                {activity.title}
              </div>
            </>
          )}
          <div
            className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Open Notes
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-4">
              <h1 className="text-base font-medium">Call Notes</h1>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                  <FormField
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                            className="mt-[-10px] px-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="flex w-full">
                    <Button
                      className="h-8"
                      type="submit"
                      disabled={isSubmitting || !saveButtonEnabled}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Save Changes
                        </span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex gap-1 px-3 py-1 text-gray-500">
          {timeAgo(activity.createdAt.toString())}
        </span>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="mr-0.5 inline-flex h-6 w-7 justify-center"
              variant={"outline"}
            >
              <MoreVertical className="h-4 w-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20 justify-end">
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
