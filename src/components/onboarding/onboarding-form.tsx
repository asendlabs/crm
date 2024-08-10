"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import {
  createWorkspace,
  getActiveWorkspace,
  setOnboardingCompleted,
} from "@/server/workspace.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { onboardingSchema } from "@/validation/onboarding.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const OnboardingForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  const { control, handleSubmit, watch, setValue, trigger, getFieldState } =
    form;

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    setSubmitting(true);
    try {
      console.log(data);

      const response = await createWorkspace(data);
      if (response.success) {
        const activeWorkspace = await getActiveWorkspace();
        if (activeWorkspace.success) {
          const setOnboardingCompletedResponse = await setOnboardingCompleted(
            activeWorkspace.data?.id || "",
          );
          if (setOnboardingCompletedResponse.success) {
            router.push("/inbox");
          } else {
            toast.error(setOnboardingCompletedResponse.message);
          }
        }
        router.push("/inbox");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={control}
          name="workspaceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-regular text-gray-600">
                Workspace Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your Workspace Name"
                  {...field}
                  className="w-80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting} className="w-80">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Workspace"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
