"use client";

import { signUpValidator } from "@/validators/auth.validator";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { svCheckEmailAvailability, svSignUp } from "@/server/server-auth";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Image from "next/image";

export const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);
  const [failedSubmit, setFailedSubmit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signUpValidator>>({
    resolver: zodResolver(signUpValidator),
  });
  const { control, watch, trigger } = form;

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (formState === 0 && failedSubmit) {
      form.clearErrors("email");
      setFailedSubmit(false);
    }
    if (formState === 1 && failedSubmit) {
      form.clearErrors("password");
      setFailedSubmit(false);
    }
  }, [formState, emailValue, passwordValue]);

  const continueHandler = async () => {
    if (formState === 0) {
      await onEmailSubmit();
    } else if (formState === 1) {
      await onPasswordSubmit();
    } else {
      return;
    }
  };

  const keyDownHandler = async (e: any) => {
    if (e.key === "Enter" && !isLoading) {
      await continueHandler();
    }
  };

  const onEmailSubmit = async () => {
    setIsLoading(true);
    try {
      const isValid = await trigger("email");

      if (!isValid) {
        setFailedSubmit(true);
        return;
      }

      const serverResponse = await svCheckEmailAvailability(emailValue);
      if (!serverResponse.success) {
        form.setError("email", { message: serverResponse.message });
        setFailedSubmit(true);
        return;
      }

      setFormState(1);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onPasswordSubmit = async () => {
    setIsLoading(true);
    try {
      const serverResponse = await svSignUp({
        email: emailValue,
        password: passwordValue,
      });
      if (!serverResponse.success) {
        toast.error(serverResponse.message);
        return;
      }
      router.replace("/inbox");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      form.clearErrors();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {formState === 0 && (
        <>
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src="/assets/images/google_g.png"
                alt="Google"
                height={16}
                width={16}
                className="mr-2"
              />
            )}{" "}
            Sign Up With Google {/* TODO: Add functionality */}
          </Button>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      <Form {...form}>
        <form className="grid gap-4">
          {formState === 0 && (
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@company.com"
                      autoCapitalize="none"
                      disabled={isLoading}
                      onKeyDown={async (e) => {
                        await keyDownHandler(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {formState === 1 && (
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a strong password"
                      type="password"
                      disabled={isLoading}
                      onKeyDown={async (e) => {
                        await keyDownHandler(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button disabled={isLoading} type="button" onClick={continueHandler}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formState === 0
              ? "Continue"
              : formState === 1
                ? "Sign Up"
                : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
