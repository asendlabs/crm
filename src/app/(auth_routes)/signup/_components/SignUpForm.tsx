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
import { signUpSchema } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";

import Image from "next/image";
import Link from "@/components/performance-link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordField } from "@/components/ui/password-input";
import { useRouter } from "@/hooks/use-performance-router";
import { useServerAction } from "zsa-react";
import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/server/sign-up";
import { Logo } from "@/components/Logo";
import { signInUrl } from "@/constants";

export const SignUpForm = () => {
  const { execute, isPending, error } = useServerAction(signUpAction);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formStep, setFormStep] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("redirecterror") === "nouser") {
      toast.error(
        "You need to create an account or sign in before accessing the checkout page.",
      );
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, reset, trigger } = form;

  const onSubmit = async (formData: z.infer<typeof signUpSchema>) => {
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

  const nextStep = async () => {
    const valid = await form.trigger("email");
    if (!valid) {
      return;
    }
    form.clearErrors();
    setFormStep(1);
  };

  return (
    <div className="grid h-screen items-center">
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2">
            <h1 className="flex flex-row items-center gap-2 text-2xl font-semibold tracking-tight">
              {formStep === 0
                ? "create a free asend account"
                : "continue to signup"}
            </h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {formStep === 0
                ? "put in your email to get started with asend"
                : "just choose a strong enough password"}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <Form {...form}>
              <form
                className="grid gap-3"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                {formStep === 0 && (
                  <FormField
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="enter your email"
                            autoCapitalize="none"
                            autoComplete="off"
                            disabled={isSubmitting}
                            onKeyDown={async (e) =>
                              e.key === "Enter" && (await nextStep())
                            }
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {formStep === 1 && (
                  <PasswordField placeholder="choose a strong password" />
                )}
                {formStep === 0 && (
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    onClick={async () => await nextStep()}
                    className="mt-1 h-10"
                  >
                    {isSubmitting && (
                      <Loader className="mr-2 size-4 animate-spin" />
                    )}
                    continue with email
                  </Button>
                )}
                {formStep === 1 && (
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-1 h-10"
                  >
                    {isSubmitting && (
                      <Loader className="mr-2 size-4 animate-spin" />
                    )}
                    continue
                  </Button>
                )}
                <Link
                  href={signInUrl}
                  className="pt-3 text-center text-sm text-muted-foreground hover:text-primary"
                >
                  already have an account?
                </Link>
              </form>
            </Form>
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={async () => await handleOAuthButtonClick("google")}
            >
              {isSubmitting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : (
                <Image
                  src="/logos/google.png"
                  alt="Google"
                  height={16}
                  width={16}
                  className="mr-2"
                />
              )}{" "}
              Continue with Google
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
