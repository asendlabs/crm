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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "@/lib/actions/authentication.actions";
import { signInSchema } from "@/validators/authentication";
import { toast } from "sonner";
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
    try {
      setIsSubmitting(true);
      const res = await signIn(values);
      if (res.success) {
        toast.success(res.message);
        router.push("/home");
      }
      if (!res.success) {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <section className=" w-screen flex flex-col items-center justify-center h-screen gap-5">
      <div className="text-center ">
        <h1 className="text-4xl font-semibold text">Welcome Back</h1>
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
                  <Input {...field} placeholder="Enter your email" />
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
                    href="/forgot"
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
              <span className="text-base font-bold">Sign In to Home</span>
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
  );
}
