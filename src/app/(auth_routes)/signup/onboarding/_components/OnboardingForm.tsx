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

export const OnboardingForm = () => {
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
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {formState === 0
                ? "create your profile"
                : "let's build a workspace"}
            </h1>
            <p className="text-sm text-muted-foreground">
              just a few final steps and you are all ready to go
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
                            <FormControl>
                              <Input
                                placeholder="enter your first name"
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
                            <FormControl>
                              <Input
                                placeholder="enter your last name (optional)"
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
                      className="h-10"
                      tabIndex={3}
                      onClick={() => {
                        setIsSubmitting(true);
                        setFormState(1);
                        setIsSubmitting(false);
                      }}
                    >
                      {isSubmitting && (
                        <Loader className="mr-2 size-4 animate-spin" />
                      )}
                      continue
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
                          <FormControl>
                            <Input
                              placeholder="choose a workspace name"
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
                      className="mt-1 h-10"
                      tabIndex={5}
                    >
                      {isSubmitting && (
                        <Loader className="mr-2 size-4 animate-spin" />
                      )}
                      get started
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
