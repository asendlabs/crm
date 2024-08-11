"use client";

import React, { useEffect, useState } from "react";

import { Form } from "@/components/ui/form";
import { OnboardingFormStepOne } from "./steps/step-one";
import { OnboardingFormStepZero } from "./steps/step-zero";
import { getActiveUserAndWorkspace } from "@/server/user.action";
import { onboardingSchema } from "@/validation/onboarding.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const OnboardingForm = () => {
  const [step, setStep] = useState(0); // Initially, no step is set
  const [failedSubmit, setFailedSubmit] = useState(false);
  const [workspaceAccessible, setWorkspaceAccessible] = useState(false);
  const [userAccessible, setUserAccessible] = useState(false);
  const router = useRouter(); // Use the router for navigation

  useEffect(() => {
    (async () => {
      const userWorkspaceStatus = await getActiveUserAndWorkspace();
      console.log(userWorkspaceStatus);
      if (
        userWorkspaceStatus?.userCreated &&
        userWorkspaceStatus?.workspaceCreated
      ) {
        // EVERYTHING IS CREATED, REDIRECT TO /inbox
        router.push("/inbox");
      } else if (
        !userWorkspaceStatus?.userCreated &&
        !userWorkspaceStatus?.workspaceCreated
      ) {
        setStep(0); // NOTHING CREATED, START AT STEP 0
        setUserAccessible(true);
        setWorkspaceAccessible(true);
      } else if (
        !userWorkspaceStatus?.userCreated &&
        userWorkspaceStatus?.workspaceCreated
      ) {
        setStep(0); // WORKSPACE IS CREATED, START AT STEP 0
        setUserAccessible(true);
        setWorkspaceAccessible(false);
      } else if (
        userWorkspaceStatus?.userCreated &&
        !userWorkspaceStatus?.workspaceCreated
      ) {
        setStep(1); // USER IS CREATED, START AT STEP 1
        setUserAccessible(false);
        setWorkspaceAccessible(true);
      }
    })();
  }, [router]);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      profileImage: "",
      marketingConsent: false,
      theme: "system",
      workspaceName: "",
      logoImage: "",
      analyticsConsent: false,
    },
  });

  const { watch, trigger, getFieldState } = form;

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

  const onSubmit = async () => {};

  if (step === null) return null;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <Form {...form}>
        <form className="flex flex-col gap-6">
          {step === 0 && userAccessible && (
            <OnboardingFormStepZero form={form} submitHandler={onContinue} />
          )}
          {step === 1 && workspaceAccessible && (
            <OnboardingFormStepOne form={form} submitHandler={onSubmit} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;
