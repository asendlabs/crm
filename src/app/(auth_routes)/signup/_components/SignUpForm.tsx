"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import Link from "@/components/performance-link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordField } from "@/components/ui/password-input";
import { useRouter } from "@/hooks/use-performance-router";
import { useServerAction } from "zsa-react";
import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/server/sign-up";
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
                ? "Create a free Asend account"
                : "Continue to signup"}
            </h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {formStep === 0
                ? "Put in your email to get started with Asend"
                : "Just choose a strong enough password"}
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
                            placeholder="Enter your email"
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
                  <PasswordField placeholder="Choose a strong password" />
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
                    Continue with email
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
                    Continue
                  </Button>
                )}
                <Link
                  href={signInUrl}
                  className="pt-3 text-center text-sm text-muted-foreground hover:text-primary"
                >
                  Already have an account?
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
