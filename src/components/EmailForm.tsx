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
import { Loader2, Router } from "lucide-react"; // Make sure to import the Loader2 component
import React, { useEffect, useState } from "react";
import { authenticate, resendCode, sendCode } from "@/actions/authentication";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticationSchema } from "@/validators/authentication";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ResendButton = ({ email }: { email: string }) => {
  const [time, setTime] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(timer);
  }, [isActive, time]);

  const handleClick = async () => {
    try {
      setResending(true);
      const response = await resendCode(email);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      if (response.success) {
        setTime(30);
        setIsActive(true);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-xs  flex flex-row items-center gap-1 text-gray-400">
      We sent a code to your inbox.
      <button
        onClick={handleClick}
        type="button"
        disabled={isActive || resending}
        className={`opacity-95 font-medium ${
          !isActive
            ? "hover:underline cursor-pointer text-blue-500"
            : "cursor-not-allowed"
        }`}
      >
        {resending ? (
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
        ) : isActive ? (
          `Resend in ${time}s`
        ) : (
          "Resend"
        )}
      </button>
    </div>
  );
};

const EmailForm = () => {
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const typeName = type === "login" ? "Login" : "Sign Up";

  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      verifyCode: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getFieldState,
    formState,
  } = form;

  const emailValue = watch("email");

  useEffect(() => {
    if (getFieldState("email").isDirty && failedSubmit) {
      trigger("email");
    }
  }, [emailValue]);

  const onContinue = async () => {
    try {
      const isValid = await trigger("email");
      if (!isValid) {
        setFailedSubmit(true);
        return;
      }
      setFailedSubmit(false);
      setLoading(true);
      const response = await sendCode(emailValue);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      if (response.success) {
        setVerificationVisible(true);
        setType(response.type);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerification = async (
    data: z.infer<typeof authenticationSchema>
  ) => {
    setSubmitting(true);
    try {
      const response = await authenticate(data);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      router.replace("/home");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (emailValue !== email) {
      setVerificationVisible(false);
      setValue("verifyCode", ""); // Clear verification code
      setEmail(emailValue);
    }
  }, [emailValue, email, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitVerification)} className="w-full">
        <div className="flex flex-col items-center gap-3">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600 font-regular">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Email"
                    {...field}
                    className="w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isVerificationVisible && (
            <Button
              type="button"
              onClick={() => onContinue()}
              disabled={loading}
              className="w-80"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                </>
              ) : (
                "Continue"
              )}
            </Button>
          )}
        </div>
        <>
          {isVerificationVisible && (
            <div className="flex flex-col items-center gap-3 mt-3">
              <FormField
                control={control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600 font-regular">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Paste ${typeName} Code`}
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
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    {type === "login" ? "Logging in..." : "Signing up..."}{" "}
                  </>
                ) : (
                  typeName
                )}
              </Button>
            </div>
          )}
        </>
      </form>
      {/* <div className="flex flex-row mt-3 justify-center">
        {isVerificationVisible && <ResendButton email={emailValue} />}
      </div> */}
    </Form>
  );
};

export default EmailForm;
