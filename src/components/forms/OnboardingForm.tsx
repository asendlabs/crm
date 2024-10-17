"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useServerAction } from "zsa-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { onboardingSchema } from "@/schemas/onboarding.schema";
import { onboardingAction } from "@/server/onboarding";

export const OnboardingForm = ({}: {}) => {
  const { execute, isPending, error } = useServerAction(onboardingAction);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<number>(0);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      marketingConsent: true,
      workspaceName: "",
      firstName: "",
      lastName: "",
    },
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = async (formData: z.infer<typeof onboardingSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      toast.error(err.message);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    reset();
  };

  return (
    <main className="grid h-screen items-center">
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {formState === 0
                ? "Create your Profile"
                : "Let's build a Workspace"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formState === 0
                ? "Enter your details to get started with Asend."
                : "Just one final step to get started."}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                {formState === 0 && (
                  <section className="grid gap-5">
                    <div className="grid gap-3">
                      <FormField
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                autoFocus
                                disabled={isSubmitting}
                                className="w-full"
                                {...field}
                                tabIndex={1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="w-full"
                                disabled={isSubmitting}
                                {...field}
                                tabIndex={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      tabIndex={3}
                      onClick={() => {
                        setIsSubmitting(true);
                        setFormState(1);
                        setIsSubmitting(false);
                      }}
                    >
                      {isSubmitting && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Continue
                    </Button>
                  </section>
                )}
                {formState === 1 && (
                  <>
                    <FormField
                      name="workspaceName"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Inc"
                              autoFocus
                              disabled={isSubmitting}
                              {...field}
                              tabIndex={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="mt-1"
                      tabIndex={5}
                    >
                      {isSubmitting && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit
                    </Button>
                  </>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};
