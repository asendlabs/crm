"use client";

import {
  Loader,
  MessageSquare,
  Check,
  Trash,
  Edit,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";
import React, { useEffect } from "react";
import { ActivityWithContact } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { deleteActivityAction, updateActivityAction } from "@/server/activity";
import { useRouter } from "@/hooks/use-performance-router";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActivityTimestamp from "./ActivityTimestamp";

const activityUpdateSchema = z.object({
  content: z.string().optional(),
});

export function CommentActivityCard({
  activity,
  firstItem,
}: {
  firstItem: boolean;
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
    <section className="relative flex items-center justify-between text-sm">
      {!firstItem && (
        <div className="absolute -top-4 left-2 h-5 w-[0.05rem] bg-gray-400" />
      )}
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-gray-500" />
        <div className="flex items-center gap-1 py-1">
          <span className="max-w-[35.5rem] truncate rounded-lg border px-2 py-0.5 sm:max-w-32 md:max-w-[20vw] lg:max-w-[30vw] xl:max-w-[40vw]">
            {" "}
            {activity?.content}
          </span>
          <div
            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium hover:cursor-pointer hover:underline"
            onClick={() => setOpen(true)}
          >
            Read more..
            <ArrowUpRight className="size-4" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-4">
              <DialogTitle className="py-2">Comment</DialogTitle>
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
                            className="mt-[-10px] h-56 px-2"
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
        <ActivityTimestamp timestamp={activity.createdAt} />
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
