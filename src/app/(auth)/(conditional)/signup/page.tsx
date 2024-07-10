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
import { signUp } from "../../auth.actions";
import { signUpSchema } from "@/validators/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setIsSubmitting(true);
      const res = await signUp(values);
      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard");
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
        <h1 className="text-3xl font-semibold">Start your Journey</h1>
        <p className="font-medium opacity-70">Create a free account.</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-96 text-sm"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="eg: John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="eg: john@acme.com" />
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
                    placeholder="Choose a strong password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-base "
            >
              {isSubmitting ? "Submitting..." : "Create your Account"}
            </Button>
          </div>
          <div className="text-sm opacity-65 font-medium text-center">
            By creating your account, you agree to our{" "}
            <Link href="/legal/terms-of-service" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy-policy" className="underline">
              Privacy Policy
            </Link>
          </div>
        </form>
      </Form>
    </section>
  );
}
