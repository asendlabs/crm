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
import { cn } from "@/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useServerAction } from "zsa-react";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordField } from "../ui/password-input";

export const SignUpForm = ({
  signUp,
}: {
  signUp: (formData: z.infer<typeof signUpSchema>) => Promise<any>;
}) => {
  const { execute, isPending, error } = useServerAction(signUp);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, reset } = form;

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

  return (
    <div className="grid h-screen items-center">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="flex flex-row items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
              <Image
                src={"/assets/logo_app.svg"}
                alt="Logo"
                width={25}
                height={25}
              />
              Create a free account
            </h1>
            <p className="text-sm text-muted-foreground">
              Provide your email and choose a password.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <Form {...form}>
              <form
                className="grid gap-3"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
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
                          autoComplete="off"
                          disabled={isSubmitting}
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PasswordField placeholder="Choose a strong password " />
                <Button disabled={isSubmitting} type="submit" className="mt-1">
                  {isSubmitting && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Continue with Email
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <Button variant="outline" type="button" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Image
                  src="/logos/google.png"
                  alt="Google"
                  height={16}
                  width={16}
                  className="mr-2"
                />
              )}{" "}
              Continue with Google {/* TODO: Add funcionality */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
