"use client";

import { ArrowRight, Loader2, LogOut } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import {
  getActiveUserAndWorkspace,
  getUser,
  updateUser,
} from "@/server/user.action";

import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { CloudUpload } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onboardingSchema } from "@/validation/onboarding.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [workspaceAccessible, setWorkspaceAccessible] = useState(false);
  const [userAccessible, setUserAccessible] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      marketingConsent: true,
      theme: "system",
      workspaceName: "",
      analyticsConsent: false,
    },
  });

  const { watch, trigger, handleSubmit } = form;

  useEffect(() => {
    const fetchUserWorkspaceStatus = async () => {
      try {
        const userWorkspaceStatus = await getActiveUserAndWorkspace();
        if (
          userWorkspaceStatus?.userCreated &&
          userWorkspaceStatus?.workspaceCreated
        ) {
          router.push("/inbox");
        } else {
          setUserAccessible(!userWorkspaceStatus?.userCreated);
          setWorkspaceAccessible(!userWorkspaceStatus?.workspaceCreated);
          setStep(userWorkspaceStatus?.userCreated ? 1 : 0);
        }
      } catch (error) {
        console.error("Error fetching user and workspace status:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserWorkspaceStatus();
  }, [router]);

  const handleNext = async () => {
    if (step === 0) {
      const isFullNameValid = await trigger("fullName");
      if (isFullNameValid) {
        const user = await getUser();
        if (user) {
          user.metadata.fullName = watch("fullName");
          user.metadata.theme = watch("theme") as "system" | "light" | "dark";
          user.metadata.consents.marketing = watch("marketingConsent");
          const res = await updateUser(user);
          if (!res?.success) {
            toast.error(res?.message);
          }
          setStep(1);
        }
      }
    }
    if (step === 1) {
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="mb-4 h-10 rounded bg-gray-200"></div>
      <div className="mb-4 h-10 rounded bg-gray-200"></div>
      <div className="h-10 rounded bg-gray-200"></div>
    </div>
  );

  if (pageLoading) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-6">
        <LoadingSkeleton />
      </main>
    );
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex-col rounded-lg border border-input bg-white px-6 py-10">
        <h1 className="mb-6 w-[25.5rem] text-2xl font-semibold">
          {step === 0 ? "Complete your Account" : "Create Workspace"}
        </h1>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            {step === 0 && userAccessible && (
              <div className="flex flex-col gap-7">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="flex h-[4.2rem] w-[4.2rem] cursor-pointer items-center justify-center rounded-xl bg-muted-foreground/10 p-1">
                          <CloudUpload />
                        </FormLabel>
                        <div className="flex flex-col gap-2">
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              className="hover:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription className="ml-1">
                            {" "}
                            JPG, PNG, GIF up to 2MB
                          </FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="eg. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row gap-2">
                      <FormControl>
                        <FormControl>
                          <Checkbox
                            className="mt-[0.45rem]"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormControl>
                      <FormLabel>I agree to receive marketing emails</FormLabel>
                    </FormItem>
                  )}
                />{" "}
                <FormDescription>
                  You can always change these later.
                </FormDescription>
              </div>
            )}
            {step === 1 && workspaceAccessible && (
              <div className="flex flex-col gap-7">
                <FormField
                  control={form.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-regular text-gray-600">
                        Workspace Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="eg. Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="logoImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Logo</FormLabel>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="flex h-[4.2rem] w-[4.2rem] cursor-pointer items-center justify-center rounded-xl bg-muted-foreground/10 p-1">
                          <CloudUpload />
                        </FormLabel>
                        <div className="flex flex-col gap-2">
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              className="hover:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription className="ml-1">
                            {" "}
                            JPG, PNG, GIF up to 2MB
                          </FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />{" "}
                <FormDescription>
                  You can always change these later.
                </FormDescription>
              </div>
            )}
            <Button
              type="submit"
              onClick={handleNext}
              className="mt-7 flex w-full items-center"
            >
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default OnboardingForm;
