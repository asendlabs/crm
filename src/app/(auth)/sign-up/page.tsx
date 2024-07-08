"use client";

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
import { Map, Trophy, Wallet } from "lucide-react";
import { signUpSchema, verifySchema } from "@/validators/auth";

import AuthScreenHelper from "@/components/AuthScreenHelper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Sp from "@/components/Sp";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const Helpers = () => {
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
  const [verifyRoute, setVerifyRoute] = useState<{ verifyRoute: boolean }>({
    verifyRoute: false,
  });

  const router = useRouter();
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setVerifyRoute({ verifyRoute: true });
    }, 1000);
  }

  async function onVerifySubmit(values: z.infer<typeof verifySchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
    }, 1000);
  }

  if (verifyRoute.verifyRoute) {
    return (
      <main className="flex flex-row max-h-screen min-h-screen items-center h-screen justify-between">
        <section className=" w-screen flex flex-col items-center justify-center h-full gap-5">
          <div className="text-center ">
            <h1 className="text-3xl font-semibold">Verify your Email</h1>
            <p className="font-medium opacity-70">
              Enter the code sent to your email.
            </p>
          </div>
          <Form {...verifyForm}>
            <form
              onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
              className="flex flex-col gap-5 min-w-80 text-sm"
            >
              <FormField
                name="code"
                control={verifyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={8}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
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
              </div>
            </form>
                <Button variant={"link"} className="-mt-3">Resend Code</Button>
          </Form>
        </section>
        <Helpers />
      </main>
    );
  }

  return (
    <main className="flex flex-row max-h-screen min-h-screen items-center h-screen justify-between">
      <section className=" w-screen flex flex-col items-center justify-center h-full gap-5">
        <div className="text-center ">
          <h1 className="text-3xl font-semibold">Start your Journey</h1>
          <p className="font-medium opacity-70">Create a free account.</p>
        </div>
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-96 text-sm"
          >
            <div className="flex flex-row gap-5">
              <FormField
                name="firstName"
                control={signUpForm.control}
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
                control={signUpForm.control}
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
              control={signUpForm.control}
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
              control={signUpForm.control}
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
              control={signUpForm.control}
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
              <label htmlFor="remember">
                I agree to the{" "}
                <Link
                  href="/docs/terms-of-service"
                  className="underline hover:opacity-100"
                >
                  Terms of Service
                </Link>
              </label>
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
      <Helpers />
    </main>
  );
}
