"use client";

import { Book, Send, Timer } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sp from "@/components/Sp";
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
            className="flex flex-col gap-5 w-96 text-sm"
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
                  <FormLabel className="flex justify-between text-sm">
                    Password{" "}
                    <Link
                      href="/forgot-password"
                      className="opacity-70 hover:opacity-100 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </FormLabel>
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
            <div className="flex items-center gap-1.5 hover:opacity-100 font-medium"></div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 flex-col gap-0"
            >
              {isSubmitting ? (
                <span className="text-base font-bold">Signing In...</span>
              ) : (
                <span className="text-base font-bold">
                  Sign In to Dashboard
                </span>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm flex gap-1 opacity-75 pt-2">
          <p className="text-sm">Don't have an account?</p>
          <Link
            href="/signup"
            className="underline hover:opacity-100 font-medium"
          >
            Create a free account
          </Link>
        </div>
      </section>
      <section className="hidden lg:flex flex-col w-screen items-center justify-center bg-cover h-full bg-[url('https://img.freepik.com/free-photo/abstract-gradient-neon-lights_23-2149279180.jpg')]">
        <div className="flex flex-col gap-2 w-[450px]">
          <AuthScreenHelper
            title="Read the Docs"
            description="Tap into the full potential of Ascend CRM"
            Icon={Book}
            goto="/docs"
          />
          <Sp />
        </div>
        <div className="flex flex-col gap-2 w-[450px]">
          <AuthScreenHelper
            title="Visit our Support Center"
            description="Get Guidance from our Support Team"
            Icon={Send}
            goto="/support"
          />
          <Sp />
        </div>
        <div className="flex flex-col gap-2 w-[450px]">
          <AuthScreenHelper
            title="Check out the latest releases"
            description="Find out what's new in the latest releases"
            Icon={Timer}
            goto="/updates"
          />
          <Sp />
        </div>
      </section>
    </main>
  );
}
