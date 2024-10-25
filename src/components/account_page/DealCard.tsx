import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/hooks/use-performance-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Circle,
  MoreVertical,
  Trash,
  Check,
  Loader,
} from "lucide-react";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import { formatDate } from "@/utils";
import { cn } from "@/utils/tailwind";
import { deleteDealAction, updateDealAction } from "@/server/deal";
import { ContactCard } from "./ContactCard";
import { useServerAction } from "zsa-react";
import { dealUpdateSchema } from "@/schemas/deal.schema";
import { AccountContext } from "@/providers/accountProvider";
import { Deal } from "@database/types";
import { Skeleton } from "@/components/ui/skeleton";

export function DealCard({
  deal,
  isOpen,
}: {
  deal: DealWithPrimaryContact;
  isOpen: boolean;
}) {
  const [open, setOpen] = useState(isOpen);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<DealStage | undefined>(deal.stage);

  const { contacts } = useContext(AccountContext);

  const router = useRouter();

  const dealStages = useMemo(() => {
    return (deal.workspace?.dealStages as DealStage[]) || [];
  }, [deal.workspace]);

  const updateDealActionCaller = useServerAction(updateDealAction);
  const deleteDealActionCaller = useServerAction(deleteDealAction);

  const form = useForm<z.infer<typeof dealUpdateSchema>>({
    resolver: zodResolver(dealUpdateSchema),
    defaultValues: {
      title: deal.title,
      value: deal.value ?? "",
      expectedCloseDate: deal.expectedCloseDate ?? undefined,
      contactId: deal.primaryContactId ?? undefined,
      stage: deal.stage ?? undefined,
    },
  });

  const { control, watch } = form;
  const titleValue = watch("title");
  const dealValue = watch("value");
  const expectedCloseDateValue = watch("expectedCloseDate");
  const contactIdValue = watch("contactId");
  const stageValue = watch("stage");

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
      deal.stage.stage !== stageValue.stage,
    ].some(Boolean);
    setSaveButtonEnabled(hasChanges);
  }, [
    deal,
    titleValue,
    dealValue,
    contactIdValue,
    expectedCloseDateValue,
    stageValue,
  ]);

  useEffect(() => {
    if (deal) {
      setIsLoading(false);
    }
  }, [deal]);

  const handleSubmit = async (values: z.infer<typeof dealUpdateSchema>) => {
    setIsSubmitting(true);
    try {
      const updates = [
        { field: "title", value: values.title },
        { field: "value", value: values.value },
        { field: "expectedCloseDate", value: values.expectedCloseDate },
        { field: "primaryContactId", value: values.contactId },
        { field: "stage", value: stage },
      ];

      for (const update of updates) {
        if (update.value !== deal[update.field as keyof Deal]) {
          const [data, err] = await updateDealActionCaller.execute({
            itemId: deal.id,
            columnId: update.field,
            newValue: update.value,
          });
          if (err) {
            // toast.error(err?.message + err.code); TODO: FIX NO VALUES TO SET ERROR
          }
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

  const handleStageChange = (newStage: string) => {
    const selectedStage = dealStages.find(
      (stageObj: DealStage) => stageObj.stage === newStage,
    );
    if (selectedStage) {
      setStage(selectedStage);
      form.setValue("stage", selectedStage);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-20 w-full flex-col"></Skeleton>
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setOpen(!open);
        router.push("?deal=");
      }}
    >
      <Card
        key={deal.id}
        className="grid cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-start justify-between p-3">
          <div className="grid gap-2">
            <h1 className="break-words text-base font-medium">{deal.title}</h1>
            <p className="flex max-w-[13rem] items-center gap-1 truncate text-xs">
              <span className="font-medium opacity-80">Value:</span>
              <span className="truncate rounded-md border px-2 font-medium">
                {"$" + deal.value}
              </span>
            </p>
            <p className="flex max-w-[13rem] items-center gap-1 truncate text-xs">
              <span className="font-medium opacity-80">Stage:</span>
              <span
                style={{ color: `#${deal.stage.color}` }}
                className="rounded-md border px-2 font-medium"
              >
                {deal.stage.stage}
              </span>
            </p>
            <p className="flex max-w-[30rem] items-center gap-1 text-xs">
              <span className="font-medium opacity-80">Close Date:</span>
              <span className="truncate rounded-md border px-2 font-medium">
                {formatDate(deal?.expectedCloseDate) ?? "\u3164"}
              </span>
            </p>
          </div>
          <div
            className={`flex-col items-center ${deal.primaryContact ? "" : " "}`}
          >
            <Button size="icon" variant="outline" className="h-6 w-7">
              <MoreVertical className="size-4 p-[0.05rem]" />
            </Button>
          </div>
        </div>
        {deal.primaryContact && (
          <div className="p-2 pt-0">
            <ContactCard
              contact={deal.primaryContact}
              clickable={false}
              isOpen={false}
            />
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <DialogContent className="p-4">
        <div>
          <h1 className="text-xl font-medium">{titleValue}</h1>
        </div>
        <Form {...form}>
          <form
            className="grid gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={control}
              name="stage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Stage</FormLabel>
                  {dealStages.length > 0 ? (
                    <Select
                      value={(field.value as any) || ""}
                      onValueChange={handleStageChange}
                    >
                      <SelectTrigger className="!ring-none h-7 w-full text-sm font-medium capitalize !outline-none ring-0 focus:ring-offset-[-1]">
                        <SelectValue>
                          {stage ? (
                            <div
                              className="flex items-center gap-1.5"
                              style={{ color: `#${stage.color}` }}
                            >
                              <Circle
                                strokeWidth={4}
                                absoluteStrokeWidth
                                className={`h-3 w-3`}
                              />
                              {stage.stage}
                            </div>
                          ) : (
                            "Select Stage"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {dealStages.map((stageObj: DealStage) => (
                          <SelectItem
                            key={stageObj.stage}
                            value={stageObj.stage}
                            showIndicator={false}
                            className="font-medium"
                            style={{
                              color: `#${stageObj.color}`,
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <Circle
                                strokeWidth={4}
                                absoluteStrokeWidth
                                className={`h-3 w-3`}
                              />
                              {stageObj.stage}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>No deal stages available</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
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
                      if (err) {
                        toast.error(err?.message);
                      } else {
                        setOpen(false);
                        router.refresh();
                      }
                    } catch (error) {
                      toast.error("An error occurred while deleting the deal.");
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader className="size-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Trash className="size-4" />
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
                    form.reset();
                    router.push("?deal=");
                  }}
                >
                  Cancel
                </Button>
                {saveButtonEnabled && (
                  <Button className="h-8" type="submit" disabled={isSubmitting}>
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
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
