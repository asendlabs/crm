"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifySchema } from "@/validators/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VerifyEmail() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
    }, 1000);
  }
  return (
    <main className="flex flex-row max-h-screen min-h-screen items-center h-screen justify-between">
      <section className=" w-screen flex flex-col items-center justify-center h-full gap-5">
        <div className="text-center ">
          <h1 className="text-3xl font-semibold">Verify your Email</h1>
          <p className="font-medium opacity-70">
            Enter the code sent to your email.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 min-w-80 text-sm"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Complete Sign Up"}
              </Button>
              <Button variant={"link"}>Resend Code</Button>
            </div>
          </form>
        </Form>
      </section>
      <section className="hidden lg:flex w-screen items-center justify-center h-full bg-[url('https://img.freepik.com/free-photo/abstract-gradient-neon-lights_23-2149279180.jpg?t=st=1720412682~exp=1720416282~hmac=fe5891b43b045cf62554a2f35a6f0e56255e21cb9e5a15e4df298b562c54a70d&w=1480')]">
      </section>
    </main>
  );
}
