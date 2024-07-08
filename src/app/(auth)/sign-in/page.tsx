"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInSchema } from "@/validators/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
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
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="font-medium opacity-70">Please enter your details.</p>
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
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between opacity-75 text-sm">
              <div className="flex items-center gap-1.5 hover:opacity-100 font-medium">
                <Checkbox name="remember" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>
              <Link
                href="/forgot-password"
                className="underline hover:no-underline font-medium hover:opacity-100"
              >
                Forgot Password
              </Link>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm flex gap-1 opacity-75 pt-2">
          <p className="text-sm">Don't have an account?</p>
          <Link
            href="/sign-up"
            className="underline hover:opacity-100 font-medium"
          >
            Create a free account
          </Link>
        </div>
      </section>
      <section className="hidden lg:flex w-screen items-center justify-center h-full">
        // helpers
      </section>
    </main>
  );
}
