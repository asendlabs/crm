"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { verificationCodeSchema } from "@/schemas/auth.schema";
import { useServerAction } from "zsa-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ResendVerifyEmailButton } from "./related/ResendVerifyEmailButton";
import Image from "next/image";

export const VerifyEmailForm = ({
  email,
  action,
  resendAction,
}: {
  email: string;
  action: (formData: z.infer<typeof verificationCodeSchema>) => Promise<any>;
  resendAction: () => Promise<any>;
}) => {
  const { execute, isPending, error } = useServerAction(action);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });
  const { handleSubmit, control, reset, setError } = form;

  const onSubmit = async (formData: z.infer<typeof verificationCodeSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      setError("code", { message: err.message });
      // toast.error(err.message); // Show a toast instead
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4 py-8">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="flex flex-row items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
          <Image
            src={"/assets/logo_app.svg"}
            alt="Logo"
            width={25}
            height={25}
          />
          Verify your Email
        </h1>
        <div className="group mt-2 flex flex-row items-center justify-center gap-2 text-sm text-gray-600">
          <p>
            We sent a code to{" "}
            <span
              className={
                email ? "cursor-pointer font-semibold" : "text-muted-foreground"
              }
            >
              {email ? email : "your email"}
            </span>
          </p>

          {""}
        </div>
      </div>
      {/* Form */}
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              name="code"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={5}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup className="h-[4.25rem] w-full">
                        <InputOTPSlot
                          index={0}
                          className="h-full w-full text-2xl"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-full w-full text-2xl"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-full w-full text-2xl"
                        />
                        <InputOTPSlot
                          index={3}
                          className="h-full w-full text-2xl"
                        />
                        <InputOTPSlot
                          index={4}
                          className="h-full w-full text-2xl"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-1 w-96 select-none"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
          </form>
        </Form>
      </div>
      <ResendVerifyEmailButton />
    </div>
  );
};
