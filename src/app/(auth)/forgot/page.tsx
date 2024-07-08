"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import AuthScreenHelper from "@/components/AuthScreenHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { forgotPasswordSchema } from "@/validators/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  }
  if (submitted) {
    return (
      <main className="flex flex-row max-h-screen min-h-screen items-center h-screen justify-between">
        <section className=" w-screen flex flex-col items-center justify-center h-full gap-5">
          <Card className="flex flex-col max-w-96 items-center">
            <CardHeader>
              <h1 className="text-3xl font-semibold">Password Reset</h1>
            </CardHeader>
            <CardContent>
              <CardDescription className="flex flex-col gap-3">
                <p>
                  A password reset link has been sent to{" "}
                  <span className="font-semibold text-primary">
                    {"warisareshi@gmail.com"}
                  </span>
                </p>
                <p>
                  We have sent you an email with a link to reset your password.
                </p>
                <p>
                  If you don't see the email in a few minutes, check your spam
                  folder. Or try again.
                </p>
              </CardDescription>
            </CardContent>
            <CardFooter className=" flex flex-col gap-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/support")}
              >
                If you still have issues, contact us {"->"}
              </Button>
              <Button
                className="w-full"
                onClick={() => router.push("/sign-in")}
              >
                Back to Login
              </Button>
              <p className="text-xs font-medium opacity-70">
                You can close this window
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>
    );
  }
  return (
    <main className="flex flex-row max-h-screen min-h-screen items-center h-screen justify-between">
      <section className=" w-screen flex flex-col items-center justify-center h-full gap-5">
        <div className="text-center ">
          <h1 className="text-3xl font-semibold">Forgot Password</h1>
          <p className="font-medium opacity-70">Provide your Email Address</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-80 text-sm"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="jane@acme.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
