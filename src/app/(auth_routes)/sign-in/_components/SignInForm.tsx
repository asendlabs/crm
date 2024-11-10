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
import { signInSchema } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useServerAction } from "zsa-react";

import Image from "next/image";
import Link from "@/components/performance-link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordField } from "@/components/ui/password-input";
import { useRouter } from "@/hooks/use-performance-router";
import { signInAction } from "@/server/sign-in";
import { Logo } from "@/components/Logo";

export const SignInForm = () => {
  const { execute } = useServerAction(signInAction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = async (formData: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      toast.error(err.message, {
        duration: 2000,
      });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    reset();
  };

  return (
    <main className="grid h-screen items-center">
      {/* <Link
        href="/sign-up"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Sign Up
      </Link> */}
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="flex flex-row items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
              <Logo className="h-6 w-6" />
              Sign In to Asend
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to sign in.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {}}
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
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div> */}
            <Form {...form}>
              <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          autoCapitalize="none"
                          autoComplete="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PasswordField placeholder="Enter your password" />
                <Button disabled={isSubmitting} type="submit" className="mt-1">
                  {isSubmitting && (
                    <Loader className="mr-2 size-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};
