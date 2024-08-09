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
import React, { useEffect, useState } from "react";
import { authenticate, resendCode, sendCode } from "@/server/auth.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ResendButton } from "./resend-button";
import { authenticationSchema } from "@/validation/auth.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const EmailForm = () => {
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      verifyCode: "",
    },
  });

  const { control, handleSubmit, watch, setValue, trigger, getFieldState } =
    form;

  const emailValue = watch("email");

  useEffect(() => {
    if (getFieldState("email").isDirty && failedSubmit) {
      trigger("email");
    }
  }, [emailValue, failedSubmit, getFieldState, trigger]);

  const onContinue = async () => {
    setLoading(true);
    try {
      const isValid = await trigger("email");
      if (!isValid) {
        setFailedSubmit(true);
        return;
      }
      setFailedSubmit(false);

      const response = await sendCode(emailValue);
      if (response.success) {
        setVerificationVisible(true);
      } else {
        toast.error(response.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerification = async (
    data: z.infer<typeof authenticationSchema>,
  ) => {
    setSubmitting(true);
    try {
      const response = await authenticate(data);
      if (response.redirectUrl) {
        router.replace(response.redirectUrl);
      } else {
        toast.error(response.message || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (emailValue !== email) {
      setVerificationVisible(false);
      setValue("verifyCode", "");
      setEmail(emailValue);
    }
  }, [emailValue, email, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitVerification)} className="w-full">
        <div className="flex flex-col items-center gap-5">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-regular text-gray-600">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Email"
                    {...field}
                    className="w-80"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onContinue();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isVerificationVisible && (
            <Button
              type="button"
              onClick={onContinue}
              disabled={loading}
              className="w-80"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          )}
        </div>
        {isVerificationVisible && (
          <div className="mt-5 flex flex-col items-center gap-5">
            <FormField
              control={control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-regular text-gray-600">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paste temporary code"
                      {...field}
                      className="w-80"
                    />
                  </FormControl>
                  <FormDescription>
                    <ResendButton email={emailValue} />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting} className="w-80">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default EmailForm;
