import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Phone, MessageSquare, MessageCircle, Plus } from "lucide-react";
import { useServerAction } from "zsa-react";
import { activityCreateSchema } from "@/schemas/activity.schema";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Account, Contact } from "@database/types";
import { ActivitySelector } from "./related/ActivitySelector";
import { createActivityAction } from "@/server/activity";

export function NewActivityForm({
  account,
  contacts,
}: {
  account: Account;
  contacts: Contact[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activityType, setActivityType] = React.useState<
    "email" | "call" | "message" | "comment"
  >("email");
  const router = useRouter();
  const { execute } = useServerAction(createActivityAction);
  const form = useForm<z.infer<typeof activityCreateSchema>>({
    resolver: zodResolver(activityCreateSchema),
    defaultValues: {
      type: "email",
      title: "",
      description: "",
      contactId: "",
      accountId: account.id,
    },
  });

  React.useEffect(() => {
    form.setValue("type", activityType);
  }, [activityType, form]);

  async function onSubmit(values: z.infer<typeof activityCreateSchema>) {
    try {
      setLoading(true);
      const [data, err] = await execute({
        ...values,
      });
      if (!err) {
        form.reset();
        setOpen(false);
        router.refresh(); // Refresh the page or data
      } else {
        toast.error(
          `Failed to ${
            activityType === "comment"
              ? "add comment"
              : activityType === "email"
                ? "log email"
                : activityType === "message"
                  ? "log message"
                  : activityType === "call"
                    ? "log call"
                    : "create activity"
          }}`,
        );
        toast.error(err.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the activity.");
    } finally {
      setLoading(false);
    }
  }

  const activityTypes = [
    { type: "email", icon: Mail, label: "Email" },
    { type: "call", icon: Phone, label: "Call" },
    { type: "message", icon: MessageSquare, label: "Message" },
    { type: "comment", icon: MessageCircle, label: "Comment" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex max-h-8 max-w-28 flex-row items-center gap-1 rounded-lg bg-primary px-3 text-sm text-white hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        <span>New</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col py-4 pb-2">
        <div className="mb-3 px-5">
          <Form {...form}>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormLabel>
                {activityType === "comment" ? "Comment" : "Title"}
              </FormLabel>
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            className="w-[17.20rem]"
                            placeholder={`Enter title`}
                          />
                        </FormControl>
                        {activityTypes.map(({ type, icon: Icon, label }) => (
                          <ActivitySelector
                            key={type}
                            type={type}
                            ActivityIcon={Icon}
                            activityType={activityType}
                            setActivityType={setActivityType}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {activityType !== "comment" && (
                <FormField
                  control={form.control}
                  name="contactId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a contact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contacts.map((contact) => (
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {activityType === "comment" ? "Comment" : "Description"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Enter ${activityType === "comment" ? "comment" : "description"}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
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
                  {loading
                    ? "Creating..."
                    : activityType === "comment"
                      ? "Add Comment"
                      : activityType === "email"
                        ? "Log Email"
                        : activityType === "message"
                          ? "Log Message"
                          : activityType === "call"
                            ? "Log Call"
                            : "Create Activity"}
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
