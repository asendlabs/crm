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
import { signUpSchema } from "@/validators/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
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
          <h1 className="text-3xl font-semibold">Start your Journey</h1>
          <p className="font-medium opacity-70">Create a free account.</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-96 text-sm"
          >
            <div className="flex flex-row gap-5">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className="flex items-center opacity-75 text-sm gap-2 font-medium">
                <Checkbox name="remember" id="remember" />
                <label htmlFor="remember">I agree to the <Link href="/docs/terms-of-service" className="underline hover:opacity-100">Terms of Service</Link></label>    
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting" : "Next Step ->"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm flex gap-1 opacity-75 pt-2">
          <p className="text-sm">Already have an account?</p>
          <Link
            href="/sign-in"
            className="underline hover:opacity-100 font-medium"
          >
            Login to Dashboard
          </Link>
        </div>
      </section>
      <section className="hidden lg:flex w-screen items-center justify-center h-full">
        // helpers
      </section>
    </main>
  );
}
