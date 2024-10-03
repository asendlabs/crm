"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Ellipsis,
  EllipsisVertical,
  Plus,
  Trash,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DealWithPrimaryContact } from "@/types/entities";
import { formatDate } from "@/utils";
import { deleteDealAction, updateDealAction } from "@/server/deal"; // Assuming these exist
import { ContactCard } from "./ContactCard";
import { useServerAction } from "zsa-react";
import { dealUpdateSchema } from "@/schemas/deal.schema";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/utils/tailwind";
import { AccountContext } from "@/providers/accountProvider";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export function DealCard({ deal }: { deal: DealWithPrimaryContact }) {
  const [open, setOpen] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { contacts } = useContext(AccountContext);

  const router = useRouter();

  const updateDealActionCaller = useServerAction(updateDealAction);
  const deleteDealActionCaller = useServerAction(deleteDealAction);

  const form = useForm<z.infer<typeof dealUpdateSchema>>({
    resolver: zodResolver(dealUpdateSchema),
    defaultValues: {
      title: deal.title,
      value: deal.value ?? "",
      expectedCloseDate: deal.expectedCloseDate ?? undefined,
      contactId: deal.primaryContactId ?? undefined,
    },
  });

  const { control, watch } = form;
  const titleValue = watch("title");
  const dealValue = watch("value");
  const expectedCloseDateValue = watch("expectedCloseDate");
  const contactIdValue = watch("contactId");

  useEffect(() => {
    const hasChanges = [
      deal.title !== titleValue,
      deal.value !== dealValue,
      (deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate).getTime()
        : null) !==
        (expectedCloseDateValue
          ? new Date(expectedCloseDateValue).getTime()
          : null),
      (deal.primaryContactId ?? null) !== (contactIdValue ?? null),
    ].some(Boolean);
    setSaveButtonEnabled(hasChanges);
  }, [deal, titleValue, dealValue, contactIdValue, expectedCloseDateValue]);

  const handleSubmit = async (values: z.infer<typeof dealUpdateSchema>) => {
    setIsSubmitting(true);
    try {
      if (values.title !== deal.title) {
        const [data, err] = await updateDealActionCaller.execute({
          itemId: deal.id,
          columnId: "title",
          newValue: values.title,
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      if (values.value !== deal.value) {
        const [data, err] = await updateDealActionCaller.execute({
          itemId: deal.id,
          columnId: "value",
          newValue: values.value,
        });
        if (err) {
          toast.error(err?.message);
        }
      }

      if (
        (deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).getTime()
          : null) !==
        (expectedCloseDateValue
          ? new Date(expectedCloseDateValue).getTime()
          : null)
      ) {
        const [data, err] = await updateDealActionCaller.execute({
          itemId: deal.id,
          columnId: "expectedCloseDate",
          newValue: values.expectedCloseDate,
        });
        if (err) {
          toast.error(err?.message);
        }
      }
      if ((deal.primaryContactId ?? null) !== (contactIdValue ?? null)) {
        const [data, err] = await updateDealActionCaller.execute({
          itemId: deal.id,
          columnId: "primaryContactId",
          newValue: values.contactId,
        });
        if (err) {
          toast.error(err?.message);
        }
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the deal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setOpen(!open);
      }}
    >
      <Card
        key={deal.id}
        className="grid cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-start justify-between p-2">
          <div>
            <h1 className="flex max-w-[11rem] gap-0.5 text-base font-light">
              <span className="max-w-[7rem] truncate !font-medium">
                {deal.title}
              </span>
              (<span className="max-w-[4rem] truncate">${deal.value}</span>)
            </h1>
            <p className="text-xs text-gray-700">
              {deal.probability && (
                <>
                  <span className="font-medium">{deal.probability}%</span>{" "}
                  probability on{" "}
                </>
              )}
              <span className="font-medium">
                {formatDate(deal?.expectedCloseDate) ?? "\u3164"}
              </span>
            </p>
          </div>
          <div
            className={`flex h-6 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 hover:bg-gray-200 ${deal.primaryContact ? "mt-1" : ""}`}
          >
            <Ellipsis className="h-4 w-4" />
          </div>
        </div>{" "}
        {deal.primaryContact && (
          <div className="p-2 pt-0">
            <ContactCard contact={deal.primaryContact} clickable={false} />
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <DialogContent className="p-4">
        <div>
          <h1 className="text-xl font-medium">Edit Deal</h1>
        </div>
        <Form {...form}>
          <form
            className="grid gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Associated Contact</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a contact" />
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
                <FormItem>
                  <FormLabel>Deal Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Deal Title"
                      className="h-9 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Value ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Deal Value"
                      className="h-9 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
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
            <DialogFooter className="flex w-full !justify-between pt-3">
              <div>
                <Button
                  className="h-8"
                  variant={"destructive"}
                  type="button"
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      const [data, err] = await deleteDealActionCaller.execute({
                        itemIds: [deal.id],
                      });
                    } catch (error) {
                    } finally {
                      setIsDeleting(false);
                      setOpen(false);
                      router.refresh();
                    }
                  }}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Trash className="h-4 w-4" />
                      Delete Deal
                    </span>
                  )}
                </Button>
              </div>
              <div className="flex gap-1.5">
                <Button
                  className="h-8"
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                {saveButtonEnabled && (
                  <Button className="h-8" type="submit" disabled={isSubmitting}>
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
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
