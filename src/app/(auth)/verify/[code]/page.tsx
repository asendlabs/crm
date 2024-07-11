"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyCode } from "../../auth.actions";
import { verifySchema } from "@/validators/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VerifyEmail() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { code } = useParams<{ code: string }>();
  const [email, setEmail] = useState("");

  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: code,
    },
  });

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    try {
      const res = await verifyCode(data.verifyCode);
      if (res.success) {
        setEmail(res.email?.toString() || "");
        setIsSubmitting(false);
        setSubmitted(true);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setIsSubmitting(false);
      console.log(error);
    }
  }

  if (submitted) {
    return (
      <section className="w-screen flex flex-col items-center justify-center h-screen gap-5">
        <Card className="flex flex-col max-w-96 items-center shadow-lg p-6">
          <CardHeader>
            <h1 className="text-3xl font-semibold">Email Verified</h1>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your email{" "}
              <span className="font-semibold text-primary">{email}</span> has
              been successfully verified.
              <br />
              You can now fully utilize all the features of our platform.
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 w-full">
            <Button className="w-full" onClick={() => router.push("/home")}>
              Back to Home
            </Button>
            <p className="text-xs font-medium opacity-70 text-center">
              You can close this window
            </p>
          </CardFooter>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-screen flex flex-col items-center justify-center h-screen gap-5">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Verify Email</h1>
        <h2 className="text-lg text-gray-700 mt-2">
          Let's confirm your identity to get started.
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-96 text-sm bg-white p-6 rounded-lg shadow-md"
        >
          <p className="text-gray-600">
            Click the button below to verify your email address. This helps us
            keep your account secure.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
          <FormMessage />
        </form>
      </Form>
    </section>
  );
}
