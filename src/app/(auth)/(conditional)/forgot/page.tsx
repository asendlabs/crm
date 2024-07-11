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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { requestSchema } from "@/validators/authentication";
import { resetPassword } from "../../../../lib/actions/authentication.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof requestSchema>) {
    setIsSubmitting(true);
    try {
      const res = await resetPassword(values);
      if (res.success) {
        setSubmitted(true);
      }
      if (!res.success) {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  if (submitted) {
    return (
      <section className=" w-screen flex flex-col items-center justify-center h-screen gap-5">
        <Card className="flex flex-col max-w-96 items-center">
          <CardHeader>
            <h1 className="text-3xl font-semibold">Password Reset</h1>
          </CardHeader>
          <CardContent>
            <CardDescription className="flex flex-col gap-3">
              We will get back to you as soon as possible.
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
            <Button className="w-full" onClick={() => router.push("/signin")}>
              Back to Login
            </Button>
            <p className="text-xs font-medium opacity-70">
              You can close this window!
            </p>
          </CardFooter>
        </Card>
      </section>
    );
  }
  return (
    <section className=" w-screen flex flex-col items-center justify-center h-screen gap-5">
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
                  <Input {...field} placeholder="eg: john@acme.com" />
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
  );
}
