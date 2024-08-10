"use client";

import React, { useEffect, useState } from "react";

import { Form } from "@/components/ui/form";
import { OnboardingFormStepOne } from "./steps/step-one";
import { OnboardingFormStepZero } from "./steps/step-zero";
import { onboardingSchema } from "@/validation/onboarding.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [failedSubmit, setFailedSubmit] = useState(false);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      workspaceName: "",
      fullName: "",
    },
  });

  const { control, handleSubmit, watch, trigger, getFieldState } = form;

  const fullNameValue = watch("fullName");
  useEffect(() => {
    if (getFieldState("fullName").isDirty && failedSubmit) {
      trigger("fullName");
    }
  }, [fullNameValue, failedSubmit, getFieldState, trigger]);

  const onContinue = async () => {
    try {
      const isValid = await trigger("fullName");
      if (!isValid) {
        setFailedSubmit(true);
        return;
      }
      setFailedSubmit(false);
      toast.success("Full Name: " + fullNameValue);
      setStep(1);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      toast.success(
        `Full Name: ${data.fullName}, Workspace Name: ${data.workspaceName ?? ""}`,
      );
      // Add your form submission logic here
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {step === 0 && (
          <OnboardingFormStepZero form={form} continueHandler={onContinue} />
        )}
        {step === 1 && <OnboardingFormStepOne form={form} />}
      </form>
    </Form>
  );
};

export default OnboardingForm;
