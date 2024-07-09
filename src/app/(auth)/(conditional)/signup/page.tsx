"use client";

import {
  Form,
  FormControl,
  FormDescription,
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
import { Map, Trophy, Wallet } from "lucide-react";
import { signUpSchema, verifySchema } from "@/validators/auth";

import AuthScreenHelper from "@/components/AuthScreenHelper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Sp from "@/components/Sp";
import { signUp } from "../../auth.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Helpers = () => {
  return (
    <section className="hidden lg:flex flex-col w-screen items-center justify-center bg-cover h-full bg-[url('https://img.freepik.com/free-photo/abstract-gradient-neon-lights_23-2149279180.jpg')]">
      <div className="flex flex-col gap-2 w-[450px]">
        <AuthScreenHelper
          title="Product Roadmap"
          description="See what Ascend is planning for the future"
          Icon={Map}
          goto="/roadmap"
        />
        <Sp />
      </div>
      <div className="flex flex-col gap-2 w-[450px]">
        <AuthScreenHelper
          title="Checkout the Testimonials"
          description="See what our customers are saying about us"
          Icon={Trophy}
          goto="/testimonials"
        />
        <Sp />
      </div>
      <div className="flex flex-col gap-2 w-[450px]">
        <AuthScreenHelper
          title="Upgrade to Pro"
          description="Unlock the full potential of Ascend CRM"
          Icon={Wallet}
          goto="/pricing"
        />
        <Sp />
      </div>
    </section>
  );
};

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
        // router.push("/dashboard");
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
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 flex-col gap-0"
            >
              {isSubmitting ? (
                <span className="text-base font-bold">Creating...</span>
              ) : (
                <span className="text-base font-bold">
                  Create your free Account
                </span>
              )}
            </Button>
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
      <Helpers />
    </main>
  );
}
