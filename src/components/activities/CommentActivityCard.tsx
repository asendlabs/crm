"use client";

import {
  Loader,
  MessageSquare,
  Check,
  Trash,
  Edit,
  MoreVertical,
} from "lucide-react";
import React, { useEffect } from "react";
import { ActivityWithContact } from "@/types/entities";
import { Button } from "../ui/button";
import { useServerAction } from "zsa-react";
import { deleteActivityAction, updateActivityAction } from "@/server/activity";
import { useRouter } from "@/hooks/use-performance-router";
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
} from "../ui/dropdown-menu";

const activityUpdateSchema = z.object({
  content: z.string().optional(),
});

export function CommentActivityCard({
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
        <MessageSquare className="size-4" />
        <div className="flex items-center gap-1 py-1">
          <span className="max-w-[35.5rem] truncate rounded-lg border px-2 py-0.5">
            {" "}
            {activity?.content}
          </span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-4">
              <h1 className="text-base font-medium">Comment Notes</h1>
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
                          <Loader className="size-4 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Check className="size-4" />
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
              className="mr-0.5 h-6 w-7"
              variant={"outline"}
            >
              <MoreVertical className="size-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              {deleting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash className="mr-2 size-4" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
